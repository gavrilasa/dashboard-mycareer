// app/api/employee/questionnaires/route.ts

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
	{ resource: "questionnaire", action: "read" },
	async (_req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;

		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan di dalam sesi." },
				{ status: 403 }
			);
		}

		try {
			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					departmentId: true,
					position: {
						select: {
							jobRoleId: true,
						},
					},
				},
			});

			const jobRoleId = employee?.position?.jobRoleId;
			const departmentId = employee?.departmentId;

			if (!jobRoleId || !departmentId) {
				return NextResponse.json(
					{
						message:
							"Data peran jabatan (JobRole) atau departemen karyawan tidak lengkap.",
					},
					{ status: 404 }
				);
			}

			const standardExists = await prisma.competencyStandard.findFirst({
				where: {
					jobRoleId: jobRoleId,
				},
			});

			if (!standardExists) {
				return NextResponse.json(
					{ message: "Fitur kuesioner belum tersedia untuk jabatan Anda." },
					{ status: 403 }
				);
			}

			const departmentCodeParts = departmentId.split("-");
			const departmentShortCode =
				departmentCodeParts.length > 2
					? departmentCodeParts.slice(1).join("-")
					: departmentId;

			const technicalQuestionnaireTitle =
				departmentToQuestionnaireMap[departmentShortCode];

			if (!technicalQuestionnaireTitle) {
				return NextResponse.json(
					{
						message: "Kuesioner teknis untuk departemen Anda tidak ditemukan.",
					},
					{ status: 404 }
				);
			}

			const requiredTitles = [
				"Kuesioner Mapping Kompetensi Manajerial",
				technicalQuestionnaireTitle,
			];

			const questionnaires = await prisma.questionnaire.findMany({
				where: {
					title: {
						in: requiredTitles,
					},
				},
				select: {
					id: true,
					title: true,
					description: true,
				},
			});

			if (questionnaires.length === 0) {
				return NextResponse.json(
					{ message: "Gagal menemukan kuesioner yang dibutuhkan." },
					{ status: 500 }
				);
			}

			const questionnaireIds = questionnaires.map((q) => q.id);

			const completedResponses = await prisma.questionnaireResponse.findMany({
				where: {
					employeeId,
					questionnaireId: {
						in: questionnaireIds,
					},
				},
				select: {
					questionnaireId: true,
				},
			});

			const completedQuestionnaireIds = new Set(
				completedResponses.map((r) => r.questionnaireId)
			);

			const result = questionnaires.map((q) => ({
				id: q.id,
				title: q.title,
				description: q.description,
				isCompleted: completedQuestionnaireIds.has(q.id),
			}));

			return NextResponse.json(result);
		} catch (error) {
			console.error("Error saat mengambil daftar kuesioner:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
