import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { auth } from "@/app/lib/auth";
import path from "path";
import { writeFile } from "fs/promises";
import xlsx from "xlsx";
import { convertDate } from "@/utils/typeConvertion";
import * as dbAligner from "@/utils/dbAligner";
import { generatePassword } from "@/app/lib/utils/password";
import { nikGenerate } from "@/utils/hrhdFunction";

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
	const nomorIndukKaryawan = data.nomorIndukKaryawan;

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
		const DBInput_User = {
			nomorIndukKaryawan: nikGenerate(String(nomorIndukKaryawan)),
			password: generatePassword(
				String(data.nomorIndukKaryawan),
				data.tanggalLahir.split("T")[0]
			),
			role: data.role,
			branch: data.personnelArea,
			dept: data.personnelSubarea,
			name: data.namaKaryawan as string,
			createdAt: new Date(),
		};

		try {
			const result = await prisma.$transaction([
				prisma.user.create({
					data: DBInput_User,
				}),
			]);

			return NextResponse.json(
				{
					result: result,
					message: "User berhasil ditambahkan!",
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
