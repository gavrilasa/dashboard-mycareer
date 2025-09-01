import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { CompetencyResult } from "@prisma/client";

// --- Type Definitions ---

interface QuestionDetail {
	id: string;
	text: string;
	value: number;
}

interface SubCompetencyData {
	questions: QuestionDetail[];
	recommendations: string[];
}

interface GroupedSubCompetencies {
	[subCompetency: string]: SubCompetencyData;
}

interface GroupedResult {
	details: CompetencyResult[];
	subCompetencies: GroupedSubCompetencies;
}

interface HandlerContext {
	params: {
		employeeId: string;
	};
}

export const GET = withAuthorization(
	{ resource: "questionnaire", action: "read" },
	async (_req: NextRequest, _args, context: HandlerContext) => {
		const { employeeId } = context.params;

		if (!employeeId) {
			return NextResponse.json(
				{ message: "ID Karyawan tidak valid." },
				{ status: 400 }
			);
		}

		try {
			// 1. Ambil semua CompetencyResult milik karyawan tersebut
			const competencyResults = await prisma.competencyResult.findMany({
				where: { employeeId },
				orderBy: { competency: "asc" },
			});

			if (competencyResults.length === 0) {
				return NextResponse.json(
					{
						message:
							"Hasil kompetensi belum tersedia atau belum diproses untuk karyawan ini.",
					},
					{ status: 404 }
				);
			}

			// 2. Ambil semua jawaban mentah (Answer)
			const responses = await prisma.questionnaireResponse.findMany({
				where: { employeeId },
				include: {
					answers: {
						include: {
							question: {
								select: {
									id: true,
									text: true,
									competency: true,
									subCompetency: true,
								},
							},
						},
					},
				},
			});

			// Gabungkan semua jawaban dari semua kuesioner menjadi satu array
			const allAnswers = responses.flatMap((response) => response.answers);

			// 3. Ambil semua rekomendasi pelatihan
			const allRecommendations = await prisma.trainingRecommendation.findMany();

			// Buat peta rekomendasi untuk pencarian cepat berdasarkan sub-kompetensi
			const recommendationsMap = allRecommendations.reduce<
				Record<string, string[]>
			>((acc, rec) => {
				if (!acc[rec.subCompetency]) {
					acc[rec.subCompetency] = [];
				}
				acc[rec.subCompetency].push(rec.recommendation);
				return acc;
			}, {});

			// 4. Gabungkan semua data menjadi satu objek JSON terstruktur
			const groupedResults = competencyResults.reduce<
				Record<string, GroupedResult>
			>((acc, result) => {
				if (!acc[result.competency]) {
					acc[result.competency] = {
						details: [],
						subCompetencies: {},
					};
				}
				acc[result.competency].details.push(result);
				return acc;
			}, {});

			allAnswers.forEach((answer) => {
				const { competency, subCompetency } = answer.question;
				if (groupedResults[competency]) {
					if (!groupedResults[competency].subCompetencies[subCompetency]) {
						groupedResults[competency].subCompetencies[subCompetency] = {
							questions: [],
							recommendations: recommendationsMap[subCompetency] || [],
						};
					}
					groupedResults[competency].subCompetencies[
						subCompetency
					].questions.push({
						id: answer.question.id,
						text: answer.question.text,
						value: parseInt(answer.value, 10),
					});
				}
			});

			// Finalisasi struktur data
			const detailedResults = Object.entries(groupedResults).map(
				([competency, data]) => {
					const competencyDetail = data.details[0]; // Ambil detail umum dari hasil pertama
					return {
						competency: competency,
						calculatedScore: competencyDetail.calculatedScore,
						standardScore: competencyDetail.standardScore,
						gap: competencyDetail.gap,
						recommendationNeeded: competencyDetail.recommendationNeeded,
						subCompetencies: Object.entries(data.subCompetencies).map(
							([subCompetency, subData]: [string, SubCompetencyData]) => ({
								name: subCompetency,
								questions: subData.questions,
								recommendations: subData.recommendations,
							})
						),
					};
				}
			);

			return NextResponse.json(detailedResults);
		} catch (error) {
			console.error(
				`Error fetching detailed competency results for employee ${employeeId}:`,
				error
			);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
