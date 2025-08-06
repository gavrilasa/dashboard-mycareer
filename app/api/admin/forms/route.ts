// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/app/api/admin/forms/route.ts
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

		const finalWhere: Prisma.EmployeeWhereInput = {
			...whereClause,
			gkmHistory: {
				isNot: null,
			},
		};

		if (search) {
			finalWhere.OR = [
				{ fullName: { contains: search, mode: "insensitive" } },
				{ employeeId: { contains: search, mode: "insensitive" } },
			];
		}

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
					orderBy: [{ branch: { id: "asc" } }, { fullName: "asc" }],
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
