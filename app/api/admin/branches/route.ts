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

		const whereClause: Prisma.BranchWhereInput = q
			? {
					OR: [
						{ id: { contains: q, mode: "insensitive" } },
						{ name: { contains: q, mode: "insensitive" } },
					],
			  }
			: {};

		// Gunakan transaksi untuk mendapatkan data dan total count secara efisien
		const [data, total] = await prisma.$transaction([
			prisma.branch.findMany({
				where: whereClause,
				skip,
				take: limit,
				orderBy: {
					id: "asc",
				},
			}),
			prisma.branch.count({ where: whereClause }),
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
		console.error("Error fetching branches:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
