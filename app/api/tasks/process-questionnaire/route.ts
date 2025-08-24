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

		const responseData = await prisma.questionnaireResponse.findUnique({
			where: { id: responseId },
			include: {
				employee: {
					select: {
						employeeId: true,
						// [!code focus:start]
						// FIX: Mengambil jobRoleId melalui relasi Position
						position: {
							select: {
								jobRoleId: true,
							},
						},
						// [!code focus:end]
					},
				},
				questionnaire: {
					select: {
						title: true,
					},
				},
				answers: {
					include: {
						question: {
							select: {
								competency: true,
							},
						},
					},
				},
			},
		});

		if (
			!responseData ||
			!responseData.employee ||
			!responseData.questionnaire
		) {
			console.error(
				`Gagal memproses: QuestionnaireResponse dengan ID ${responseId} tidak ditemukan atau data tidak lengkap.`
			);
			return NextResponse.json(
				{ message: "Data respons tidak ditemukan." },
				{ status: 404 }
			);
		}

		// [!code focus:start]
		// FIX: Mengambil employeeId dan jobRoleId dari struktur data yang benar
		const { employeeId } = responseData.employee;
		const jobRoleId = responseData.employee.position?.jobRoleId;

		if (!employeeId || !jobRoleId) {
			// [!code focus:end]
			console.error(
				`Gagal memproses: employeeId atau jobRoleId tidak ditemukan untuk responseId ${responseId}.`
			);
			return NextResponse.json(
				{
					message:
						"Data karyawan atau peran jabatan pada respons tidak lengkap.",
				},
				{ status: 404 }
			);
		}

		const { title: questionnaireTitle } = responseData.questionnaire;

		const scoresByCompetency = responseData.answers.reduce<
			Record<string, number[]>
		>((acc, answer) => {
			const competency = answer.question.competency;
			if (!acc[competency]) {
				acc[competency] = [];
			}
			acc[competency].push(parseInt(answer.value, 10));
			return acc;
		}, {});

		const competencyResults = [];

		for (const competency in scoresByCompetency) {
			const scores = scoresByCompetency[competency];
			const n = scores.length;
			const totalScore = scores.reduce((sum, score) => sum + score, 0);

			const calculatedScore = totalScore / n;
			// [!code focus:start]
			// FIX: Mencari standar kompetensi menggunakan jobRoleId, bukan positionId
			const standard = await prisma.competencyStandard.findUnique({
				where: {
					jobRoleId_competency: {
						jobRoleId: jobRoleId,
						competency,
					},
				},
			});
			// [!code focus:end]

			if (!standard) {
				console.warn(
					`Peringatan: Standar untuk kompetensi "${competency}" pada job role ID "${jobRoleId}" tidak ditemukan. Kalkulasi dilewati.`
				);
				continue;
			}

			const standardScore = standard.standardValue;
			const gap = calculatedScore - standardScore;
			const recommendationNeeded = gap < 0;

			competencyResults.push({
				employeeId,
				questionnaireTitle,
				competency,
				calculatedScore,
				standardScore,
				gap,
				recommendationNeeded,
			});
		}

		if (competencyResults.length > 0) {
			await prisma.competencyResult.deleteMany({
				where: {
					employeeId,
					questionnaireTitle,
					competency: {
						in: Object.keys(scoresByCompetency),
					},
				},
			});

			await prisma.competencyResult.createMany({
				data: competencyResults,
			});
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
