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
	if (session.user.role === "employee") {
		return NextResponse.json(
			{ error: "Forbidden", message: "Anda bukanlah seorang HR" },
			{ status: 403 }
		);
	}

	const { searchParams } = new URL(req.url);
	const personnelArea =
		(searchParams.get("personnelArea") as string) ?? "Semua Cabang";
	const personnelSubarea =
		(searchParams.get("personnelSubarea") as string) ?? "Semua Department";
	const levelPosition =
		(searchParams.get("levelPosition") as string) ?? "Semua Level";
	try {
		let dataReturned = 0;

		let area = undefined;
		let subarea = undefined;
		let level = undefined;

		if (session.user.role === "hr" && session.user.branch === "N001") {
			area = personnelArea || undefined;
			subarea = personnelSubarea || undefined;
			level = levelPosition;
		} else if (session.user.role === "hr") {
			area = session.user.branch;
			subarea = personnelSubarea || undefined;
			level = levelPosition;
		} else if (session.user.role === "hd") {
			area = session.user.branch;
			subarea = session.user.dept;
			level = levelPosition;
		}

		if (personnelArea === "Semua Cabang") {
			area = undefined;
		}
		if (personnelSubarea === "Semua Department") {
			subarea = undefined;
		}
		if (levelPosition === "Semua Level") {
			level = undefined;
		}

		const countData = async () => {
			return await prisma.dataKaryawan.count({
				where: {
					personnelArea: area,
					personnelSubarea: subarea,
					levelPosition: level,
				},
			});
		};
		const sumData = async () => {
			return await prisma.dataKaryawan.aggregate({
				_sum: {
					BestEmployee: true,
				},
				where: {
					personnelArea: area,
					personnelSubarea: subarea,
					levelPosition: level,
					BestEmployee: {
						not: null,
					},
				},
			});
		};
		const sumResult = await sumData();
		const sumBE = sumResult._sum.BestEmployee ?? 0;
		const countResult = await countData();
		const count = countResult;

		dataReturned = count !== 0 ? parseFloat((sumBE / count).toFixed(2)) : 0;

		return NextResponse.json({ data: dataReturned }, { status: 200 });
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2002":
					return NextResponse.json(
						{
							error: "Duplikat Data",
							message: `Kolom '${(error.meta?.target as string[]).join(
								", "
							)}' harus unik, namun nilai tersebut sudah ada di database.`,
						},
						{ status: 409 }
					);

				case "P2003":
					return NextResponse.json(
						{
							error: "Referensi Tidak Valid",
							message: `Data yang coba ditautkan (foreign key) tidak ditemukan. Periksa apakah ID atau relasi terkait benar.`,
						},
						{ status: 400 }
					);

				case "P2000":
					return NextResponse.json(
						{
							error: "Input Terlalu Panjang",
							message: `Nilai yang dikirim terlalu panjang untuk kolom '${error.meta?.column_name}'. Potong input atau periksa batas maksimal.`,
						},
						{ status: 400 }
					);

				case "P2025":
					return NextResponse.json(
						{
							error: "Data Tidak Ditemukan",
							message: `Data yang ingin diubah atau dihapus tidak ditemukan. Mungkin sudah dihapus atau ID-nya salah.`,
						},
						{ status: 404 }
					);

				case "P2014":
					return NextResponse.json(
						{
							error: "Relasi Tidak Lengkap",
							message: `Operasi gagal karena record yang berkaitan tidak ada. Pastikan data relasi dibuat terlebih dahulu.`,
						},
						{ status: 400 }
					);

				default:
					return NextResponse.json(
						{
							error: `Prisma Error (${error.code})`,
							message: error.message,
						},
						{ status: 400 }
					);
			}
		} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			console.error("Unknown Prisma error:", error.message);
			return NextResponse.json(
				{
					error: `Unknown Prisma error`,
					message: "Terjadi error dari ORM Prisma",
				},
				{ status: 500 }
			);
		} else {
			return NextResponse.json(
				{
					error: "Internal Server Error",
					message: "Terjadi error pada database/server",
				},
				{ status: 500 }
			);
		}
	}
}
