// app/api/admin/employees/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { format } from "date-fns";

export const GET = withAuthorization(
	{ resource: "employee", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		// --- Filter & Sort Parameters ---
		const branchId = searchParams.get("branchId");
		const departmentId = searchParams.get("departmentId");
		const sortBy = searchParams.get("sortBy") || "fullName";
		const sortOrder = searchParams.get("sortOrder") || "asc";

		const finalWhere: Prisma.EmployeeWhereInput = { ...whereClause };

		// --- Dynamic Filtering Logic ---
		if (branchId) {
			finalWhere.branchId = branchId;
		}
		if (departmentId) {
			finalWhere.departmentId = departmentId;
		}
		if (search) {
			finalWhere.OR = [
				{ fullName: { contains: search, mode: "insensitive" } },
				{ employeeId: { contains: search, mode: "insensitive" } },
				{ position: { name: { contains: search, mode: "insensitive" } } },
				{ department: { name: { contains: search, mode: "insensitive" } } },
			];
		}

		// --- Dynamic Sorting Logic ---
		const orderBy: Prisma.EmployeeOrderByWithRelationInput =
			sortBy === "employeeId"
				? { employeeId: sortOrder as Prisma.SortOrder }
				: { fullName: sortOrder as Prisma.SortOrder };

		try {
			const [employees, totalItems] = await prisma.$transaction([
				prisma.employee.findMany({
					where: finalWhere,
					skip,
					take: limit,
					include: {
						branch: { select: { name: true } },
						department: { select: { name: true } },
						position: { select: { name: true } },
					},
					orderBy,
				}),
				prisma.employee.count({ where: finalWhere }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: employees,
				pagination: { totalItems, totalPages, currentPage: page, limit },
			});
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);

export const POST = withAuthorization(
	{ resource: "employee", action: "create" },
	async (req, { session }) => {
		try {
			const body = await req.json();
			let { branchId } = body;
			const {
				departmentId,
				positionId,
				levelId,
				employeeId,
				fullName,
				gender,
				dateOfBirth,
				hireDate,
				lastEducationDegree,
				lastEducationSchool,
				lastEducationMajor,
				role = "EMPLOYEE",
			} = body;

			if (!employeeId || !dateOfBirth || !gender || !lastEducationDegree) {
				return NextResponse.json(
					{ message: "Data wajib tidak lengkap." },
					{ status: 400 }
				);
			}

			const dobFormatted = format(new Date(dateOfBirth), "ddMMyyyy");
			const autoPassword = `${employeeId}${dobFormatted}`;
			const hashedPassword = await bcrypt.hash(autoPassword, 10);

			if (session?.user?.role === "HR_BRANCH") {
				branchId = session.user.branchId;
			}

			const newUser = await prisma.user.create({
				data: {
					employeeId,
					password: hashedPassword,
					role,
					branchId,
					departmentId,
					employee: {
						create: {
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
						},
					},
				},
				include: {
					employee: true,
				},
			});

			await prisma.activityLog.create({
				data: {
					type: "NEW_EMPLOYEE",
					description: `Karyawan baru "${fullName}" telah ditambahkan.`,
					employeeId: employeeId,
				},
			});

			return NextResponse.json(newUser.employee, { status: 201 });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				return NextResponse.json(
					{ message: "ID Karyawan sudah digunakan." },
					{ status: 409 }
				);
			}
			console.error("Error creating employee:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
