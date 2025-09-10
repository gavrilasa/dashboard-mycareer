// app/api/admin/dashboard/competency-by-department/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest, { whereClause }) => {
		try {
			// 1. Ambil semua data skor kompetensi yang relevan
			const competencyResults = await prisma.competencyResult.findMany({
				where: {
					employee: whereClause, // Terapkan filter berbasis peran (untuk HR_BRANCH)
				},
				select: {
					calculatedScore: true,
					employee: {
						select: {
							department: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});

			// 2. Agregasi data di dalam aplikasi
			const aggregationMap = new Map<
				string,
				{ totalScore: number; count: number }
			>();

			competencyResults.forEach((result) => {
				const departmentName = result.employee?.department?.name;
				if (departmentName) {
					const existing = aggregationMap.get(departmentName) || {
						totalScore: 0,
						count: 0,
					};
					existing.totalScore += result.calculatedScore;
					existing.count++;
					aggregationMap.set(departmentName, existing);
				}
			});

			// 3. Hitung rata-rata dan format data
			const departmentAverages = Array.from(aggregationMap.entries()).map(
				([name, { totalScore, count }]) => ({
					name: name,
					value: totalScore / count,
				})
			);

			// 4. Urutkan dari tertinggi ke terendah
			departmentAverages.sort((a, b) => b.value - a.value);

			return NextResponse.json(departmentAverages);
		} catch (error) {
			console.error("Error fetching competency by department:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
