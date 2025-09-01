// /app/api/admin/employees/sync/analyze/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { read, utils } from "xlsx";
import { Role, Prisma } from "@prisma/client";
import { withAuthorization } from "@/lib/auth-hof";
import { randomUUID } from "crypto";

// --- Definisi Tipe ---
type ExcelRow = {
	"Personnel Area": string;
	"Pers. Number": string;
	"Employee Name": string;
	Position: string;
	"Personnel Subarea": string;
	Lv: string;
	TMK: string | number | Date;
	Birthdate: string | number | Date;
	Gender: "Male" | "Female";
	Pend: string;
	"Nama Sekolah/Univ": string;
	Jurusan: string;
};

export type ValidatedRow = ExcelRow & {
	employeeId: string;
	branchId: string;
	departmentId: string;
	positionId: string;
	levelId: string;
	birthDate: Date;
	hireDate: Date;
	role: Role;
};

interface ChangeDetail {
	field: string;
	from: string | null | undefined;
	to: string | null | undefined;
}

interface EmployeeUpdate {
	employeeId: string;
	name: string;
	changes: ChangeDetail[];
}

interface SyncAnalysis {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: EmployeeUpdate[];
	toDelete: { employeeId: string; name: string }[];
	fullData: ValidatedRow[];
}

// --- Helper Functions ---
function parseDate(dateValue: string | number | Date): Date | null {
	if (dateValue instanceof Date) {
		if (isNaN(dateValue.getTime())) return null;
		return new Date(
			Date.UTC(
				dateValue.getUTCFullYear(),
				dateValue.getUTCMonth(),
				dateValue.getUTCDate()
			)
		);
	}
	if (typeof dateValue === "string") {
		const parts = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
		if (!parts) return null;
		const day = parseInt(parts[1], 10);
		const month = parseInt(parts[2], 10) - 1;
		let year = parseInt(parts[3], 10);
		if (year < 100) year = year <= 29 ? 2000 + year : 1900 + year;
		if (month < 0 || month > 11 || day < 1 || day > 31) return null;
		const date = new Date(Date.UTC(year, month, day));
		if (isNaN(date.getTime())) return null;
		return date;
	}
	if (typeof dateValue === "number") {
		const utcMilliseconds = (dateValue - 25569) * 86400000;
		const date = new Date(utcMilliseconds);
		if (isNaN(date.getTime())) return null;
		return new Date(
			Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
		);
	}
	return null;
}

function normalizeLevelName(
	levelAbbr: string
): "STAFF" | "SUPERVISOR" | "MANAGER" | null {
	const lowerCaseName = (levelAbbr || "").toLowerCase();
	if (lowerCaseName.includes("mgr") || lowerCaseName.includes("manager"))
		return "MANAGER";
	if (
		lowerCaseName.includes("spv") ||
		lowerCaseName.includes("supervisor") ||
		lowerCaseName.includes("coord")
	)
		return "SUPERVISOR";
	if (lowerCaseName.includes("staff") || lowerCaseName.includes("admin"))
		return "STAFF";
	return null;
}

