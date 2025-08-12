import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "userManagement", action: "read" },
	async (req: NextRequest) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const where: Prisma.UserWhereInput = {};
		if (search) {
			where.OR = [
				{ employeeId: { contains: search, mode: "insensitive" } },
				{ employee: { fullName: { contains: search, mode: "insensitive" } } },
			];
		}

		try {
			const [users, totalItems] = await prisma.$transaction([
				prisma.user.findMany({
					where,
					skip,
					take: limit,
					include: {
						employee: {
							select: {
								fullName: true,
								level: {
									select: {
										name: true,
									},
								},
								branch: {
									select: {
										name: true,
									},
								},
							},
						},
					},
					orderBy: [{ role: "asc" }, { branch: { id: "asc" } }],
				}),
				prisma.user.count({ where }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: users,
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
