// app/api/employee/questionnaires/[questionnaireId]/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

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
			// --- PERUBAHAN LOGIKA 1: Ambil jobRoleId Karyawan ---
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

			// --- PERUBAHAN LOGIKA 2: Ambil Pertanyaan Berdasarkan jobRoleId ---
			const questionnaire = await prisma.questionnaire.findUnique({
				where: { id: questionnaireId },
				select: {
					id: true,
					title: true,
					description: true,
					questions: {
						where: {
							// Filter baru:
							// 1. Ambil pertanyaan yang tidak terikat ke JobRole manapun (umum)
							// 2. ATAU ambil pertanyaan yang terikat spesifik ke jobRoleId karyawan ini
							OR: [
								{ jobRoles: { none: {} } },
								{ jobRoles: { some: { id: jobRoleId } } },
							],
						},
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

			// Sisa logika untuk mengelompokkan pertanyaan tetap sama
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
