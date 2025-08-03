import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "branch", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const finalWhere: Prisma.BranchWhereInput = {
			...whereClause,
		};

		if (search) {
			finalWhere.name = { contains: search, mode: "insensitive" };
		}

		try {
			const [branches, totalItems] = await prisma.$transaction([
				prisma.branch.findMany({
					where: finalWhere,
					skip,
					take: limit,
					orderBy: { id: "asc" },
				}),
				prisma.branch.count({ where: finalWhere }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: branches,
				pagination: {
					totalItems,
					totalPages,
					currentPage: page,
					limit,
				},
			});
		} catch (error) {
			console.error("Error fetching branches:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
