// app/api/admin/dashboard/kpis/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

const departmentToQuestionnaireMap: Record<string, string> = {
	"ADM-FA": "Kuesioner Mapping Kompetensi Accounting",
	"ADM-GM": "Kuesioner Mapping Kompetensi MFG",
	"ADM-HR": "Kuesioner Mapping Kompetensi HR",
	"MFG-MFG": "Kuesioner Mapping Kompetensi MFG",
	"MFG-PPIC": "Kuesioner Mapping Kompetensi MFG",
	"MFG-PROD": "Kuesioner Mapping Kompetensi MFG",
	"MFG-PURC": "Kuesioner Mapping Kompetensi MFG",
	"MFG-TECH": "Kuesioner Mapping Kompetensi MFG",
	"MFG-WRH": "Kuesioner Mapping Kompetensi MFG",
	"MKT-MKT": "Kuesioner Mapping Kompetensi Marketing",
	"MKT-SD": "Kuesioner Mapping Kompetensi Marketing",
	"RND-QCA": "Kuesioner Mapping Kompetensi MFG",
	"RND-RD": "Kuesioner Mapping Kompetensi MFG",
};

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const cachedAnalytics = await prisma.dashboardAnalytics.findUnique({
				where: { date: today },
			});

			if (cachedAnalytics) {
				return NextResponse.json(cachedAnalytics);
			}

			const [totalEmployees, totalVacancies, allEmployeesForCompletionCheck] =
				await prisma.$transaction([
					prisma.employee.count(),
					prisma.jobVacancy.count({ where: { isPublished: true } }),
					prisma.employee.findMany({
						select: {
							departmentId: true,
							gkmHistory: true,
							questionnaireResponses: {
								select: {
									questionnaire: {
										select: { title: true },
									},
								},
							},
						},
					}),
				]);

			let totalFormsCompleted = 0;
			let totalQuestionnairesCompleted = 0;

			allEmployeesForCompletionCheck.forEach((employee) => {
				const isFormComplete = !!employee.gkmHistory;

				const departmentCodeParts = employee.departmentId.split("-");
				const departmentShortCode =
					departmentCodeParts.length > 2
						? departmentCodeParts.slice(1).join("-")
						: employee.departmentId;
				const technicalQuestionnaireTitle =
					departmentToQuestionnaireMap[departmentShortCode];

				const requiredTitles = new Set([
					"Kuesioner Mapping Kompetensi Manajerial",
					technicalQuestionnaireTitle,
				]);

				const submittedTitles = new Set(
					employee.questionnaireResponses.map((r) => r.questionnaire.title)
				);

				const hasCompletedAllQuestionnaires = [...requiredTitles].every(
					(title) => submittedTitles.has(title)
				);

				if (hasCompletedAllQuestionnaires) {
					totalQuestionnairesCompleted++;
				}

				if (isFormComplete && hasCompletedAllQuestionnaires) {
					totalFormsCompleted++;
				}
			});

			const newAnalytics = {
				date: today,
				totalEmployees,
				totalFormsCompleted,
				totalQuestionnaires: totalQuestionnairesCompleted,
				totalVacancies,
			};

			await prisma.dashboardAnalytics.create({
				data: newAnalytics,
			});

			return NextResponse.json(newAnalytics);
		} catch (error) {
			console.error("Error fetching dashboard KPIs:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
