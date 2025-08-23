import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// Peta untuk menghubungkan ID departemen dengan judul kuesioner teknis (TETAP SAMA)
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
					positionId: true,
					departmentId: true,
					level: {
						select: {
							name: true,
						},
					},
				},
			});

			if (
				!employee?.positionId ||
				!employee?.departmentId ||
				!employee?.level
			) {
				return NextResponse.json(
					{
						message:
							"Data posisi, departemen, atau level karyawan tidak lengkap.",
					},
					{ status: 404 }
				);
			}

			const { positionId, departmentId, level } = employee;

			const standardExists = await prisma.competencyStandard.findFirst({
				where: {
					positionId,
				},
			});

			if (!standardExists) {
				return NextResponse.json(
					{ message: "Fitur kuesioner belum tersedia untuk jabatan Anda." },
					{ status: 403 }
				);
			}

			// --- PERBAIKAN LOGIKA DIMULAI DI SINI ---
			// Ekstrak kode departemen dari ID lengkap. Contoh: "N004-MFG-PROD" -> "MFG-PROD"
			const departmentCodeParts = departmentId.split("-");
			const departmentShortCode =
				departmentCodeParts.length > 2
					? departmentCodeParts.slice(1).join("-")
					: departmentId;

			const technicalQuestionnaireTitle =
				departmentToQuestionnaireMap[departmentShortCode]; // Gunakan kode yang sudah diekstrak

			if (!technicalQuestionnaireTitle) {
				return NextResponse.json(
					{
						message: "Kuesioner teknis untuk departemen Anda tidak ditemukan.",
					},
					{ status: 404 }
				);
			}
			// --- AKHIR PERBAIKAN LOGIKA ---

			// Tentukan kuesioner manajerial berdasarkan level
			let managerialQuestionnaireTitle = "";
			const normalizedLevelName = level.name.toLowerCase();
			if (
				normalizedLevelName.includes("staff") ||
				normalizedLevelName.includes("operatif")
			) {
				managerialQuestionnaireTitle =
					"Kuisioner Mapping Kompetensi Managerial OPR STAFF";
			} else if (normalizedLevelName.includes("supervisor")) {
				managerialQuestionnaireTitle =
					"Kuisioner Mapping Kompetensi Managerial SPV";
			}

			if (!managerialQuestionnaireTitle) {
				return NextResponse.json(
					{
						message:
							"Kuesioner manajerial untuk level jabatan Anda tidak ditemukan.",
					},
					{ status: 404 }
				);
			}

			const requiredTitles = [
				managerialQuestionnaireTitle,
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
