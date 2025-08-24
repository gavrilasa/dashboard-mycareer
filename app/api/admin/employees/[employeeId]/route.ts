// app/api/admin/employees/[employeeId]/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

interface HandlerContext {
	params: { employeeId: string };
}

export const GET = withAuthorization(
	{ resource: "employee", action: "read" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		const { employeeId } = params;
		if (typeof employeeId !== "string") {
			return NextResponse.json(
				{ message: "ID Karyawan tidak valid" },
				{ status: 400 }
			);
		}
		const employee = await prisma.employee.findUnique({
			where: { employeeId },
			include: {
				position: { select: { name: true } },
				department: { select: { name: true } },
				branch: { select: { name: true } },
			},
		});

		return employee
			? NextResponse.json(employee)
			: NextResponse.json(
					{ message: "Karyawan tidak ditemukan" },
					{ status: 404 }
			  );
	}
);

export const PUT = withAuthorization(
	{ resource: "employee", action: "update" },
	async (req: NextRequest, _args, { params }: HandlerContext) => {
		const { employeeId } = params;
		if (typeof employeeId !== "string") {
			return NextResponse.json(
				{ message: "ID Karyawan tidak valid" },
				{ status: 400 }
			);
		}
		try {
			const body = await req.json();
			const {
				fullName,
				gender,
				dateOfBirth,
				hireDate,
				lastEducationDegree,
				lastEducationSchool,
				lastEducationMajor,
				branchId,
				departmentId,
				positionId,
				levelId,
				role,
			} = body;

			const updatedEmployee = await prisma.employee.update({
				where: { employeeId },
				data: {
					fullName,
					gender,
					dateOfBirth: new Date(dateOfBirth),
					hireDate: new Date(hireDate),
					lastEducationDegree,
					lastEducationSchool,
					lastEducationMajor,
					branch: { connect: { id: branchId } },
					department: { connect: { id: departmentId } },
					position: { connect: { id: positionId } },
					level: { connect: { id: levelId } },
					user: {
						update: {
							role: role,
						},
					},
				},
			});
			return NextResponse.json(updatedEmployee);
		} catch (error) {
			console.error("Error updating employee:", error);
			return NextResponse.json(
				{ message: "Gagal memperbarui karyawan" },
				{ status: 500 }
			);
		}
	}
);

export const DELETE = withAuthorization(
	{ resource: "employee", action: "delete" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		const { employeeId } = params;
		if (typeof employeeId !== "string") {
			return NextResponse.json(
				{ message: "ID Karyawan tidak valid" },
				{ status: 400 }
			);
		}
		try {
			await prisma.$transaction(async (tx) => {
				// Find user first to ensure it exists before trying to delete employee
				const user = await tx.user.findUnique({ where: { employeeId } });
				if (user) {
					await tx.employee.delete({ where: { employeeId } });
					await tx.user.delete({ where: { employeeId } });
				} else {
					// If no user, just delete the employee if they exist
					await tx.employee.delete({ where: { employeeId } });
				}
			});
			return new NextResponse(null, { status: 204 });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				return new NextResponse(null, { status: 204 });
			}
			console.error("Error deleting employee:", error);
			return NextResponse.json(
				{ message: "Gagal menghapus karyawan" },
				{ status: 500 }
			);
		}
	}
);
