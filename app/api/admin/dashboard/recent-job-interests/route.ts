// /app/api/admin/dashboard/recent-job-interests/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

export const GET = withAuthorization(
	{ resource: "dashboard", action: "readHdInterests" },
	async (req: NextRequest, { session }) => {
		try {
			const departmentId = session?.user?.departmentId;

			// 1. Ambil departmentId dari sesi dan pastikan ada
			if (!departmentId) {
				return NextResponse.json(
					{
						message:
							"Department ID tidak ditemukan di sesi Anda. Anda mungkin tidak memiliki akses sebagai HD.",
					},
					{ status: 403 } // Forbidden
				);
			}

			// 2. Lakukan query ke database
			const recentInterests = await prisma.jobInterest.findMany({
				// 3. Filter berdasarkan departmentId dari karyawan
				where: {
					employee: {
						departmentId: departmentId,
					},
				},
				// 4. Urutkan berdasarkan tanggal terbaru
				orderBy: {
					createdAt: "desc",
				},
				// 5. Batasi hanya 10 hasil
				take: 10,
				// 6. Sertakan data yang dibutuhkan
				include: {
					employee: {
						select: {
							employeeId: true,
							fullName: true,
							position: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			});

			// 7. Format data sesuai kebutuhan frontend
			const formattedData = recentInterests.map((interest) => ({
				employeeId: interest.employee.employeeId,
				employeeName: interest.employee.fullName,
				currentPosition:
					interest.employee.position?.name || "Posisi tidak diketahui",
			}));

			return NextResponse.json(formattedData);
		} catch (error) {
			console.error("Gagal mengambil data minat pekerjaan terbaru:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
