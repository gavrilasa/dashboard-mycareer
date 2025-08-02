import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const [branches, departments, positions, levels] = await Promise.all([
			prisma.branch.findMany({ orderBy: { name: "asc" } }),
			prisma.department.findMany({ orderBy: { name: "asc" } }),
			prisma.position.findMany({ orderBy: { name: "asc" } }),
			prisma.level.findMany({ orderBy: { name: "asc" } }),
		]);

		return NextResponse.json({
			branches,
			departments,
			positions,
			levels,
		});
	} catch (error) {
		console.error("Error fetching master data:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
