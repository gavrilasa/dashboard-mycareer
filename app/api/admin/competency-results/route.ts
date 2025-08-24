import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

// Peta ini disalin dari logika penentuan kuesioner untuk konsistensi
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
	async (req: NextRequest, { whereClause }) => {
		try {
			const url = new URL(req.url);
			const search = url.searchParams.get("search") || "";
			const page = parseInt(url.searchParams.get("page") || "1", 10);
			const limit = parseInt(url.searchParams.get("limit") || "10", 10);
			// [!code focus:start]
			// FIX: Membaca parameter filter dari URL
			const branchId = url.searchParams.get("branchId");
			const departmentId = url.searchParams.get("departmentId");
			// [!code focus:end]
			const skip = (page - 1) * limit;

			// [!code focus:start]
			// FIX: Menambahkan filter branchId dan departmentId ke klausa 'where' awal
			if (branchId) {
				whereClause.branchId = branchId;
			}
			if (departmentId) {
				whereClause.departmentId = departmentId;
			}
			// [!code focus:end]

			// 1. Ambil semua karyawan beserta data yang diperlukan untuk menentukan kuesioner
			const allEmployees = await prisma.employee.findMany({
				where: whereClause, // Terapkan filter hak akses DAN filter dari UI
				select: {
					employeeId: true,
					departmentId: true,
					level: {
						select: {
							name: true,
						},
					},
					questionnaireResponses: {
						select: {
							questionnaire: {
								select: {
									title: true,
								},
							},
						},
					},
				},
			});

			// 2. Filter Karyawan Selesai
			const completedEmployeeIds = allEmployees
				.filter((employee) => {
					if (!employee.departmentId || !employee.level) return false;

					const departmentCodeParts = employee.departmentId.split("-");
					const departmentShortCode =
						departmentCodeParts.length > 2
							? departmentCodeParts.slice(1).join("-")
							: employee.departmentId;

					const technicalQuestionnaireTitle =
						departmentToQuestionnaireMap[departmentShortCode];

					if (!technicalQuestionnaireTitle) {
						return false;
					}

					const requiredTitles = new Set([
						"Kuisioner Mapping Kompetensi Managerial OPR STAFF",
						"Kuisioner Mapping Kompetensi Managerial SPV",
						technicalQuestionnaireTitle,
					]);

					const submittedTitles = new Set(
						employee.questionnaireResponses.map((r) => r.questionnaire.title)
					);

					return Array.from(requiredTitles).every((title) =>
						submittedTitles.has(title)
					);
				})
				.map((employee) => employee.employeeId);

			const finalWhereClause: Prisma.EmployeeWhereInput = {
				employeeId: {
					in: completedEmployeeIds,
				},
				...(search && {
					fullName: {
						contains: search,
						mode: "insensitive",
					},
				}),
			};

			const totalEmployees = await prisma.employee.count({
				where: finalWhereClause,
			});

			const employeesForPage = await prisma.employee.findMany({
				where: finalWhereClause,
				skip,
				take: limit,
				select: {
					employeeId: true,
					fullName: true,
					position: { select: { name: true } },
					department: { select: { name: true } },
					branch: { select: { name: true } },
				},
				orderBy: {
					fullName: "asc",
				},
			});

			const employeeIdsForPage = employeesForPage.map((e) => e.employeeId);

			const competencyResults = await prisma.competencyResult.findMany({
				where: {
					employeeId: {
						in: employeeIdsForPage,
					},
				},
				select: {
					employeeId: true,
					calculatedScore: true,
				},
			});

			const averageScores = employeeIdsForPage.reduce<Record<string, number>>(
				(acc, employeeId) => {
					const resultsForEmployee = competencyResults.filter(
						(r) => r.employeeId === employeeId
					);
					if (resultsForEmployee.length === 0) {
						acc[employeeId] = 0;
					} else {
						const totalScore = resultsForEmployee.reduce(
							(sum, r) => sum + r.calculatedScore,
							0
						);
						acc[employeeId] = totalScore / resultsForEmployee.length;
					}
					return acc;
				},
				{}
			);

			const responseData = employeesForPage.map((employee) => ({
				employeeId: employee.employeeId,
				fullName: employee.fullName,
				positionName: employee.position?.name || "-",
				departmentName: employee.department?.name || "-",
				branchName: employee.branch?.name || "-",
				overallAverageScore: averageScores[employee.employeeId] || 0,
			}));

			return NextResponse.json({
				data: responseData,
				meta: {
					total: totalEmployees,
					page,
					limit,
					totalPages: Math.ceil(totalEmployees / limit),
				},
			});
		} catch (error) {
			console.error("Error saat mengambil hasil kompetensi:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
