import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { PathType, VacancyPeriod } from "@prisma/client";

// Urutan tahapan yang harus dilalui karyawan
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
			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					position: { select: { jobRoleId: true } },
					careerPreference: { select: { isWillingToRelocate: true } },
					gkmHistory: true,
					questionnaireResponses: { take: 1 },
				},
			});

			if (!employee?.position?.jobRoleId) {
				return NextResponse.json(
					{ message: "Data Job Role Anda tidak ditemukan." },
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

			const isProfileComplete =
				employee.gkmHistory && employee.questionnaireResponses.length > 0;

			if (!isProfileComplete) {
				const allRelevantPaths = await prisma.careerPath.findMany({
					where: { fromJobRoleId: employee.position.jobRoleId },
					select: { toJobRoleId: true },
				});
				const targetJobRoleIds = allRelevantPaths.map(
					(path) => path.toJobRoleId
				);

				const opportunities = await prisma.jobVacancy.findMany({
					where: {
						isPublished: true,
						jobRoleId: { in: targetJobRoleIds },
					},
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

			let nextStageInfo: {
				pathType: PathType;
				period: VacancyPeriod;
			} | null = null;
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

			if (isEnteringCross && !hasStartedCross && hasCompletedAllAlign) {
				return NextResponse.json({
					stage: "GUIDED_TRANSITION",
					opportunities: [],
				});
			}

			// FIX: Logika diubah untuk mencocokkan 'period' dari CareerPath
			const relevantPaths = await prisma.careerPath.findMany({
				where: {
					fromJobRoleId: employee.position.jobRoleId,
					pathType: nextStageInfo.pathType,
					period: nextStageInfo.period, // <-- Kunci perubahan ada di sini
				},
				select: { toJobRoleId: true },
			});
			const targetJobRoleIds = relevantPaths.map((path) => path.toJobRoleId);

			const opportunities = await prisma.jobVacancy.findMany({
				where: {
					isPublished: true,
					jobRoleId: { in: targetJobRoleIds },
				},
				include: { jobRole: { select: { name: true } } },
			});

			const currentStage = `GUIDED_${nextStageInfo.pathType}`;

			return NextResponse.json({
				stage: currentStage,
				opportunities,
			});
		} catch (error) {
			console.error("Error fetching job opportunities:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
