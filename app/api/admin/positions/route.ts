import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

// The GET handler is already correct and requires no changes.
export const GET = withAuthorization(
	{ resource: "position", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const finalWhere: Prisma.PositionWhereInput = { ...whereClause };
		if (search) {
			finalWhere.name = { contains: search, mode: "insensitive" };
		}

		try {
			const [positions, totalItems] = await prisma.$transaction([
				prisma.position.findMany({
					where: finalWhere,
					skip,
					take: limit,
					include: {
						branch: { select: { name: true } },
						department: { select: { name: true } },
						level: { select: { name: true } },
					},
					orderBy: [
						{ branch: { id: "asc" } },
						{ level: { id: "asc" } },
						{ name: "asc" },
					],
				}),
				prisma.position.count({ where: finalWhere }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: positions,
				pagination: { totalItems, totalPages, currentPage: page, limit },
			});
		} catch {
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);

// POST: Membuat posisi baru dengan ID yang dibuat secara manual
export const POST = withAuthorization(
	{ resource: "position", action: "create" },
	async (req, { session }) => {
		try {
			const body = await req.json();
			// FIX: Use 'const' for variables that are not reassigned.
			let { branchId } = body;
			const { departmentId, name, levelId } = body;

			if (!name || !branchId || !departmentId || !levelId) {
				return NextResponse.json(
					{ message: "Nama, cabang, departemen, dan level diperlukan" },
					{ status: 400 }
				);
			}

			if (session?.user?.role === "HR_BRANCH") {
				branchId = session.user.branchId;
			}

			const sanitizedName = name.replace(/\s+/g, "-").toLowerCase();
			const uniqueId = `${branchId}-${departmentId}-${sanitizedName}-${Date.now()}`;

			const newPosition = await prisma.position.create({
				data: {
					id: uniqueId,
					name,
					branchId,
					departmentId,
					levelId,
				},
			});

			return NextResponse.json(newPosition, { status: 201 });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				return NextResponse.json(
					{
						message:
							"Posisi dengan nama ini sudah ada di departemen yang sama.",
					},
					{ status: 409 }
				);
			}
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
