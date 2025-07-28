import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
	try {
		const departments = await prisma.department.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return NextResponse.json(departments);
	} catch (error) {
		console.error("Error fetching departments:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
