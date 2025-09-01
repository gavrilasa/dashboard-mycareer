// /app/api/admin/employees/sync/start/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

const startSchema = z.object({
	jobId: z.string().uuid("Invalid Job ID format."),
});

export const POST = withAuthorization(
	{ resource: "employee", action: "upload" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();
			const validation = startSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{ message: "Invalid request body", errors: validation.error.issues },
					{ status: 400 }
				);
			}

			const { jobId } = validation.data;

			// 1. Cari record di SyncProcess berdasarkan jobId.
			const job = await prisma.syncProcess.findUnique({
				where: { jobId: jobId },
			});

			// 2. Jika tidak ditemukan atau statusnya bukan PENDING, kembalikan error.
			if (!job) {
				return NextResponse.json(
					{ message: "Job ID not found. Please re-upload the file." },
					{ status: 404 }
				);
			}
			if (job.status !== "PENDING") {
				return NextResponse.json(
					{ message: `Job is not in PENDING state (current: ${job.status}).` },
					{ status: 409 } // Conflict
				);
			}

			// 3. Ubah status record dari PENDING menjadi PROCESSING.
			await prisma.syncProcess.update({
				where: { jobId: jobId },
				data: {
					status: "PROCESSING",
					startedAt: new Date(),
				},
			});

			// 4. Logika Berbasis Lingkungan
			// Di lingkungan development, kita secara manual memicu proses eksekusi
			// untuk menyimulasikan Cron Job.
			if (process.env.NODE_ENV === "development") {
				// Kita tidak menggunakan 'await' agar respons bisa langsung dikirim kembali ke frontend.
				fetch(new URL("/api/admin/employees/sync/execute", req.url), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						// Gunakan CRON_SECRET untuk otentikasi panggilan internal
						Authorization: `Bearer ${process.env.CRON_SECRET}`,
					},
				}).catch(console.error);
			}
			// Di lingkungan produksi, kita tidak melakukan apa-apa.
			// Proses akan diserahkan kepada Vercel Cron Job yang telah dijadwalkan.

			// 5. Kirim respons 202 Accepted, menandakan permintaan diterima untuk diproses.
			return NextResponse.json(
				{ message: "Synchronization process has been initiated." },
				{ status: 202 }
			);
		} catch (error) {
			console.error("Error starting sync process:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
