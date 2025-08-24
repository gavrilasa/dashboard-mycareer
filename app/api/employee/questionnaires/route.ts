import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// Peta ini tidak berubah, tetap digunakan untuk kuesioner teknis
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
			// [!code focus:start]
			// FIX: Karyawan sekarang harus mengisi kedua kuesioner manajerial.
			const requiredTitles = [
				"Kuisioner Mapping Kompetensi Managerial OPR STAFF",
				"Kuisioner Mapping Kompetensi Managerial SPV",
				technicalQuestionnaireTitle,
			];
			// [!code focus:end]

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
