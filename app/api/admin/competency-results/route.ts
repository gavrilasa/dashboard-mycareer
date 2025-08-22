import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "questionnaire", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		try {
			const url = new URL(req.url);
			const search = url.searchParams.get("search") || "";
			const page = parseInt(url.searchParams.get("page") || "1", 10);
			const limit = parseInt(url.searchParams.get("limit") || "10", 10);
			const skip = (page - 1) * limit;

			// Gabungkan filter peran dengan filter pencarian secara aman
			const finalWhereClause: Prisma.EmployeeWhereInput = {
				...whereClause,
				fullName: {
					contains: search,
					mode: "insensitive",
				},
			};

			// 1. Ambil data karyawan yang sudah dipaginasi dan difilter
			const employees = await prisma.employee.findMany({
				where: finalWhereClause,
				skip,
				take: limit,
				select: {
					employeeId: true,
					fullName: true,
					position: { select: { name: true } }, // Menyertakan relasi position
				},
				orderBy: {
					fullName: "asc",
				},
			});

			const totalEmployees = await prisma.employee.count({
				where: finalWhereClause,
			});

			const employeeIds = employees.map((e) => e.employeeId);

			// 2. Ambil semua hasil kompetensi untuk karyawan di halaman ini
			const competencyResults = await prisma.competencyResult.findMany({
				where: {
					employeeId: {
						in: employeeIds,
					},
				},
			});

			// 3. Ambil semua rekomendasi pelatihan sekali saja
			const allRecommendations = await prisma.trainingRecommendation.findMany();

			// Buat peta rekomendasi untuk pencarian cepat, berdasarkan subCompetency
			// Note: This assumes we will add subCompetency to the results later
			const recommendationsMap = allRecommendations.reduce<
				Record<string, string[]>
			>((acc, rec) => {
				const key = rec.subCompetency || rec.competency; // Fallback to competency
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(rec.recommendation);
				return acc;
			}, {});

			// 4. Gabungkan data menjadi format respons yang diinginkan
			const responseData = employees.map((employee) => {
				const resultsForEmployee = competencyResults.filter(
					(r) => r.employeeId === employee.employeeId
				);

				const formattedResults = resultsForEmployee.map((result) => {
					let recommendations = "";
					if (result.recommendationNeeded) {
						// Placeholder: Logic to get sub-competencies for a competency would go here
						// For now, we'll look up by the main competency
						const recs = recommendationsMap[result.competency] || [];
						recommendations = recs.join(", ");
					}
					return {
						competency: result.competency,
						calculatedScore: result.calculatedScore,
						standardScore: result.standardScore,
						gap: result.gap,
						recommendations,
					};
				});

				return {
					employeeId: employee.employeeId,
					fullName: employee.fullName,
					positionName: employee.position.name,
					results: formattedResults,
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
