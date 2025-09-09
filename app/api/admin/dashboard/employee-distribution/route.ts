// app/api/admin/dashboard/employee-distribution/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Role } from "@prisma/client";

// Definisikan tipe untuk struktur data yang konsisten
interface DistributionData {
	name: string;
	value: number;
}

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest, { session }) => {
		try {
			const userRole = session?.user?.role;
			const userBranchId = session?.user?.branchId;

			if (!userRole) {
				return NextResponse.json(
					{ message: "Peran pengguna tidak ditemukan." },
					{ status: 403 }
				);
			}

			// Terapkan tipe eksplisit pada variabel saat inisialisasi
			let distributionData: DistributionData[] = [];

			if (userRole === Role.ADMIN) {
				// Logika untuk Admin: Agregasi per cabang
				const data = await prisma.employee.groupBy({
					by: ["branchId"],
					_count: {
						employeeId: true,
					},
					orderBy: {
						_count: {
							employeeId: "desc",
						},
					},
				});

				const branches = await prisma.branch.findMany({
					where: {
						id: { in: data.map((d) => d.branchId) },
					},
					select: { id: true, name: true },
				});
				const branchMap = new Map(branches.map((b) => [b.id, b.name]));

				distributionData = data.map((item) => ({
					name: branchMap.get(item.branchId) || item.branchId,
					value: item._count.employeeId,
				}));
			} else if (userRole === Role.HR_BRANCH && userBranchId) {
				// Logika untuk HR Branch: Agregasi per departemen dalam satu cabang
				const data = await prisma.employee.groupBy({
					by: ["departmentId"],
					where: {
						branchId: userBranchId,
					},
					_count: {
						employeeId: true,
					},
					orderBy: {
						_count: {
							employeeId: "desc",
						},
					},
				});

				const departments = await prisma.department.findMany({
					where: {
						id: { in: data.map((d) => d.departmentId) },
					},
					select: { id: true, name: true },
				});
				const departmentMap = new Map(departments.map((d) => [d.id, d.name]));

				distributionData = data.map((item) => ({
					name: departmentMap.get(item.departmentId) || item.departmentId,
					value: item._count.employeeId,
				}));
			}

			return NextResponse.json(distributionData);
		} catch (error) {
			console.error("Error fetching employee distribution data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
