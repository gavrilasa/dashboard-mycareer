import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth, isAuthorized } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

// GET: Mengambil detail satu karyawan dengan otorisasi
export async function GET(
	req: Request,
	{ params }: { params: { employeeId: string } }
) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { employeeId } = params;

	try {
		const employee = await prisma.employee.findUnique({
			where: { employeeId: employeeId },
			include: {
				branch: { select: { name: true } },
				department: { select: { name: true } },
				level: { select: { name: true } },
				position: { select: { name: true } },
				user: { select: { role: true } },
			},
		});

		if (!employee) {
			return NextResponse.json(
				{ message: "Karyawan tidak ditemukan" },
				{ status: 404 }
			);
		}

		// --- FIX for Authorization ---
		// Safely access custom properties on the session user object.
		// This assumes you have added `branchId` to the session in your NextAuth config.
		const userBranchId = (session.user as { branchId?: string }).branchId;

		const authorized =
			isAuthorized(session.user, {
				allowedRoles: ["ADMIN"],
				targetEmployeeId: employee.employeeId,
			}) ||
			(session.user.role === "HR_BRANCH" && userBranchId === employee.branchId);

		if (!authorized) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		return NextResponse.json(employee);
	} catch (error) {
		console.error(`Error fetching employee ${employeeId}:`, error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// PUT: Memperbarui data karyawan dengan otorisasi
export async function PUT(
	req: Request,
	{ params }: { params: { employeeId: string } }
) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { employeeId } = params;

	try {
		const employeeToUpdate = await prisma.employee.findUnique({
			where: { employeeId: employeeId },
			include: { position: true, department: true },
		});

		if (!employeeToUpdate) {
			return NextResponse.json(
				{ message: "Karyawan tidak ditemukan" },
				{ status: 404 }
			);
		}

		// --- FIX for Authorization ---
		const userBranchId = (session.user as { branchId?: string }).branchId;

		const authorized =
			isAuthorized(session.user, {
				allowedRoles: ["ADMIN"],
			}) ||
			(session.user.role === "HR_BRANCH" &&
				userBranchId === employeeToUpdate.branchId);

		if (!authorized) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		const body = await req.json();
		const {
			fullName,
			lastEducationSchool,
			lastEducationMajor,
			lastEducationDegree,
			positionId,
		} = body;

		const employeeDataToUpdate: Prisma.EmployeeUpdateInput = {};
		if (fullName) employeeDataToUpdate.fullName = fullName;
		if (lastEducationSchool)
			employeeDataToUpdate.lastEducationSchool = lastEducationSchool;
		if (lastEducationMajor)
			employeeDataToUpdate.lastEducationMajor = lastEducationMajor;
		if (lastEducationDegree)
			employeeDataToUpdate.lastEducationDegree = lastEducationDegree;

		// --- FIX for Prisma Relational Update ---
		// Use the `connect` syntax to update a relation.
		if (positionId) {
			employeeDataToUpdate.position = {
				connect: { id: positionId },
			};
		}

		if (Object.keys(employeeDataToUpdate).length === 0) {
			return NextResponse.json(
				{ message: "Tidak ada data untuk diperbarui" },
				{ status: 400 }
			);
		}

		const updatedEmployee = await prisma.$transaction(async (tx) => {
			const result = await tx.employee.update({
				where: { employeeId: employeeId },
				data: employeeDataToUpdate,
			});

			if (positionId && employeeToUpdate.positionId !== positionId) {
				const newPosition = await tx.position.findUnique({
					where: { id: positionId },
				});
				if (newPosition) {
					await tx.careerHistory.create({
						data: {
							employeeId: employeeId,
							position: newPosition.name,
							department: employeeToUpdate.department.name,
							company: "Internal",
							startDate: new Date(),
						},
					});
				}
			}

			return result;
		});

		return NextResponse.json(updatedEmployee);
	} catch (error) {
		console.error(`Error updating employee ${employeeId}:`, error);
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return NextResponse.json(
				{ message: "Gagal memperbarui, data tidak ditemukan" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// DELETE: Menghapus karyawan dengan otorisasi
export async function DELETE(
	req: Request,
	{ params }: { params: { employeeId: string } }
) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { employeeId } = params;

	try {
		const employeeToDelete = await prisma.employee.findUnique({
			where: { employeeId: employeeId },
			select: { employeeId: true, branchId: true },
		});

		if (!employeeToDelete) {
			return NextResponse.json(
				{ message: "Karyawan tidak ditemukan" },
				{ status: 404 }
			);
		}

		// --- FIX for Authorization ---
		const userBranchId = (session.user as { branchId?: string }).branchId;

		const authorized =
			isAuthorized(session.user, {
				allowedRoles: ["ADMIN"],
			}) ||
			(session.user.role === "HR_BRANCH" &&
				userBranchId === employeeToDelete.branchId);

		if (!authorized) {
			return NextResponse.json({ message: "Forbidden" }, { status: 403 });
		}

		await prisma.$transaction([
			prisma.employee.delete({ where: { employeeId: employeeId } }),
			prisma.user.delete({ where: { employeeId: employeeId } }),
		]);

		return NextResponse.json(
			{ message: "Karyawan berhasil dihapus" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(`Error deleting employee ${employeeId}:`, error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
