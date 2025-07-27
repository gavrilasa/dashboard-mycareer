import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(
	req: NextRequest,
	{ params }: { params: { idForm: string } }
) {
	const session = await auth();

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Mohon login terlebih dahulu" },
			{ status: 401 }
		);
	}

	if (session.user.role !== "hr" && session.user.branch !== "N001") {
		return NextResponse.json(
			{
				error: "Forbidden",
				message:
					"Anda bukanlah seorang HR dari Head Office. Data ini tidak bisa anda akses.",
			},
			{ status: 403 }
		);
	}

	try {
		const { idForm } = await params;
		const forms = await prisma.forms.findUnique({
			where: { idForm },
			include: {
				InvolvedDept: {
					include: {
						DataDepartment: true,
					},
				},
				InvolvedLevel: {
					include: {
						DataLevel: true,
					},
				},
				AssessmentType: {
					include: {
						InvolvedPosition: {
							include: {
								DataPosition: true,
							},
						},
						Questions: true,
					},
				},
				Responses: false,
			},
		});

		return NextResponse.json(forms, { status: 200 });
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

export async function PUT(
	req: NextRequest,
	{ params }: { params: { idForm: string } }
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
	const { idForm } = await params;

	try {
		const data = await req.json();
		const { titleForm, descForm } = data;

		const updatedForm = await prisma.forms.update({
			where: { idForm },
			data: {
				titleForm,
				descForm,
			},
		});

		return NextResponse.json(updatedForm, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error", message: (error as any).message },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { idForm: string } }
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
	const { idForm } = params;

	try {
		const deletedForm = await prisma.forms.delete({
			where: { idForm },
		});

		return NextResponse.json(deletedForm, { status: 200 });
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
