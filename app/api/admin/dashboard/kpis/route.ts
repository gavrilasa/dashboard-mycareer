// app/api/admin/dashboard/kpis/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// Peta kuesioner teknis yang sama digunakan di tempat lain untuk konsistensi
const departmentToQuestionnaireMap: Record<string, string> = {
	"ADM-FA": "Kuisioner Mapping Kompetensi Accounting",
	"ADM-GM": "Kuisioner Mapping Kompetensi MFG",
	"ADM-HR": "Kuisioner Mapping Kompetensi HR",
	"MFG-MFG": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PPIC": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PROD": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PURC": "Kuisioner Mapping Kompetensi MFG",
	"MFG-TECH": "Kuisioner Mapping Kompetensi MFG",
	"MFG-WRH": "Kuisioner Mapping Kompetensi MFG",
	"MKT-MKT": "Kuisioner Mapping Kompetensi Marketing",
	"MKT-SD": "Kuisioner Mapping Kompetensi Marketing",
	"RND-QCA": "Kuisioner Mapping Kompetensi MFG",
	"RND-RD": "Kuisioner Mapping Kompetensi MFG",
};

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Set ke awal hari

			// 1. Cek cache di tabel DashboardAnalytics untuk hari ini
			const cachedAnalytics = await prisma.dashboardAnalytics.findUnique({
				where: { date: today },
			});

			if (cachedAnalytics) {
				return NextResponse.json(cachedAnalytics);
			}

			// 2. Jika tidak ada cache, hitung KPI baru
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
				// Cek kelengkapan form
				const isFormComplete = !!employee.gkmHistory;

				// Cek kelengkapan kuesioner
				const departmentCodeParts = employee.departmentId.split("-");
				const departmentShortCode =
					departmentCodeParts.length > 2
						? departmentCodeParts.slice(1).join("-")
						: employee.departmentId;
				const technicalQuestionnaireTitle =
					departmentToQuestionnaireMap[departmentShortCode];

				const requiredTitles = new Set([
					"Kuisioner Mapping Kompetensi Managerial OPR STAFF",
					"Kuisioner Mapping Kompetensi Managerial SPV",
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
