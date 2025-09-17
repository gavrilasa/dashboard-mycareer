// /app/api/admin/job-vacancies/sync-retirements/analyze/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

// [!code focus:start]
// Tipe untuk payload yang disimpan di SyncProcess (diperbarui)
interface SuccessionAnalysisPayload {
	toCreate: {
		jobRoleId: string;
		jobRoleName: string;
		employeeName: string; // Tambahkan nama karyawan
		description: string;
		isPublished: boolean;
		requirements: string;
	}[];
}
// [!code focus:end]

export const POST = withAuthorization(
	{ resource: "jobVacant", action: "sync" },
	async (_req: NextRequest) => {
		try {
			// 1. Hitung tanggal batas untuk karyawan yang berusia 50 tahun atau lebih.
			const today = new Date();
			const retirementAge = 55;
			const detectionWindowYears = 5;
			const retirementThresholdDate = new Date(
				today.getFullYear() - (retirementAge - detectionWindowYears),
				today.getMonth(),
				today.getDate()
			);

			// 2. Ambil semua data yang diperlukan secara paralel untuk efisiensi
			const [
				employeesNearingRetirement,
				existingVacancies,
				validCareerPathDestinations,
			] = await prisma.$transaction([
				prisma.employee.findMany({
					where: {
						dateOfBirth: {
							lte: retirementThresholdDate,
						},
					},
					include: {
						position: {
							include: {
								jobRole: true,
							},
						},
					},
				}),
				prisma.jobVacancy.findMany({
					select: {
						jobRoleId: true,
					},
				}),
				prisma.careerPath.findMany({
					distinct: ["toJobRoleId"],
					select: {
						toJobRoleId: true,
					},
				}),
			]);

			// 3. Proses data di memori untuk performa yang lebih baik
			const existingVacancyJobRoleIds = new Set(
				existingVacancies.map((v) => v.jobRoleId)
			);
			const validDestinationJobRoleIds = new Set(
				validCareerPathDestinations.map((p) => p.toJobRoleId)
			);
			// [!code focus:start]
			// Peta sekarang juga menyimpan nama karyawan
			const jobRolesToCreateVacancy = new Map<
				string,
				{ jobRoleName: string; employeeName: string }
			>();

			// 4. Lakukan iterasi dan filter berdasarkan aturan bisnis
			for (const employee of employeesNearingRetirement) {
				if (employee.position?.jobRoleId) {
					const { jobRoleId, jobRole } = employee.position;

					if (!validDestinationJobRoleIds.has(jobRoleId)) {
						continue;
					}

					if (existingVacancyJobRoleIds.has(jobRoleId)) {
						continue;
					}

					if (!jobRolesToCreateVacancy.has(jobRoleId)) {
						jobRolesToCreateVacancy.set(jobRoleId, {
							jobRoleName: jobRole.name,
							employeeName: employee.fullName, // Simpan nama karyawan pertama yang ditemukan
						});
					}
				}
			}

			// 5. Siapkan data untuk disimpan dan dikirim
			const vacanciesToCreate = Array.from(
				jobRolesToCreateVacancy.entries()
			).map(([jobRoleId, { jobRoleName, employeeName }]) => ({
				jobRoleId,
				jobRoleName,
				employeeName, // Sertakan nama karyawan
				description: "Posisi ini tersedia",
				isPublished: true,
				requirements: "",
			}));
			// [!code focus:end]

			const jobId = randomUUID();
			const payload: SuccessionAnalysisPayload = {
				toCreate: vacanciesToCreate,
			};

			await prisma.syncProcess.create({
				data: {
					jobId: jobId,
					status: "PENDING",
					payload: payload as unknown as Prisma.JsonObject,
				},
			});

			// [!code focus:start]
			// 7. Kirim kembali jobId dan ringkasan (termasuk employeeName) ke frontend
			return NextResponse.json({
				message: "Analisis suksesi pensiun berhasil.",
				jobId,
				analysis: {
					toCreate: vacanciesToCreate.map((v) => ({
						jobRoleId: v.jobRoleId,
						jobRoleName: v.jobRoleName,
						employeeName: v.employeeName,
					})),
				},
			});
			// [!code focus:end]
		} catch (error) {
			console.error("Kesalahan saat analisis posisi pensiun:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server saat analisis." },
				{ status: 500 }
			);
		}
	}
);
