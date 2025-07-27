import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET() {
	const session = await auth();
	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const emp = session.user.role === "employee" ? 1 : undefined;

	try {
		let data;
		data = await prisma.jobVacancy.findMany({
			where: {
				published: emp,
			},
			include: {
				DataPosition: {
					include: {
						DataDepartment: true,
					},
				},
				DataLevel: true,
				DataBranch: true,
			},
		});

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: `Prisma Error with code ${error.code}`,
					message: (error as any).message,
				},
				{ status: 400 }
			);
		} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			console.error("Unknown Prisma error:", error.message);
			return NextResponse.json(
				{
					error: `Unknown Prisma error with message : ${error.message}`,
					message: (error as any).message,
				},
				{ status: 500 }
			);
		} else {
			return NextResponse.json(
				{ error: "Internal Server Error", message: (error as any).message },
				{ status: 500 }
			);
		}
	}
}
