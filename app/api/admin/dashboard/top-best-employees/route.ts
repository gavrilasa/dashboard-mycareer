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

	let area: string | undefined;
	let subarea: string | undefined;

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
		const dept = await prisma.dataDepartment.findMany();
		const result = await prisma.dataKaryawan.findMany({
			where: {
				personnelArea: area,
				personnelSubarea: subarea,
			},
			orderBy: { BestEmployee: "desc" },
			include: {
				DataBranch: {
					select: {
						namaBranch: true,
					},
				},
				DataPosition: {
					select: {
						namaPosition: true,
					},
				},
				DataLevel: {
					select: {
						namaLevel: true,
					},
				},
			},
			take: 10,
		});

		const res = result.map((emp: any) => {
			return {
				...emp,
				personnelArea: emp.DataBranch.namaBranch,
				position: emp.DataPosition.namaPosition,
				level: emp.DataLevel.namaLevel,
				personnelSubarea: dept.find(
					(e: any) => e.idDepartment === emp.personnelSubarea
				)?.namaDepartment,
			};
		});

		return NextResponse.json({ data: res }, { status: 200 });
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
