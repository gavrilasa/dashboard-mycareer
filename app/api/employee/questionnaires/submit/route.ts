import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

// Skema validasi untuk memastikan data yang masuk sesuai format
const submitSchema = z.object({
	questionnaireId: z.string().cuid(),
	answers: z
		.array(
			z.object({
				questionId: z.string().cuid(),
				value: z.string().min(1).max(1), // Memastikan nilai adalah satu karakter (e.g., "1", "2", .. "5")
			})
		)
		.min(1, "Minimal harus ada satu jawaban."),
});

export const POST = withAuthorization(
	{ resource: "questionnaire", action: "answer" },
	async (req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;
		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan di dalam sesi." },
				{ status: 403 }
			);
		}

		try {
			const body = await req.json();
			const validation = submitSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Data yang dikirim tidak valid.",
						errors: validation.error,
					},
					{ status: 400 }
				);
			}

			const { questionnaireId, answers } = validation.data;

			// 1. Simpan Jawaban Mentah dalam satu transaksi database
			const newResponse = await prisma.$transaction(async (tx) => {
				// Buat record respons utama
				const response = await tx.questionnaireResponse.create({
					data: {
						employeeId: employeeId,
						questionnaireId: questionnaireId,
					},
				});

				// Siapkan data untuk semua jawaban
				const answersData = answers.map((answer) => ({
					value: answer.value,
					questionId: answer.questionId,
					responseId: response.id,
				}));

				// Simpan semua jawaban sekaligus
				await tx.answer.createMany({
					data: answersData,
				});

				return response;
			});

			// 2. Picu Background Job (Opsi A - Tanpa Await)
			const triggerUrl = new URL(
				"/api/tasks/process-questionnaire",
				process.env.NEXTAUTH_URL
			);

			// Menggunakan fetch tanpa 'await' agar tidak menunggu proses selesai
			fetch(triggerUrl.toString(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Menambahkan secret key sederhana untuk keamanan dasar
					Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
				},
				body: JSON.stringify({ responseId: newResponse.id }),
			}).catch((error) => {
				// Jika pemicuan fetch gagal, cukup catat error di server.
				// Jangan kirim error ke pengguna karena jawaban mereka sudah tersimpan.
				console.error("Gagal memicu background job kalkulasi:", error);
			});

			// 3. Respons Instan ke Pengguna
			return NextResponse.json(
				{
					message:
						"Jawaban Anda telah berhasil disimpan dan akan segera diproses.",
				},
				{ status: 200 }
			);
		} catch (error) {
			// Menangani error jika misalnya kuesioner yang sama di-submit dua kali
			if (
				error instanceof Error &&
				error.message.includes("Unique constraint failed")
			) {
				return NextResponse.json(
					{ message: "Anda sudah pernah mengisi kuesioner ini." },
					{ status: 409 } // 409 Conflict
				);
			}

			console.error("Error saat menyimpan jawaban kuesioner:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
