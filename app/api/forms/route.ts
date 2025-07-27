import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
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
		const forms = await prisma.forms.findMany({
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
				AssessmentType: true,
				Responses: false,
			},
			orderBy: {
				titleForm: "asc",
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

export async function POST(req: NextRequest) {
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

	try {
		const rawData = await req.json();
		const { InvolvedLevel, InvolvedDept, idForm, ...data } = rawData;

		const createdForm = await prisma.forms.create({
			data: data,
		});
		console.log("saayayyayayayaaya,", createdForm);

		const IDData = InvolvedDept.map((e: any, index: any) => {
			return {
				idForm: createdForm.idForm,
				idDepartment: e.idDepartment,
			};
		});
		const ID = await prisma.involvedDept.createMany({
			data: IDData,
		});

		const ILData = InvolvedLevel.map((e: any, index: any) => {
			return {
				idForm: createdForm.idForm,
				idLevel: e.idLevel,
			};
		});
		const IL = await prisma.involvedLevel.createMany({
			data: ILData,
		});

		return NextResponse.json(createdForm, { status: 200 });
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