export const POST = withAuthorization(
	{ resource: "employee", action: "upload" },
	async (req: NextRequest) => {
		try {
			// **Logika Baru: Cek Proses Macet**
			const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
			await prisma.syncProcess.updateMany({
				where: {
					status: "PROCESSING",
					startedAt: { lt: sixtyMinutesAgo },
				},
				data: {
					status: "FAILED",
					error: "Proses melebihi batas waktu 60 menit.",
					endedAt: new Date(),
				},
			});

			// **Logika Baru: Cek Proses Aktif**
			const activeJob = await prisma.syncProcess.findFirst({
				where: { status: "PROCESSING" },
			});
			if (activeJob) {
				return NextResponse.json(
					{
						message:
							"Proses sinkronisasi sebelumnya masih berjalan. Harap tunggu hingga selesai.",
					},
					{ status: 409 } // Conflict
				);
			}

			const formData = await req.formData();
			const file = formData.get("file") as File;
			if (!file)
				return NextResponse.json(
					{ message: "No file uploaded." },
					{ status: 400 }
				);

			const buffer = await file.arrayBuffer();
			const workbook = read(buffer, { type: "buffer" });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const data: ExcelRow[] = utils.sheet_to_json(sheet);
			if (data.length === 0)
				return NextResponse.json({ message: "File kosong." }, { status: 400 });

			// (Sisa logika validasi dan perbandingan tetap sama seperti sebelumnya...)
			const [dbBranches, dbDepartments, dbPositions, dbLevels, allDbEmployees] =
				await prisma.$transaction([
					prisma.branch.findMany(),
					prisma.department.findMany(),
					prisma.position.findMany(),
					prisma.level.findMany(),
					prisma.employee.findMany({
						include: {
							branch: true,
							department: true,
							position: true,
							level: true,
						},
					}),
				]);

			const branchMap = new Map(
				dbBranches.map((b) => [b.name.toLowerCase(), b.id])
			);
			const levelMap = new Map(
				dbLevels.map((l) => [l.name.toLowerCase(), l.id])
			);
			const departmentMap = new Map(
				dbDepartments.map((d) => [
					`${d.name.toLowerCase()}|${d.branchId}`,
					d.id,
				])
			);
			const positionMap = new Map(
				dbPositions.map((p) => [`${p.name.toLowerCase()}|${p.branchId}`, p.id])
			);
			const dbEmployeeMap = new Map(
				allDbEmployees.map((e) => [e.employeeId, e])
			);

			const errors: { row: number; employeeId: string; error: string }[] = [];
			const validRows: ValidatedRow[] = [];

			for (let i = 0; i < data.length; i++) {
				const row = data[i];
				const rowNum = i + 2;
				const employeeId = row["Pers. Number"]?.toString().split(" ")[0];
				if (!employeeId) {
					if (Object.keys(row).length > 0)
						errors.push({
							row: rowNum,
							employeeId: "N/A",
							error: "Kolom 'Pers. Number' kosong.",
						});
					continue;
				}

				const currentErrors: string[] = [];
				const branchId = branchMap.get(row["Personnel Area"]?.toLowerCase());
				if (!branchId)
					currentErrors.push(
						`Cabang '${row["Personnel Area"]}' tidak ditemukan.`
					);

				const normalizedLevel = normalizeLevelName(row["Lv"] || "");
				const levelId = normalizedLevel
					? levelMap.get(normalizedLevel.toLowerCase())
					: undefined;
				if (!levelId) currentErrors.push(`Level '${row["Lv"]}' tidak valid.`);

				const birthDate = parseDate(row["Birthdate"]);
				if (!birthDate) currentErrors.push(`Format tanggal lahir tidak valid.`);

				const hireDate = parseDate(row["TMK"]);
				if (!hireDate) currentErrors.push(`Format tanggal masuk tidak valid.`);

				let departmentId: string | undefined;
				let positionId: string | undefined;

				if (branchId) {
					departmentId = departmentMap.get(
						`${row["Personnel Subarea"]?.toLowerCase()}|${branchId}`
					);
					if (!departmentId)
						currentErrors.push(
							`Departemen '${row["Personnel Subarea"]}' tidak ditemukan di cabang ini.`
						);

					positionId = positionMap.get(
						`${row["Position"]?.toLowerCase()}|${branchId}`
					);
					if (!positionId)
						currentErrors.push(
							`Posisi '${row["Position"]}' tidak ditemukan di cabang ini.`
						);
				}

				if (currentErrors.length > 0) {
					errors.push({
						row: rowNum,
						employeeId,
						error: currentErrors.join("; "),
					});
				} else {
					validRows.push({
						...row,
						employeeId,
						branchId: branchId!,
						departmentId: departmentId!,
						positionId: positionId!,
						levelId: levelId!,
						birthDate: birthDate!,
						hireDate: hireDate!,
						role: Role.EMPLOYEE,
					});
				}
			}

			if (errors.length > 0)
				return NextResponse.json({ errors }, { status: 400 });

			const fileEmployeeIds = new Set(validRows.map((row) => row.employeeId));

			const toCreate = validRows
				.filter((row) => !dbEmployeeMap.has(row.employeeId))
				.map((r) => ({ employeeId: r.employeeId, name: r["Employee Name"] }));

			const toUpdate: EmployeeUpdate[] = [];
			validRows.forEach((row) => {
				const dbEmployee = dbEmployeeMap.get(row.employeeId);
				if (!dbEmployee) return;

				const changes: ChangeDetail[] = [];
				if (dbEmployee.fullName !== row["Employee Name"])
					changes.push({
						field: "Nama",
						from: dbEmployee.fullName,
						to: row["Employee Name"],
					});
				if (dbEmployee.branchId !== row.branchId)
					changes.push({
						field: "Cabang",
						from: dbEmployee.branch.name,
						to: row["Personnel Area"],
					});
				if (dbEmployee.departmentId !== row.departmentId)
					changes.push({
						field: "Departemen",
						from: dbEmployee.department.name,
						to: row["Personnel Subarea"],
					});
				if (dbEmployee.positionId !== row.positionId)
					changes.push({
						field: "Posisi",
						from: dbEmployee.position.name,
						to: row["Position"],
					});
				if (dbEmployee.levelId !== row.levelId)
					changes.push({
						field: "Level",
						from: dbEmployee.level.name,
						to: row.Lv,
					});

				if (changes.length > 0) {
					toUpdate.push({
						employeeId: row.employeeId,
						name: row["Employee Name"],
						changes,
					});
				}
			});

			const toDelete = allDbEmployees
				.filter((emp) => !fileEmployeeIds.has(emp.employeeId))
				.map((emp) => ({ employeeId: emp.employeeId, name: emp.fullName }));

			const analysis: SyncAnalysis = {
				toCreate,
				toUpdate,
				toDelete,
				fullData: validRows,
			};
			const jobId = randomUUID();

			// **Logika Baru: Simpan hasil analisis ke database**
			await prisma.syncProcess.create({
				data: {
					jobId: jobId,
					status: "PENDING",
					payload: analysis as unknown as Prisma.JsonObject,
				},
			});

			// **Kirim Respons dengan jobId dan ringkasan**
			return NextResponse.json({
				message: "File berhasil dianalisis.",
				jobId: jobId,
				analysis: { toCreate, toUpdate, toDelete }, // Hanya kirim ringkasan, bukan data lengkap
			});
		} catch (error) {
			console.error("Analysis Error:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan saat analisis file." },
				{ status: 500 }
			);
		}
	}
);
