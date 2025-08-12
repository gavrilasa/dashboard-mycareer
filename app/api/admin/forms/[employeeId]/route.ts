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

			return NextResponse.json(employeeData);
		} catch (error) {
			console.error("Error fetching form data for admin:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
