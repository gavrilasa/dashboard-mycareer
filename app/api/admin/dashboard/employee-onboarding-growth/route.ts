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
	const personnelArea = searchParams.get("personnelArea");
	const personnelSubarea = searchParams.get("personnelSubarea");
	const levelPosition = searchParams.get("levelPosition");
	const detail = searchParams.get("detail") === "1" ? true : false;
	try {
		let area = undefined;
		let subarea = undefined;
		let level = undefined;

		if (session.user.role === "hr" && session.user.branch === "N001") {
			area = personnelArea || undefined;
			subarea = personnelSubarea || undefined;
			level = levelPosition || undefined;
		} else if (session.user.role === "hr") {
			area = session.user.branch;
			subarea = personnelSubarea || undefined;
			level = levelPosition || undefined;
		} else if (session.user.role === "hd") {
			area = session.user.branch;
			subarea = session.user.dept;
			level = levelPosition || undefined;
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

		const result = await prisma.$queryRaw<
			{ name: string; value: number }[]
		>(Prisma.sql`
                SELECT 
                    ${Prisma.raw(
											detail
												? `CONCAT(YEAR(tanggalMasukKerja), '-', RIGHT('0' + CAST(MONTH(tanggalMasukKerja) AS VARCHAR(2)), 2))`
												: `YEAR(tanggalMasukKerja)`
										)} AS name,
                    COUNT(*) as value
                FROM DataKaryawan as emp
                WHERE tanggalMasukKerja IS NOT NULL
                    AND (${area} IS NULL OR emp.personnelArea = ${area})
                    AND (${subarea} IS NULL OR emp.personnelSubarea = ${subarea})
                    AND (${level} IS NULL OR emp.levelPosition = ${level})
                GROUP BY ${Prisma.raw(
									detail
										? `YEAR(tanggalMasukKerja), MONTH(tanggalMasukKerja)`
										: `YEAR(tanggalMasukKerja)`
								)}
                ORDER BY value;
            `);
		return NextResponse.json(
			{
				data: result,
			},
			{ status: 200 }
		);
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
