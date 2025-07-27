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
	const cdi = searchParams.get("careerDev");
	const rw = searchParams.get("rotationWill");
	const cdw = searchParams.get("crossDeptWill");
	if (cdi === null && rw === null && cdw === null) {
		return NextResponse.json(
			{ error: "Bad Request", message: "Parameter pilihan group tidak valid" },
			{ status: 400 }
		);
	}

	let area: string | undefined;
	let subarea: string | undefined;
	let cdiRes;
	let rwRes;
	let cdwRes;

	// Role-based filtering
	if (session.user.role === "hr" && session.user.branch === "N001") {
		area = personnelArea || undefined;
		subarea = personnelSubarea || undefined;
	} else if (session.user.role === "hr") {
		area = session.user.branch;
		subarea = personnelSubarea || undefined;
	} else if (session.user.role === "hd") {
		area = session.user.branch;
		subarea = session.user.dept;
	}

	try {
		if (cdi !== null) {
			cdiRes = await prisma.$queryRaw<
				{ value: string; total: number }[]
			>(Prisma.sql`
            SELECT 
                CASE 
                WHEN cc.${Prisma.sql([cdi])} = 1 THEN 'Bersedia'
                WHEN cc.${Prisma.sql([cdi])} = 0 THEN 'Tidak bersedia'
                ELSE 'Tidak/Belum mengisi'
                END AS value,
                COUNT(*) AS total
            FROM DataKaryawan emp
            JOIN EmpCareerChoice cc ON cc.nomorIndukKaryawan = emp.nomorIndukKaryawan
            WHERE (${area} IS NULL OR emp.personnelArea = ${area})
                AND (${subarea} IS NULL OR emp.personnelSubarea = ${subarea})
            GROUP BY cc.${Prisma.sql([cdi])}
            `);
		}
		if (rw !== null) {
			rwRes = await prisma.$queryRaw<
				{ value: string; total: number }[]
			>(Prisma.sql`
            SELECT 
                CASE 
                WHEN cc.${Prisma.sql([rw])} = 1 THEN 'Bersedia'
                WHEN cc.${Prisma.sql([rw])} = 0 THEN 'Tidak bersedia'
                ELSE 'Tidak/Belum mengisi'
                END AS value,
                COUNT(*) AS total
            FROM DataKaryawan emp
            JOIN EmpCareerChoice cc ON cc.nomorIndukKaryawan = emp.nomorIndukKaryawan
            WHERE (${area} IS NULL OR emp.personnelArea = ${area})
                AND (${subarea} IS NULL OR emp.personnelSubarea = ${subarea})
            GROUP BY cc.${Prisma.sql([rw])}
            `);
		}
		if (cdw !== null) {
			cdwRes = await prisma.$queryRaw<
				{ value: string; total: number }[]
			>(Prisma.sql`
            SELECT 
                CASE 
                WHEN cc.${Prisma.sql([cdw])} = 1 THEN 'Bersedia'
                WHEN cc.${Prisma.sql([cdw])} = 0 THEN 'Tidak bersedia'
                ELSE 'Tidak/Belum mengisi'
                END AS value,
                COUNT(*) AS total
            FROM DataKaryawan emp
            JOIN EmpCareerChoice cc ON cc.nomorIndukKaryawan = emp.nomorIndukKaryawan
            WHERE (${area} IS NULL OR emp.personnelArea = ${area})
                AND (${subarea} IS NULL OR emp.personnelSubarea = ${subarea})
            GROUP BY cc.${Prisma.sql([cdw])}
            `);
		}

		return NextResponse.json(
			{
				data: {
					crossDevWill: cdiRes,
					rotationWill: rwRes,
					crossDeptWill: cdwRes,
				},
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
