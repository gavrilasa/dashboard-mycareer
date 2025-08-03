import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { read, utils } from "xlsx";
import { EducationDegree, Gender } from "@prisma/client";
import { withAuthorization } from "@/lib/auth-hof"; // Import the HOF

// --- Type Definitions (Unchanged) ---
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
};

// --- Helper Functions (Unchanged) ---
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
		if (year < 100) {
			year = year <= 29 ? 2000 + year : 1900 + year;
		}
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
	const lowerCaseName = levelAbbr.toLowerCase();
	if (lowerCaseName.includes("mgr") || lowerCaseName.includes("manager")) {
		return "MANAGER";
	}
	if (
		lowerCaseName.includes("spv") ||
		lowerCaseName.includes("supervisor") ||
		lowerCaseName.includes("coord")
	) {
		return "SUPERVISOR";
	}
	if (lowerCaseName.includes("staff") || lowerCaseName.includes("admin")) {
		return "STAFF";
	}
	return null;
}

export const POST = withAuthorization(
	{ resource: "employee", action: "upload" },
	async (req: NextRequest) => {
		try {
			const formData = await req.formData();
			const file = formData.get("file") as File;

			if (!file) {
				return NextResponse.json(
					{ message: "No file uploaded." },
					{ status: 400 }
				);
			}

			const buffer = await file.arrayBuffer();
			const workbook = read(buffer, {
				type: "buffer",
				cellDates: false,
				raw: true,
			});
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const data: ExcelRow[] = utils.sheet_to_json(sheet);

			if (data.length === 0) {
				return NextResponse.json(
					{ message: "The uploaded file is empty." },
					{ status: 400 }
				);
			}

			// Database queries and data processing logic remains the same
			const [dbEmployees, dbBranches, dbDepartments, dbPositions, dbLevels] =
				await prisma.$transaction([
					prisma.employee.findMany({
						include: {
							branch: true,
							department: true,
							position: true,
							level: true,
						},
					}),
					prisma.branch.findMany(),
					prisma.department.findMany(),
					prisma.position.findMany(),
					prisma.level.findMany(),
				]);

			const dbEmployeeMap = new Map(dbEmployees.map((e) => [e.employeeId, e]));
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

			const errors: { row: number; employeeId: string; error: string }[] = [];
			const validRows: ValidatedRow[] = [];

			for (let i = 0; i < data.length; i++) {
				const row = data[i];
				const rowNum = i + 2;
				const employeeId = row["Pers. Number"]?.toString().split(" ")[0];
				const currentErrors: string[] = [];

				if (!employeeId) {
					if (Object.keys(row).length === 0) continue;
					errors.push({
						row: rowNum,
						employeeId: "N/A",
						error: "Column 'Pers. Number' is missing or empty.",
					});
					continue;
				}

				const branchId = branchMap.get(row["Personnel Area"]?.toLowerCase());
				if (!branchId) {
					currentErrors.push(`Branch '${row["Personnel Area"]}' not found.`);
				}

				let departmentId: string | undefined;
				let positionId: string | undefined;
				if (branchId) {
					const deptKey = `${row[
						"Personnel Subarea"
					]?.toLowerCase()}|${branchId}`;
					departmentId = departmentMap.get(deptKey);
					if (!departmentId)
						currentErrors.push(
							`Department '${row["Personnel Subarea"]}' not found in branch '${row["Personnel Area"]}'.`
						);

					const posKey = `${row["Position"]?.toLowerCase()}|${branchId}`;
					positionId = positionMap.get(posKey);
					if (!positionId)
						currentErrors.push(
							`Position '${row["Position"]}' not found in branch '${row["Personnel Area"]}'.`
						);
				}

				const normalizedLevel = normalizeLevelName(row["Lv"] || "");
				const levelId = normalizedLevel
					? levelMap.get(normalizedLevel.toLowerCase())
					: undefined;
				if (!levelId) currentErrors.push(`Level '${row["Lv"]}' not valid.`);

				const birthDate = parseDate(row["Birthdate"]);
				if (!birthDate)
					currentErrors.push(
						`Invalid Birthdate format for '${row["Birthdate"]}'.`
					);

				const hireDate = parseDate(row["TMK"]);
				if (!hireDate)
					currentErrors.push(
						`Invalid TMK (hire date) format for '${row["TMK"]}'.`
					);

				if (
					row["Pend"] &&
					!Object.values(EducationDegree).includes(
						row["Pend"] as EducationDegree
					)
				) {
					currentErrors.push(`Invalid education degree '${row["Pend"]}'.`);
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
					});
				}
			}

			if (errors.length > 0) {
				return NextResponse.json({ errors }, { status: 400 });
			}

			const fileEmployeeIds = new Set(validRows.map((row) => row.employeeId));

			const toCreate = validRows
				.filter((row) => !dbEmployeeMap.has(row.employeeId))
				.map((r) => ({ employeeId: r.employeeId, name: r["Employee Name"] }));

			type Change = {
				field: string;
				from: string | Gender | EducationDegree | null | undefined;
				to: string | Gender | EducationDegree | null | undefined;
			};
			const toUpdate: {
				employeeId: string;
				name: string;
				changes: Change[];
			}[] = [];

			validRows.forEach((row) => {
				const dbEmployee = dbEmployeeMap.get(row.employeeId);
				if (!dbEmployee) return;

				const changes: Change[] = [];

				if (dbEmployee.fullName !== row["Employee Name"])
					changes.push({
						field: "Name",
						from: dbEmployee.fullName,
						to: row["Employee Name"],
					});
				if (dbEmployee.branchId !== row.branchId)
					changes.push({
						field: "Branch",
						from: dbEmployee.branch?.name,
						to: row["Personnel Area"],
					});
				if (dbEmployee.departmentId !== row.departmentId)
					changes.push({
						field: "Department",
						from: dbEmployee.department?.name,
						to: row["Personnel Subarea"],
					});
				if (dbEmployee.positionId !== row.positionId)
					changes.push({
						field: "Position",
						from: dbEmployee.position?.name,
						to: row["Position"],
					});
				if (dbEmployee.levelId !== row.levelId)
					changes.push({
						field: "Level",
						from: dbEmployee.level.name,
						to: row.Lv,
					});
				if (dbEmployee.dateOfBirth.getTime() !== row.birthDate.getTime())
					changes.push({
						field: "Birthdate",
						from: dbEmployee.dateOfBirth.toLocaleDateString("en-CA"),
						to: row.birthDate.toLocaleDateString("en-CA"),
					});
				if (dbEmployee.hireDate.getTime() !== row.hireDate.getTime())
					changes.push({
						field: "Hire Date",
						from: dbEmployee.hireDate.toLocaleDateString("en-CA"),
						to: row.hireDate.toLocaleDateString("en-CA"),
					});

				const fileGender = row.Gender === "Male" ? Gender.MALE : Gender.FEMALE;
				if (dbEmployee.gender !== fileGender)
					changes.push({
						field: "Gender",
						from: dbEmployee.gender,
						to: fileGender,
					});

				if (dbEmployee.lastEducationDegree !== row.Pend)
					changes.push({
						field: "Education",
						from: dbEmployee.lastEducationDegree,
						to: row.Pend,
					});
				if (dbEmployee.lastEducationSchool !== row["Nama Sekolah/Univ"])
					changes.push({
						field: "School",
						from: dbEmployee.lastEducationSchool,
						to: row["Nama Sekolah/Univ"],
					});
				if (dbEmployee.lastEducationMajor !== row.Jurusan)
					changes.push({
						field: "Major",
						from: dbEmployee.lastEducationMajor,
						to: row.Jurusan,
					});

				if (changes.length > 0) {
					toUpdate.push({
						employeeId: row.employeeId,
						name: row["Employee Name"],
						changes,
					});
				}
			});

			const toDelete = Array.from(dbEmployeeMap.values())
				.filter((emp) => !fileEmployeeIds.has(emp.employeeId))
				.map((emp) => ({ employeeId: emp.employeeId, name: emp.fullName }));

			return NextResponse.json({
				analysis: { toCreate, toUpdate, toDelete, fullData: validRows },
			});
		} catch (error) {
			if (error instanceof Error) {
				return NextResponse.json({ message: error.message }, { status: 500 });
			}
			return NextResponse.json(
				{ message: "An unexpected error occurred during file analysis." },
				{ status: 500 }
			);
		}
	}
);
