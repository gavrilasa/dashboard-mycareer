import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

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

		const whereClause: Prisma.PositionWhereInput = q
			? {
					OR: [
						{ id: { contains: q, mode: "insensitive" } },
						{ name: { contains: q, mode: "insensitive" } },
						{ branch: { name: { contains: q, mode: "insensitive" } } },
						{ department: { name: { contains: q, mode: "insensitive" } } },
						{ level: { name: { contains: q, mode: "insensitive" } } },
					],
			  }
			: {};

		const [data, total] = await prisma.$transaction([
			prisma.position.findMany({
				where: whereClause,
				skip,
				take: limit,
				include: {
					branch: true,
					department: true,
					level: true,
				},
				orderBy: [{ branch: { id: "asc" } }, { level: { id: "asc" } }],
			}),
			prisma.position.count({ where: whereClause }),
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
		console.error("Error fetching positions:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// POST: Membuat posisi baru
export async function POST(request: Request) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { name, branchId, departmentId, levelId } = body;

		if (!name || !branchId || !departmentId || !levelId) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
		const newPositionId = `${branchId}-${sanitizedName}-${Date.now()}`;

		const newPosition = await prisma.position.create({
			data: {
				id: newPositionId,
				name,
				branch: {
					connect: { id: branchId },
				},
				department: {
					connect: { id: departmentId },
				},
				level: {
					connect: { id: levelId },
				},
			},
		});

		return NextResponse.json(newPosition, { status: 201 });
	} catch (error) {
		console.error("Error creating position:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
