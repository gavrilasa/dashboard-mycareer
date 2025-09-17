// /app/api/admin/job-vacancies/sync-retirements/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

// ... (skema validasi tetap sama)
const executionPayloadSchema = z.array(
	z.object({
		jobRoleId: z.string(),
		description: z.string(),
		isPublished: z.boolean(),
		requirements: z.string(),
	})
);

// Handler untuk Analisis (POST)
export const POST = withAuthorization(
	{ resource: "jobVacant", action: "sync" },
	async (_req: NextRequest) => {
		try {
			// Logika analisis (pengambilan data awal tetap sama)
			const today = new Date();
			const retirementAge = 55;
			const detectionWindowYears = 5;
			const retirementThresholdDate = new Date(
				today.getFullYear() - (retirementAge - detectionWindowYears),
				today.getMonth(),
				today.getDate()
			);

			const [
				employeesNearingRetirement,
				existingVacancies,
				validCareerPathDestinations,
			] = await prisma.$transaction([
				prisma.employee.findMany({
					where: { dateOfBirth: { lte: retirementThresholdDate } },
					include: { position: { include: { jobRole: true } } },
				}),
				prisma.jobVacancy.findMany({ select: { jobRoleId: true } }),
				prisma.careerPath.findMany({
					distinct: ["toJobRoleId"],
					select: { toJobRoleId: true },
				}),
			]);

			const existingVacancyJobRoleIds = new Set(
				existingVacancies.map((v) => v.jobRoleId)
			);
			const validDestinationJobRoleIds = new Set(
				validCareerPathDestinations.map((p) => p.toJobRoleId)
			);

			// [!code focus:start]
			// Modifikasi: Siapkan peta untuk yang dibuat DAN yang dilewati
			const jobRolesToCreateVacancy = new Map<
				string,
				{ jobRoleName: string; employeeName: string }
			>();
			const jobRolesSkipped = new Map<
				string,
				{ jobRoleName: string; employeeName: string; reason: string }
			>();

			for (const employee of employeesNearingRetirement) {
				if (employee.position?.jobRoleId) {
					const { jobRoleId, jobRole } = employee.position;

					// Pengecekan duplikat agar satu posisi tidak dianalisis dua kali
					if (
						jobRolesToCreateVacancy.has(jobRoleId) ||
						jobRolesSkipped.has(jobRoleId)
					) {
						continue;
					}

					// Aturan 1: Periksa Career Path
					if (!validDestinationJobRoleIds.has(jobRoleId)) {
						jobRolesSkipped.set(jobRoleId, {
							jobRoleName: jobRole.name,
							employeeName: employee.fullName,
							reason: "Tidak ditemukan di jenjang karier.",
						});
						continue; // Lanjut ke karyawan berikutnya
					}

					// Aturan 2: Periksa Lowongan yang Sudah Ada
					if (existingVacancyJobRoleIds.has(jobRoleId)) {
						// Kita bisa memilih untuk tidak menampilkan ini agar modal tetap bersih,
						// karena ini bukan 'masalah' tapi kondisi normal.
						continue;
					}

					// Jika lolos semua, tambahkan ke daftar yang akan dibuat
					jobRolesToCreateVacancy.set(jobRoleId, {
						jobRoleName: jobRole.name,
						employeeName: employee.fullName,
					});
				}
			}

			const vacanciesForAnalysis = Array.from(
				jobRolesToCreateVacancy.entries()
			).map(([jobRoleId, { jobRoleName, employeeName }]) => ({
				jobRoleId,
				jobRoleName,
				employeeName,
				description: "Posisi ini tersedia",
				isPublished: true,
				requirements: "",
			}));

			const skippedVacancies = Array.from(jobRolesSkipped.entries()).map(
				([jobRoleId, { jobRoleName, employeeName, reason }]) => ({
					jobRoleId,
					jobRoleName,
					employeeName,
					reason,
				})
			);
			// [!code focus:end]

			// Kirim kembali hasil analisis (yang dibuat dan yang dilewati)
			return NextResponse.json({
				message: "Analisis berhasil.",
				// [!code focus:start]
				analysis: {
					toCreate: vacanciesForAnalysis,
					skipped: skippedVacancies,
				},
				// [!code focus:end]
			});
		} catch (error) {
			console.error("Kesalahan saat analisis posisi pensiun:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Terjadi kesalahan pada server.";
			return NextResponse.json(
				{ message: "Analisis Gagal", error: errorMessage },
				{ status: 500 }
			);
		}
	}
);

// ... (Handler PUT tetap sama)
export const PUT = withAuthorization(
	{ resource: "jobVacant", action: "sync" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();
			const validation = executionPayloadSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Data untuk eksekusi tidak valid.",
						errors: validation.error.issues,
					},
					{ status: 400 }
				);
			}

			const vacanciesToCreate = validation.data;

			if (vacanciesToCreate.length > 0) {
				await prisma.jobVacancy.createMany({
					data: vacanciesToCreate,
					skipDuplicates: true,
				});
			}

			return NextResponse.json({
				message: "Sinkronisasi berhasil!",
				createdCount: vacanciesToCreate.length,
			});
		} catch (error) {
			console.error("Kesalahan saat eksekusi sinkronisasi:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Terjadi kesalahan pada server.";
			return NextResponse.json(
				{ message: "Eksekusi Gagal", error: errorMessage },
				{ status: 500 }
			);
		}
	}
);
