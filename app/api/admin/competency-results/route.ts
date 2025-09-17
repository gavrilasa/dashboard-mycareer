// app/api/admin/competency-results/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

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
				AND: [
					{
						questionnaireResponses: {
							some: {
								questionnaire: {
									title: "Kuesioner Mapping Kompetensi Manajerial",
								},
							},
						},
					},
					{
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

			const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
				[sortBy]: sortOrder,
			};

			const [employeesForPage, totalEmployees] = await prisma.$transaction([
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
						competencyResults: {
							select: {
								calculatedScore: true,
							},
						},
					},
					orderBy,
				}),
				prisma.employee.count({
					where: finalWhereClause,
				}),
			]);

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
