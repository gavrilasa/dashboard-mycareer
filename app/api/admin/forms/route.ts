// app/api/admin/forms/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "form", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const branchId = searchParams.get("branchId");
		const departmentId = searchParams.get("departmentId");
		const sortBy = searchParams.get("sortBy") || "fullName";
		const sortOrder = searchParams.get("sortOrder") || "asc";

		const finalWhere: Prisma.EmployeeWhereInput = {
			...whereClause,
			gkmHistory: {
				isNot: null,
			},
		};

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
				{ department: { name: { contains: search, mode: "insensitive" } } },
			];
		}

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
					select: {
						employeeId: true,
						fullName: true,
						branch: { select: { name: true } },
						department: { select: { name: true } },
						position: { select: { name: true } },
					},
					orderBy,
				}),
				prisma.employee.count({ where: finalWhere }),
			]);

			const dataWithStatus = employees.map((emp) => ({
				...emp,
				submissionStatus: "Submitted",
			}));

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: dataWithStatus,
				pagination: {
					totalItems,
					totalPages,
					currentPage: page,
					limit,
				},
			});
		} catch (error) {
			console.error("Error fetching form submissions:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
