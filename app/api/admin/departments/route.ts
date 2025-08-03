import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "department", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const finalWhere: Prisma.DepartmentWhereInput = {
			...whereClause,
		};

		if (search) {
			finalWhere.name = { contains: search, mode: "insensitive" };
		}

		try {
			const [departments, totalItems] = await prisma.$transaction([
				prisma.department.findMany({
					where: finalWhere,
					skip,
					take: limit,
					include: {
						branch: { select: { name: true } }, // Sertakan nama cabang
					},
					orderBy: [{ branch: { id: "asc" } }, { name: "asc" }],
				}),
				prisma.department.count({ where: finalWhere }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: departments,
				pagination: {
					totalItems,
					totalPages,
					currentPage: page,
					limit,
				},
			});
		} catch (error) {
			console.error("Error fetching departments:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
