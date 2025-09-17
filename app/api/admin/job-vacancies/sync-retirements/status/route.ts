// /app/api/admin/job-vacancies/sync-retirements/status/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

const statusSchema = z.object({
	jobId: z.string().uuid("Format Job ID tidak valid."),
});

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "sync" },
	async (req: NextRequest) => {
		try {
			const { searchParams } = new URL(req.url);
			const jobId = searchParams.get("jobId");

			const validation = statusSchema.safeParse({ jobId });

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Job ID yang diberikan tidak valid.",
						errors: validation.error.issues,
					},
					{ status: 400 }
				);
			}

			const job = await prisma.syncProcess.findUnique({
				where: { jobId: validation.data.jobId },
				select: {
					status: true,
					error: true,
				},
			});

			if (!job) {
				return NextResponse.json(
					{ message: "Proses sinkronisasi tidak ditemukan." },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				status: job.status,
				error: job.error,
			});
		} catch (error) {
			console.error("Gagal mengambil status sinkronisasi:", error);
			return NextResponse.json(
				{ message: "Terjadi Kesalahan Internal pada Server" },
				{ status: 500 }
			);
		}
	}
);
