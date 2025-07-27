import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { idAT: string } }
) {
	const session = await auth();
	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Mohon login terlebih dahulu" },
			{ status: 401 }
		);
	}
	if (session.user.role !== "hr") {
		return NextResponse.json(
			{ error: "Forbidden", message: "Anda bukanlah seorang HR" },
			{ status: 403 }
		);
	}
	if (!req.headers.get("content-type")?.includes("application/json")) {
		return NextResponse.json(
			{ error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
			{ status: 415 }
		);
	}

	const { idAT } = await params;

	try {
		const data = await req.json();
		const { titleAT, descAT, typeAT } = data;

		const updatedAssessmentType = await prisma.assessmentType.update({
			where: { idAssessmentType: idAT },
			data: {
				titleAT: titleAT,
				descAT: descAT,
				typeAT: typeAT,
			},
		});

		return NextResponse.json(updatedAssessmentType, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", message: (error as any).message },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { idAssessmentType: string } }
) {
	const session = await auth();
	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Mohon login terlebih dahulu" },
			{ status: 401 }
		);
	}
	if (session.user.role !== "hr") {
		return NextResponse.json(
			{ error: "Forbidden", message: "Anda bukanlah seorang HR" },
			{ status: 403 }
		);
	}

	const { idAssessmentType } = params;

	try {
		const deletedAssessmentType = await prisma.assessmentType.delete({
			where: { idAssessmentType },
		});

		return NextResponse.json(deletedAssessmentType, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", message: (error as any).message },
			{ status: 500 }
		);
	}
}
