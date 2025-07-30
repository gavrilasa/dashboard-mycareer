import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
	try {
		const positions = await prisma.position.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return NextResponse.json(positions);
	} catch (error) {
		console.error("Error fetching positions:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
