import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// Definisikan tipe untuk parameter URL
interface HandlerContext {
	params: { questionnaireId: string };
}

export const GET = withAuthorization(
	{ resource: "questionnaire", action: "read" },
	async (_req: NextRequest, { session }, context: HandlerContext) => {
		const { questionnaireId } = context.params;
		const employeeId = session?.user?.employeeId;

		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan." },
				{ status: 403 }
			);
		}

		try {
			// Ambil posisi karyawan untuk filtering pertanyaan
			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: { positionId: true },
			});

			if (!employee?.positionId) {
				return NextResponse.json(
					{ message: "Posisi karyawan tidak ditemukan." },
					{ status: 404 }
				);
			}

			// Ambil detail kuesioner beserta pertanyaan yang sudah difilter
			const questionnaire = await prisma.questionnaire.findUnique({
				where: { id: questionnaireId },
				select: {
					id: true,
					title: true,
					description: true,
					questions: {
						where: {
							// Logika filter:
							// 1. Ambil pertanyaan yang tidak terikat ke posisi manapun (umum)
							// 2. ATAU ambil pertanyaan yang terikat spesifik ke posisi karyawan ini
							OR: [
								{ positions: { none: {} } },
								{ positions: { some: { id: employee.positionId } } },
							],
						},
						select: {
							id: true,
							text: true,
							competency: true,
							subCompetency: true,
						},
						orderBy: {
							createdAt: "asc", // Menjaga urutan pertanyaan tetap konsisten
						},
					},
				},
			});

			if (!questionnaire) {
				return NextResponse.json(
					{ message: "Kuesioner tidak ditemukan." },
					{ status: 404 }
				);
			}

			// Kelompokkan pertanyaan berdasarkan competency dan subCompetency untuk frontend
			const groupedQuestions = questionnaire.questions.reduce((acc, q) => {
				const competencyKey = q.competency;
				const subCompetencyKey = q.subCompetency;

				if (!acc[competencyKey]) {
					acc[competencyKey] = {};
				}
				if (!acc[competencyKey][subCompetencyKey]) {
					acc[competencyKey][subCompetencyKey] = [];
				}
				acc[competencyKey][subCompetencyKey].push({ id: q.id, text: q.text });
				return acc;
			}, {} as Record<string, Record<string, { id: string; text: string }[]>>);

			const response = {
				id: questionnaire.id,
				title: questionnaire.title,
				description: questionnaire.description,
				groupedQuestions,
				totalQuestions: questionnaire.questions.length,
			};

			return NextResponse.json(response);
		} catch (error) {
			console.error(
				`Error fetching questionnaire [${questionnaireId}]:`,
				error
			);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
