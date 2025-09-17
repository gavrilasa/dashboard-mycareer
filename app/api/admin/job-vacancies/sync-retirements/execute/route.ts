// /app/api/admin/job-vacancies/sync-retirements/execute/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
// import { Prisma } from "@prisma/client"; // FIX: Dihapus karena tidak digunakan

// Skema untuk memvalidasi body request
const executeSchema = z.object({
	jobId: z.string().uuid("Format Job ID tidak valid."),
});

// Tipe untuk payload yang diharapkan dari database
interface SuccessionAnalysisPayload {
	toCreate: {
		jobRoleId: string;
		description: string;
		isPublished: boolean;
		requirements: string;
		// Properti ini hanya untuk frontend, tidak ada di model DB
		jobRoleName?: string;
		employeeName?: string;
	}[];
}

export const POST = withAuthorization(
	{ resource: "jobVacant", action: "sync" },
	async (req: NextRequest) => {
		let jobIdFromRequest: string | null = null;
		try {
			const body = await req.json();
			const validation = executeSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Request body tidak valid",
						errors: validation.error.issues,
					},
					{ status: 400 }
				);
			}

			const { jobId } = validation.data;
			jobIdFromRequest = jobId; // Simpan jobId untuk blok catch

			const job = await prisma.syncProcess.findUnique({
				where: { jobId: jobId },
			});

			if (!job) {
				return NextResponse.json(
					{ message: "Job ID tidak ditemukan. Harap mulai ulang analisis." },
					{ status: 404 }
				);
			}
			if (job.status !== "PENDING") {
				return NextResponse.json(
					{
						message: `Pekerjaan tidak dalam status PENDING (status saat ini: ${job.status}).`,
					},
					{ status: 409 } // Conflict
				);
			}

			await prisma.syncProcess.update({
				where: { id: job.id },
				data: { status: "PROCESSING", startedAt: new Date() },
			});

			const payload = job.payload as unknown as SuccessionAnalysisPayload;
			const rawDataToCreate = payload.toCreate;

			if (rawDataToCreate && rawDataToCreate.length > 0) {
				// [!code focus:start]
				// FIX: Gunakan underscore untuk menandai variabel yang sengaja tidak digunakan
				const cleanedDataToCreate = rawDataToCreate.map(
					({
						jobRoleName: _jobRoleName,
						employeeName: _employeeName,
						...rest
					}) => rest
				);

				await prisma.jobVacancy.createMany({
					data: cleanedDataToCreate,
					skipDuplicates: true,
				});
				// [!code focus:end]
			}

			await prisma.syncProcess.update({
				where: { id: job.id },
				data: { status: "SUCCESS", endedAt: new Date() },
			});

			return NextResponse.json(
				{ message: "Sinkronisasi berhasil dan lowongan telah dibuat." },
				{ status: 200 }
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Terjadi kesalahan yang tidak diketahui.";
			console.error("Kesalahan saat eksekusi sinkronisasi suksesi:", error);

			if (jobIdFromRequest) {
				await prisma.syncProcess.updateMany({
					where: { jobId: jobIdFromRequest, status: "PROCESSING" },
					data: {
						status: "FAILED",
						error: errorMessage,
						// [!code focus:start]
						// FIX: Menggunakan 'new Date()' dengan huruf kapital
						endedAt: new Date(),
						// [!code focus:end]
					},
				});
			}

			return NextResponse.json(
				{
					message: "Terjadi kesalahan pada server saat eksekusi.",
					error: errorMessage,
				},
				{ status: 500 }
			);
		}
	}
);
