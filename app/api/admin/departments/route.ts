import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/app/lib/auth";

export async function GET(req: Request) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const q = searchParams.get("q") || "";

		const skip = (page - 1) * limit;

		const whereClause: Prisma.DepartmentWhereInput = q
			? {
					OR: [
						{ id: { contains: q, mode: "insensitive" } },
						{ name: { contains: q, mode: "insensitive" } },
						{ branch: { name: { contains: q, mode: "insensitive" } } },
					],
			  }
			: {};

		const [data, total] = await prisma.$transaction([
			prisma.department.findMany({
				where: whereClause,
				skip,
				take: limit,
				include: {
					branch: true, // Sertakan data cabang
				},
				orderBy: {
					id: "asc",
				},
			}),
			prisma.department.count({ where: whereClause }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data,
			pagination: {
				totalItems: total,
				totalPages,
			},
		});
	} catch (error) {
		console.error("Error fetching departments:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
