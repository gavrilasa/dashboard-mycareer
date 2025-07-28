import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Handler untuk mengambil daftar semua karyawan dengan optimasi (pagination, filter, select).
 * Endpoint ini dirancang untuk diakses oleh HR atau HD.
 * * Query Params:
 * - page: Nomor halaman (default: 1)
 * - limit: Jumlah data per halaman (default: 20)
 * - search: Teks untuk mencari berdasarkan nama karyawan
 * - branchId: Filter berdasarkan ID cabang
 * - departmentId: Filter berdasarkan ID departemen
 */
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const search = searchParams.get("search");
		const branchId = searchParams.get("branchId");
		const departmentId = searchParams.get("departmentId");

		// Hitung nilai 'skip' untuk pagination
		const skip = (page - 1) * limit;

		// Bangun kondisi 'where' secara dinamis berdasarkan filter
		const whereClause: Prisma.EmployeeWhereInput = {};
		if (search) {
			whereClause.name = {
				contains: search,
				mode: "insensitive", // Pencarian case-insensitive
			};
		}
		if (branchId) {
			whereClause.personnelAreaId = branchId;
		}
		if (departmentId) {
			whereClause.departmentId = departmentId;
		}

		// Lakukan dua query secara bersamaan untuk efisiensi:
		// 1. Mengambil total data yang cocok dengan filter
		// 2. Mengambil data karyawan yang sudah dipaginasi
		const [totalRecords, employees] = await prisma.$transaction([
			prisma.employee.count({ where: whereClause }),
			prisma.employee.findMany({
				where: whereClause,
				// Optimasi: Hanya pilih kolom yang dibutuhkan untuk tampilan daftar
				select: {
					employeeId: true,
					name: true,
					position: {
						select: { name: true },
					},
					department: {
						select: { name: true },
					},
					branch: {
						select: { name: true },
					},
				},
				skip: skip,
				take: limit,
				orderBy: {
					name: "asc", // Urutkan berdasarkan nama
				},
			}),
		]);

		// Hitung total halaman
		const totalPages = Math.ceil(totalRecords / limit);

		// Kembalikan respons dengan data dan metadata pagination
		return NextResponse.json({
			data: employees,
			meta: {
				totalRecords,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching employees:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
