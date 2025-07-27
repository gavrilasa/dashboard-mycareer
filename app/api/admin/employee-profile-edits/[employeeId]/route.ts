import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import dayjs from "dayjs";
import { auth } from "@/app/lib/auth";
import * as dbAligner from "@/utils/dbAligner";
import { generatePassword } from "@/app/lib/utils/password";
import { Prisma } from "@prisma/client";

export async function PUT(
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
					message: "Anda hanya bisa mengubah data karyawan untuk cabang anda!",
				},
				{ status: 401 }
			);
		}
	}

	// UPDATE
	const DBUpdate_Karyawan = {
		namaKaryawan: data.namaKaryawan,
		tanggalLahir: data.tanggalLahir,
		tanggalMasukKerja: data.tanggalMasukKerja,
		gender: data.gender,
		personnelArea: data.personnelArea,
		personnelSubarea: data.personnelSubarea,
		position: data.position,
		levelPosition: data.levelPosition,
		age:
			(new Date().getTime() - new Date(data.tanggalLahir).getTime()) /
			(1000 * 60 * 60 * 24 * 365.25),
		lengthOfService:
			(new Date().getTime() - new Date(data.tanggalMasukKerja).getTime()) /
			(1000 * 60 * 60 * 24 * 365.25),
		pend: data.pend,
		namaSekolah: data.namaSekolah,
		namaJurusan: data.namaJurusan,

		BestEmployee: data.BestEmployee,

		lastUpdatedAt: new Date(),
	};
	const DBUpdate_User = {
		branch: data.personnelArea,
		dept: data.personnelSubarea,
		name: data.namaKaryawan,
		updatedAt: new Date(),
	};
	// CREATE
	const DBInsert_RiwayatKarir = {
		nomorIndukKaryawan: data.nomorIndukKaryawan,
		personnelArea: data.personnelArea,
		personnelSubarea: data.personnelSubarea,
		position: data.position,
		levelPosition: data.levelPosition,
		status: 1,
		tanggalMulai: new Date(),
		tanggalBerakhir: null,
	};
	try {
		const prevData = await prisma.dataRiwayatKarir.findFirst({
			where: {
				nomorIndukKaryawan: nomorIndukKaryawan,
				status: 1,
			},
		});
		const isRiwayatKarirUpdated =
			prevData &&
			data.personnelArea === prevData.personnelArea &&
			data.personnelSubarea === prevData.personnelSubarea &&
			String(data.position) === String(prevData.position) &&
			data.levelPosition === prevData.levelPosition;
		let result;
		if (!isRiwayatKarirUpdated) {
			result = await prisma.$transaction([
				prisma.dataKaryawan.update({
					where: { nomorIndukKaryawan },
					data: DBUpdate_Karyawan,
				}),
				prisma.user.update({
					where: { nomorIndukKaryawan },
					data: DBUpdate_User,
				}),
				prisma.dataRiwayatKarir.updateMany({
					where: {
						nomorIndukKaryawan: nomorIndukKaryawan,
						status: 1,
					},
					data: {
						status: 0,
						tanggalBerakhir: new Date(),
					},
				}),
				prisma.dataRiwayatKarir.create({
					data: DBInsert_RiwayatKarir,
				}),
			]);
		} else {
			result = await prisma.$transaction([
				prisma.dataKaryawan.update({
					where: { nomorIndukKaryawan },
					data: DBUpdate_Karyawan,
				}),
				prisma.user.update({
					where: { nomorIndukKaryawan },
					data: DBUpdate_User,
				}),
			]);
		}

		return NextResponse.json(
			{
				result: result,
				message: "User berhasil diubah!",
			},
			{ status: 201 }
		);
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			return NextResponse.json(
				{
					error: `Prisma Error with code ${e.code}`,
					message: (e as any).message,
				},
				{ status: 400 }
			);
		} else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
			console.error("Unknown Prisma error:", e.message);
			return NextResponse.json(
				{
					error: `Unknown Prisma error with message : ${e.message}`,
					message: (e as any).message,
				},
				{ status: 500 }
			);
		} else {
			return NextResponse.json(
				{ error: "Internal Server Error", message: (e as any).message },
				{ status: 500 }
			);
		}
	}
}
