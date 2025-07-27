import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/app/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {}

export async function POST(
	req: NextRequest,
	{ params }: { params: { nomorIndukKaryawan: string } }
) {
	const session = await auth();

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Anda belum login" },
			{ status: 401 }
		);
	}
	if (session.user.role !== "hr") {
		return NextResponse.json(
			{
				error: "Forbidden",
				message: "Anda tidak memiliki akses karena bukan seorang HR",
			},
			{ status: 403 }
		);
	}

	if (!req.headers.get("content-type")?.includes("application/json")) {
		return NextResponse.json(
			{ error: "Invalid Content-Type", message: "Gunakan 'application/json'" },
			{ status: 415 }
		);
	}

	const data = await req.json();
	const { nomorIndukKaryawan } = await params;

	if (session.user.branch !== "N001") {
		if (session.user.branch !== String(data.personnelSubarea)) {
			return NextResponse.json(
				{
					error: "Unauthorized",
					message: "Anda hanya bisa menambahkan karyawan untuk cabang anda!",
				},
				{ status: 401 }
			);
		}
	}

	try {
		const DBInput_DataSupervisor = {
			nomorIndukKaryawan: nomorIndukKaryawan as string,
			namaKaryawan: data.namaKaryawan as string,
			personnelArea: data.personnelArea,
			personnelSubarea: data.personnelSubarea,
			position: data.position,
			levelPosition: data.levelPosition,
			tanggalLahir: data.tanggalLahir as Date,
			tanggalMasukKerja: data.tanggalMasukKerja as Date,
			gender: data.gender as string,
			age: dayjs().diff(dayjs(data.tanggalLahir), "year", true),
			lengthOfService: dayjs().diff(
				dayjs(data.tanggalMasukKerja),
				"year",
				true
			),
			tahunPensiun: dayjs(data.tanggalLahir).add(55, "year").toDate(),
		};
		const DBInput_JV = {
			personnelArea: data.personnelArea,
			personnelSubarea: data.personnelSubarea,
			position: data.position,
			levelPosition: data.levelPosition,
			available: dayjs(data.tanggalLahir).add(55, "year").toDate(),
			JobSummary: data.JobSummary,
			JobDescription: data.JobDescription,
			published: 1,
		};

		try {
			const result = await prisma.$transaction([
				prisma.dataSupervisors.create({
					data: DBInput_DataSupervisor,
				}),
				prisma.jobVacancy.create({
					data: DBInput_JV,
				}),
			]);

			return NextResponse.json(
				{
					result: result,
					message: "Data supervisor dan job vacancy berhasil ditambahkan!",
				},
				{ status: 201 }
			);
		} catch (e) {
			console.log("Transaction failed...", e);
			throw e;
		}
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
