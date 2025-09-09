// app/api/admin/dashboard/relocation-summary/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// Definisikan tipe untuk struktur data yang akan dikembalikan
interface RelocationData {
	name: string;
	value: number;
}

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest) => {
		try {
			// 1. Dapatkan total semua karyawan
			const totalEmployees = await prisma.employee.count();

			// 2. Dapatkan data agregat dari mereka yang sudah mengisi preferensi
			const relocationCounts = await prisma.careerPreference.groupBy({
				by: ["isWillingToRelocate"],
				_count: {
					employeeId: true,
				},
				// Pastikan hanya menghitung nilai boolean, bukan null
				where: {
					isWillingToRelocate: {
						not: null,
					},
				},
			});

			let willingCount = 0;
			let notWillingCount = 0;

			relocationCounts.forEach((group) => {
				if (group.isWillingToRelocate === true) {
					willingCount = group._count.employeeId;
				} else if (group.isWillingToRelocate === false) {
					notWillingCount = group._count.employeeId;
				}
			});

			// 3. Hitung jumlah karyawan yang belum mengisi
			const notFilledCount = totalEmployees - (willingCount + notWillingCount);

			// 4. Format data untuk dikirim ke frontend
			const summaryData: RelocationData[] = [
				{ name: "Ya, Bersedia", value: willingCount },
				{ name: "Tidak Bersedia", value: notWillingCount },
				{ name: "Belum Mengisi", value: notFilledCount },
			];

			return NextResponse.json(summaryData);
		} catch (error) {
			console.error("Error fetching relocation summary data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
