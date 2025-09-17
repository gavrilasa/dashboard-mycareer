// app/api/employee/dashboard/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { JobInterest, JobRole, JobVacancy } from "@prisma/client";

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

type JobInterestWithRelations = JobInterest & {
	jobVacancy: JobVacancy & {
		jobRole: JobRole | null;
	};
};

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;
		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan." },
				{ status: 403 }
			);
		}

		try {
			const employeeData = await prisma.employee.findUnique({
				where: { employeeId },
				include: {
					position: { select: { name: true } },
					department: { select: { name: true } },
					branch: { select: { name: true } },
					careerHistories: { orderBy: { startDate: "desc" } },
					organizationHistories: { orderBy: { startDate: "desc" } },
					committeeHistories: { orderBy: { year: "desc" } },
					projectHistories: { orderBy: { year: "desc" } },
					gkmHistory: true,
					bestEmployeeScore: true,
					careerPreference: true,
					jobInterests: {
						orderBy: [{ interestType: "asc" }, { period: "asc" }],
						include: {
							jobVacancy: {
								include: { jobRole: true },
							},
						},
					},
					questionnaireResponses: {
						select: {
							questionnaire: { select: { title: true } },
						},
					},
				},
			});

			if (!employeeData) {
				return NextResponse.json(
					{ message: "Data karyawan tidak ditemukan." },
					{ status: 404 }
				);
			}

			const positionIds = [
				...new Set(employeeData.careerHistories.map((h) => h.positionId)),
			];
			const departmentIds = [
				...new Set(employeeData.careerHistories.map((h) => h.departmentId)),
			];

			const [positions, departments] = await Promise.all([
				prisma.position.findMany({
					where: { id: { in: positionIds } },
					select: { id: true, name: true },
				}),
				prisma.department.findMany({
					where: { id: { in: departmentIds } },
					select: { id: true, name: true },
				}),
			]);

			const positionMap = new Map(positions.map((p) => [p.id, p.name]));
			const departmentMap = new Map(departments.map((d) => [d.id, d.name]));

			const careerHistoriesWithNames = employeeData.careerHistories.map(
				(history) => ({
					...history,
					positionName:
						positionMap.get(history.positionId) || history.positionId,
					departmentName:
						departmentMap.get(history.departmentId) || history.departmentId,
				})
			);

			const isFormComplete = !!employeeData.gkmHistory;
			const { departmentId } = employeeData;
			let incompleteQuestionnaireCount = 0;

			if (departmentId) {
				const departmentCodeParts = departmentId.split("-");
				const departmentShortCode =
					departmentCodeParts.length > 2
						? departmentCodeParts.slice(1).join("-")
						: departmentId;
				const technicalQuestionnaireTitle =
					departmentToQuestionnaireMap[departmentShortCode];

				const requiredTitles = new Set([
					"Kuesioner Mapping Kompetensi Manajerial",
					technicalQuestionnaireTitle,
				]);

				const submittedTitles = new Set(
					employeeData.questionnaireResponses.map((r) => r.questionnaire.title)
				);

				requiredTitles.forEach((title) => {
					if (title && !submittedTitles.has(title)) {
						incompleteQuestionnaireCount++;
					}
				});
			}

			const response = {
				profile: {
					employeeId: employeeData.employeeId,
					fullName: employeeData.fullName,
					position: employeeData.position?.name,
					department: employeeData.department?.name,
					branch: employeeData.branch?.name,
					contact: {
						phone: employeeData.phoneNumber,
						address: employeeData.address,
					},
				},
				status: {
					isFormComplete,
					incompleteQuestionnaireCount,
				},
				careerInterests: employeeData.jobInterests.map(
					(interest: JobInterestWithRelations) => ({
						type: `${interest.interestType}_${interest.period}`,
						jobRoleName: interest.jobVacancy.jobRole?.name,
					})
				),
				histories: {
					career: careerHistoriesWithNames,
					organization: employeeData.organizationHistories,
					committee: employeeData.committeeHistories,
					project: employeeData.projectHistories,
				},
				achievements: {
					gkm: employeeData.gkmHistory,
					bestEmployee: employeeData.bestEmployeeScore,
				},
			};

			return NextResponse.json(response);
		} catch (error) {
			console.error("Error fetching employee dashboard data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
