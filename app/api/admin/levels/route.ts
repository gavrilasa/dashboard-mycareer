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
