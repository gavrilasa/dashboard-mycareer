import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const processSchema = z.object({
	responseId: z.string().cuid(),
});

export async function POST(req: NextRequest) {
	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
		return NextResponse.json({ message: "Akses Ditolak." }, { status: 401 });
	}

	try {
		const body = await req.json();
		const validation = processSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					message: "Data yang dikirim tidak valid.",
					errors: validation.error,
				},
				{ status: 400 }
			);
		}

		const { responseId } = validation.data;

		// 1. Ambil semua data yang diperlukan dalam satu query
		const responseData = await prisma.questionnaireResponse.findUnique({
			where: { id: responseId },
			include: {
				employee: {
					select: {
						employeeId: true,
						position: { select: { jobRoleId: true } },
					},
				},
				questionnaire: { select: { title: true } },
				answers: {
					include: {
						question: { select: { competency: true } },
					},
				},
			},
		});

		if (!responseData?.employee?.position?.jobRoleId) {
			console.error(
				`Gagal memproses: Data karyawan atau job role tidak lengkap untuk responseId ${responseId}.`
			);
			return NextResponse.json(
				{
					message: "Data respons, karyawan, atau peran jabatan tidak lengkap.",
				},
				{ status: 404 }
			);
		}

		const { employeeId } = responseData.employee;
		const jobRoleId = responseData.employee.position.jobRoleId;
		const { title: questionnaireTitle } = responseData.questionnaire;

		// 2. Agregasi skor dari jawaban di memori
		const scoresByCompetency = responseData.answers.reduce<
			Record<string, { total: number; count: number }>
		>((acc, answer) => {
			const competency = answer.question.competency;
			if (!acc[competency]) {
				acc[competency] = { total: 0, count: 0 };
			}
			acc[competency].total += parseInt(answer.value, 10);
			acc[competency].count++;
			return acc;
		}, {});

		const competencies = Object.keys(scoresByCompetency);
		if (competencies.length === 0) {
			return NextResponse.json(
				{ message: "Tidak ada jawaban untuk diproses." },
				{ status: 200 }
			);
		}

		// 3. **OPTIMASI**: Ambil semua standar kompetensi yang relevan dalam satu query
		const standards = await prisma.competencyStandard.findMany({
			where: {
				jobRoleId: jobRoleId,
				competency: { in: competencies },
			},
		});

		// Buat Map untuk lookup standar yang lebih cepat (O(1))
		const standardsMap = new Map(
			standards.map((s) => [s.competency, s.standardValue])
		);

		// 4. Kalkulasi hasil akhir
		const competencyResults = [];
		for (const competency of competencies) {
			const standardScore = standardsMap.get(competency);

			if (typeof standardScore !== "number") {
				console.warn(
					`Peringatan: Standar untuk kompetensi "${competency}" pada job role ID "${jobRoleId}" tidak ditemukan. Kalkulasi dilewati.`
				);
				continue;
			}

			const { total, count } = scoresByCompetency[competency];
			const calculatedScore = total / count;
			const gap = calculatedScore - standardScore;

			competencyResults.push({
				employeeId,
				questionnaireTitle,
				competency,
				calculatedScore,
				standardScore,
				gap,
				recommendationNeeded: gap < 0,
			});
		}

		// 5. Simpan hasil ke database dalam satu transaksi
		if (competencyResults.length > 0) {
			await prisma.$transaction([
				prisma.competencyResult.deleteMany({
					where: {
						employeeId,
						questionnaireTitle,
						competency: { in: competencies },
					},
				}),
				prisma.competencyResult.createMany({
					data: competencyResults,
				}),
			]);
			console.log(
				`Berhasil menyimpan ${competencyResults.length} hasil kompetensi untuk responseId: ${responseId}`
			);
		}

		return NextResponse.json(
			{ message: "Proses kalkulasi berhasil." },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error saat memproses kalkulasi di latar belakang:", error);
		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server saat kalkulasi." },
			{ status: 500 }
		);
	}
}
