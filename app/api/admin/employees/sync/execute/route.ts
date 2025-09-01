// /app/api/admin/employees/sync/execute/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, EducationDegree, Gender } from "@prisma/client";
import { hash } from "bcryptjs";
import pLimit from "p-limit";
import { ValidatedRow } from "../analyze/route";

// --- Type Definitions ---
// (Definisi tipe tetap sama)
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

// Helper function to format date for the default password
const formatDateForPassword = (date: Date): string => {
	const d = String(date.getUTCDate()).padStart(2, "0");
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const y = date.getUTCFullYear();
	return `${d}${m}${y}`;
};

// --- Logika Inti untuk Eksekusi Sinkronisasi ---
async function executeSync() {
	// 1. Cari satu pekerjaan di SyncProcess yang statusnya PROCESSING
	const job = await prisma.syncProcess.findFirst({
		where: { status: "PROCESSING" },
	});

	if (!job) {
		return NextResponse.json({
			message: "Tidak ada tugas sinkronisasi untuk dijalankan.",
		});
	}

	if (
		!job.payload ||
		typeof job.payload !== "object" ||
		!("fullData" in job.payload)
	) {
		await prisma.syncProcess.update({
			where: { id: job.id },
			data: {
				status: "FAILED",
				error: "Payload analisis tidak valid atau hilang.",
			},
		});
		return NextResponse.json(
			{ message: "Payload tidak valid." },
			{ status: 400 }
		);
	}

	const { toCreate, toUpdate, toDelete, fullData } =
		job.payload as unknown as SyncAnalysis;
	const dataMap = new Map(
		fullData.map((row: ValidatedRow) => [row.employeeId, row])
	);

	try {
		await prisma.$transaction(
			async (tx) => {
				// Operasi Hapus (Delete) - URUTAN DIPERBAIKI
				if (toDelete.length > 0) {
					const idsToDelete = toDelete.map((e) => e.employeeId);

					// Hapus employee terlebih dahulu karena mereka memiliki foreign key ke user
					await tx.employee.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});

					// Kemudian hapus user
					await tx.user.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});
				}

				// Operasi Perbarui (Update)
				if (toUpdate.length > 0) {
					for (const emp of toUpdate) {
						const rowData = dataMap.get(emp.employeeId);
						if (!rowData) continue;

						await tx.employee.update({
							where: { employeeId: emp.employeeId },
							data: {
								fullName: rowData["Employee Name"],
								dateOfBirth: new Date(rowData.birthDate),
								hireDate: new Date(rowData.hireDate),
								gender:
									rowData["Gender"] === "Male" ? Gender.MALE : Gender.FEMALE,
								branchId: rowData.branchId,
								positionId: rowData.positionId,
								departmentId: rowData.departmentId,
								levelId: rowData.levelId,
								lastEducationDegree: rowData["Pend"] as EducationDegree,
								lastEducationSchool: rowData["Nama Sekolah/Univ"],
								lastEducationMajor: rowData["Jurusan"],
							},
						});
					}
				}

				// Operasi Buat (Create)
				if (toCreate.length > 0) {
					const limit = pLimit(10);

					const usersToCreatePromises = toCreate.map((emp) => {
						const rowData = dataMap.get(emp.employeeId);
						if (!rowData) return null;

						return limit(async () => {
							const dateOfBirth = new Date(rowData.birthDate);
							const dobForPassword = formatDateForPassword(dateOfBirth);
							const password = await hash(
								`${emp.employeeId}${dobForPassword}`,
								10
							);
							return {
								employeeId: emp.employeeId,
								password: password,
								role: Role.EMPLOYEE,
								branchId: rowData.branchId,
								departmentId: rowData.departmentId,
							};
						});
					});

					const usersToCreate = (
						await Promise.all(usersToCreatePromises)
					).filter((u): u is NonNullable<typeof u> => u !== null);

					const employeesToCreate = toCreate
						.map((emp) => {
							const rowData = dataMap.get(emp.employeeId);
							if (!rowData) return null;
							return {
								employeeId: emp.employeeId,
								fullName: rowData["Employee Name"],
								dateOfBirth: new Date(rowData.birthDate),
								hireDate: new Date(rowData.hireDate),
								gender:
									rowData["Gender"] === "Male" ? Gender.MALE : Gender.FEMALE,
								branchId: rowData.branchId,
								positionId: rowData.positionId,
								departmentId: rowData.departmentId,
								levelId: rowData.levelId,
								lastEducationDegree: rowData["Pend"] as EducationDegree,
								lastEducationSchool: rowData["Nama Sekolah/Univ"],
								lastEducationMajor: rowData["Jurusan"],
							};
						})
						.filter((e): e is NonNullable<typeof e> => e !== null);

					if (usersToCreate.length > 0) {
						await tx.user.createMany({
							data: usersToCreate,
							skipDuplicates: true,
						});
					}
					if (employeesToCreate.length > 0) {
						await tx.employee.createMany({
							data: employeesToCreate,
							skipDuplicates: true,
						});
					}
				}
			},
			{
				timeout: 600000, // 10 menit
			}
		);

		await prisma.syncProcess.update({
			where: { id: job.id },
			data: {
				status: "SUCCESS",
				endedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: "Sinkronisasi berhasil diselesaikan.",
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "Terjadi kesalahan yang tidak diketahui.";
		console.error("Execute Sync Error:", errorMessage);

		await prisma.syncProcess.update({
			where: { id: job.id },
			data: {
				status: "FAILED",
				error: errorMessage,
				endedAt: new Date(),
			},
		});

		return NextResponse.json(
			{ message: "Sinkronisasi gagal.", error: errorMessage },
			{ status: 500 }
		);
	}
}

// Handler untuk POST (digunakan oleh frontend)
export async function POST(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ message: "Akses Ditolak." }, { status: 401 });
	}
	return executeSync();
}

// Handler untuk GET (digunakan oleh Vercel Cron)
export async function GET(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ message: "Akses Ditolak." }, { status: 401 });
	}
	return executeSync();
}
