// app/api/employee/questionnaires/[questionnaireId]/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

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
			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					position: {
						select: {
							jobRoleId: true,
						},
					},
				},
			});

			const jobRoleId = employee?.position?.jobRoleId;

			if (!jobRoleId) {
				return NextResponse.json(
					{ message: "Peran jabatan (JobRole) karyawan tidak ditemukan." },
					{ status: 404 }
				);
			}

			const questionnaireInfo = await prisma.questionnaire.findUnique({
				where: { id: questionnaireId },
				select: { title: true },
			});

			if (!questionnaireInfo) {
				return NextResponse.json(
					{ message: "Kuesioner tidak ditemukan." },
					{ status: 404 }
				);
			}

			let questionsWhereClause: Prisma.QuestionWhereInput = {
				OR: [
					{ jobRoles: { none: {} } },
					{ jobRoles: { some: { id: jobRoleId } } },
				],
			};

			if (
				questionnaireInfo.title === "Kuesioner Mapping Kompetensi Manajerial"
			) {
				questionsWhereClause = {};
			}

			const questionnaire = await prisma.questionnaire.findUnique({
				where: { id: questionnaireId },
				select: {
					id: true,
					title: true,
					description: true,
					questions: {
						where: questionsWhereClause,
						select: {
							id: true,
							text: true,
							competency: true,
							subCompetency: true,
						},
						orderBy: {
							createdAt: "asc",
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
