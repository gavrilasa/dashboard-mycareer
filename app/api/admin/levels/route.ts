import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: Mengambil semua level
export async function GET() {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const levels = await prisma.level.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return NextResponse.json(levels);
	} catch (error) {
		console.error("Error fetching levels:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// POST: Membuat level baru
export async function POST(request: Request) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { name } = body;

		if (!name) {
			return NextResponse.json(
				{ message: "Level name is required" },
				{ status: 400 }
			);
		}

		const newLevel = await prisma.level.create({
			data: {
				name,
			},
		});

		return NextResponse.json(newLevel, { status: 201 });
	} catch (error) {
		console.error("Error creating level:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
