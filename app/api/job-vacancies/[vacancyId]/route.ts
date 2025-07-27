import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

export async function PUT(
	request: Request,
	{ params }: { params: { idJV: string } }
) {
	const session = await auth();

	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const idJV = params.idJV;
	const body = await request.json();

	const {
		personnelArea,
		personnelSubarea,
		position,
		levelPosition,
		available,
		JobSummary,
		JobDescription,
		published,
	} = body;

	try {
		const updated = await prisma.jobVacancy.update({
			where: { idJV },
			data: {
				personnelArea,
				personnelSubarea,
				position,
				levelPosition,
				available: new Date(available),
				JobSummary,
				JobDescription,
				published,
			},
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("Update JobVacancy error:", error);
		return NextResponse.json(
			{ error: "Failed to update JobVacancy", message: (error as any).message },
			{ status: 500 }
		);
	}
}
