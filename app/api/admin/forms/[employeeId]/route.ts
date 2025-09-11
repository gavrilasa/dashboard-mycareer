// app/api/admin/forms/[employeeId]/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

interface HandlerContext {
	params: {
		employeeId: string;
	};
}

export const GET = withAuthorization(
	{ resource: "form", action: "read" },
	async (_req: NextRequest, _args, context: HandlerContext) => {
		const { employeeId } = context.params;

		if (!employeeId) {
			return NextResponse.json(
				{ message: "ID Karyawan tidak valid atau tidak ditemukan." },
				{ status: 400 }
			);
		}

		try {
			// Langkah 1: Ambil data utama, termasuk careerHistories dengan ID-nya
			const employeeData = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					fullName: true,
					careerHistories: { orderBy: { startDate: "desc" } },
					organizationHistories: { orderBy: { startDate: "desc" } },
					committeeHistories: { orderBy: { year: "desc" } },
					projectHistories: { orderBy: { year: "desc" } },
					gkmHistory: true,
					bestEmployeeScore: true,
					careerPreference: true,
				},
			});

			if (!employeeData) {
				return NextResponse.json(
					{ message: "Data formulir untuk karyawan ini tidak ditemukan." },
					{ status: 404 }
				);
			}

			// Langkah 2: Kumpulkan semua ID yang diperlukan dari careerHistories
			const positionIds = [
				...new Set(employeeData.careerHistories.map((h) => h.positionId)),
			];
			const departmentIds = [
				...new Set(employeeData.careerHistories.map((h) => h.departmentId)),
			];
			const branchIds = [
				...new Set(employeeData.careerHistories.map((h) => h.branchId)),
			];

			// Langkah 3: Ambil data nama dalam query terpisah yang efisien
			const [positions, departments, branches] = await Promise.all([
				prisma.position.findMany({
					where: { id: { in: positionIds } },
					select: { id: true, name: true },
				}),
				prisma.department.findMany({
					where: { id: { in: departmentIds } },
					select: { id: true, name: true },
				}),
				prisma.branch.findMany({
					where: { id: { in: branchIds } },
					select: { id: true, name: true },
				}),
			]);

			// Langkah 4: Buat Map untuk lookup cepat
			const positionMap = new Map(positions.map((p) => [p.id, p.name]));
			const departmentMap = new Map(departments.map((d) => [d.id, d.name]));
			const branchMap = new Map(branches.map((b) => [b.id, b.name]));

			// Langkah 5: Gabungkan data nama ke dalam careerHistories
			const enrichedCareerHistories = employeeData.careerHistories.map(
				(history) => ({
					...history,
					position: {
						name: positionMap.get(history.positionId) || "Data tidak ditemukan",
					},
					department: {
						name:
							departmentMap.get(history.departmentId) || "Data tidak ditemukan",
					},
					branch: {
						name: branchMap.get(history.branchId) || "Data tidak ditemukan",
					},
				})
			);

			// Langkah 6: Kirim respons dengan data yang sudah digabungkan
			const responseData = {
				...employeeData,
				careerHistories: enrichedCareerHistories,
			};

			return NextResponse.json(responseData);
		} catch (error) {
			console.error("Error fetching form data for admin:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
