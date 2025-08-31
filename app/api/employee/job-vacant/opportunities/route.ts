import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { PathType, VacancyPeriod } from "@prisma/client";

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

const STAGES_ORDER: { pathType: PathType; period: VacancyPeriod }[] = [
	{ pathType: "ALIGN", period: "SHORT_TERM" },
	{ pathType: "ALIGN", period: "LONG_TERM" },
	{ pathType: "CROSS", period: "SHORT_TERM" },
	{ pathType: "CROSS", period: "LONG_TERM" },
];

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;
		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan." },
				{ status: 403 }
			);
		}

		try {
			const url = new URL(req.url);
			const requestedStage = url.searchParams.get("stage");

			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					departmentId: true,
					position: { select: { jobRoleId: true } },
					careerPreference: { select: { isWillingToRelocate: true } },
					gkmHistory: true,
					questionnaireResponses: {
						select: { questionnaire: { select: { title: true } } },
					},
				},
			});

			if (!employee?.position?.jobRoleId || !employee.departmentId) {
				return NextResponse.json(
					{ message: "Data Job Role atau Departemen Anda tidak ditemukan." },
					{ status: 404 }
				);
			}

			if (
				!employee.careerPreference ||
				employee.careerPreference.isWillingToRelocate === null
			) {
				return NextResponse.json({
					stage: "AWAITING_RELOCATION",
					opportunities: [],
				});
			}

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
			const hasCompletedAllQuestionnaires = [...requiredTitles].every((title) =>
				submittedTitles.has(title)
			);
			const isProfileComplete =
				employee.gkmHistory && hasCompletedAllQuestionnaires;

			if (!isProfileComplete) {
				const allRelevantPaths = await prisma.careerPath.findMany({
					where: { fromJobRoleId: employee.position.jobRoleId },
					select: { toJobRoleId: true },
				});
				const targetJobRoleIds = allRelevantPaths.map(
					(path) => path.toJobRoleId
				);
				const opportunities = await prisma.jobVacancy.findMany({
					where: { isPublished: true, jobRoleId: { in: targetJobRoleIds } },
					include: { jobRole: { select: { name: true } } },
				});
				return NextResponse.json({
					stage: "INCOMPLETE_PROFILE",
					opportunities,
				});
			}

			const existingInterests = await prisma.jobInterest.findMany({
				where: { employeeId },
				select: { interestType: true, period: true },
			});

			let nextStageInfo: { pathType: PathType; period: VacancyPeriod } | null =
				null;
			for (const stage of STAGES_ORDER) {
				const isCompleted = existingInterests.some(
					(cs) =>
						cs.interestType === stage.pathType && cs.period === stage.period
				);
				if (!isCompleted) {
					nextStageInfo = stage;
					break;
				}
			}

			if (!nextStageInfo) {
				return NextResponse.json({ stage: "COMPLETED", opportunities: [] });
			}

			const hasCompletedAllAlign = existingInterests.some(
				(i) => i.interestType === "ALIGN" && i.period === "LONG_TERM"
			);
			const isEnteringCross = nextStageInfo.pathType === "CROSS";
			const hasStartedCross = existingInterests.some(
				(i) => i.interestType === "CROSS"
			);

			// FIX: Tambahkan pengecekan `requestedStage` untuk menghindari perulangan
			if (
				isEnteringCross &&
				!hasStartedCross &&
				hasCompletedAllAlign &&
				requestedStage !== "GUIDED_CROSS_SHORT_TERM"
			) {
				return NextResponse.json({
					stage: "GUIDED_TRANSITION",
					opportunities: [],
				});
			}

			const relevantPaths = await prisma.careerPath.findMany({
				where: {
					fromJobRoleId: employee.position.jobRoleId,
					pathType: nextStageInfo.pathType,
					period: nextStageInfo.period,
				},
				select: { toJobRoleId: true },
			});
			const targetJobRoleIds = relevantPaths.map((path) => path.toJobRoleId);

			const opportunities = await prisma.jobVacancy.findMany({
				where: { isPublished: true, jobRoleId: { in: targetJobRoleIds } },
				include: { jobRole: { select: { name: true } } },
			});

			const stageName = `GUIDED_${nextStageInfo.pathType}_${nextStageInfo.period}`;

			return NextResponse.json({ stage: stageName, opportunities });
		} catch (error) {
			console.error("Error fetching job opportunities:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
