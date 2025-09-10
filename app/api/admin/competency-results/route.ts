// app/api/admin/competency-results/route.ts
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
			const branchId = url.searchParams.get("branchId");
			const departmentId = url.searchParams.get("departmentId");
			const positionId = url.searchParams.get("positionId");
			const sortBy = url.searchParams.get("sortBy") || "fullName";
			const sortOrder = url.searchParams.get("sortOrder") || "asc";
			const skip = (page - 1) * limit;

			// **OPTIMASI: Bangun klausa 'where' yang kompleks untuk filtering di database**
			const finalWhereClause: Prisma.EmployeeWhereInput = {
				...whereClause,
				...(branchId && { branchId }),
				...(departmentId && { departmentId }),
				...(positionId && { positionId }),
				...(search && {
					OR: [
						{ fullName: { contains: search, mode: "insensitive" } },
						{ position: { name: { contains: search, mode: "insensitive" } } },
						{ department: { name: { contains: search, mode: "insensitive" } } },
					],
				}),
				// Filter hanya karyawan yang sudah mengisi semua kuesioner yang relevan
				AND: [
					{
						questionnaireResponses: {
							some: {
								questionnaire: {
									title: "Kuisioner Mapping Kompetensi Managerial OPR STAFF",
								},
							},
						},
					},
					{
						questionnaireResponses: {
							some: {
								questionnaire: {
									title: "Kuisioner Mapping Kompetensi Managerial SPV",
								},
							},
						},
					},
					{
						// Filter kuesioner teknis berdasarkan departemen
						OR: Object.entries(departmentToQuestionnaireMap).map(
							([deptShortCode, questionnaireTitle]) => ({
								AND: [
									{ departmentId: { endsWith: deptShortCode } },
									{
										questionnaireResponses: {
											some: { questionnaire: { title: questionnaireTitle } },
										},
									},
								],
							})
						),
					},
				],
			};

			// Dynamic Sorting Logic
			const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
				[sortBy]: sortOrder,
			};

			// **OPTIMASI: Lakukan dua query terpisah yang jauh lebih ringan**
			const [employeesForPage, totalEmployees] = await prisma.$transaction([
				// 1. Ambil hanya data karyawan per halaman yang sudah lolos filter
				prisma.employee.findMany({
					where: finalWhereClause,
					skip,
					take: limit,
					select: {
						employeeId: true,
						fullName: true,
						position: { select: { name: true } },
						department: { select: { name: true } },
						branch: { select: { name: true } },
						// Ambil skor rata-rata langsung dari database
						competencyResults: {
							select: {
								calculatedScore: true,
							},
						},
					},
					orderBy,
				}),
				// 2. Hitung total karyawan yang memenuhi kriteria (tanpa mengambil datanya)
				prisma.employee.count({
					where: finalWhereClause,
				}),
			]);

			// **OPTIMASI: Proses data yang sudah terpaginasi di sisi aplikasi**
			const responseData = employeesForPage.map((employee) => {
				const totalScore = employee.competencyResults.reduce(
					(sum, r) => sum + r.calculatedScore,
					0
				);
				const averageScore =
					employee.competencyResults.length > 0
						? totalScore / employee.competencyResults.length
						: 0;

				return {
					employeeId: employee.employeeId,
					fullName: employee.fullName,
					positionName: employee.position?.name || "-",
					departmentName: employee.department?.name || "-",
					branchName: employee.branch?.name || "-",
					overallAverageScore: averageScore,
				};
			});

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
