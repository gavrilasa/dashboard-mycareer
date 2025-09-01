import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

interface HandlerContext {
	params: { jobVacancyId: string };
}

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { jobVacancyId } = params;

			// --- OPTIMASI 1: Ambil data lowongan dan peminat secara bersamaan ---
			const [vacancy, interests] = await prisma.$transaction([
				prisma.jobVacancy.findUnique({
					where: { id: jobVacancyId },
					select: { jobRoleId: true },
				}),
				prisma.jobInterest.findMany({
					where: { jobVacancyId: jobVacancyId },
					include: {
						employee: {
							select: {
								employeeId: true,
								fullName: true,
								position: { select: { name: true, jobRoleId: true } },
								branch: { select: { name: true } },
								careerPreference: {
									select: { isWillingToRelocate: true },
								},
							},
						},
					},
					orderBy: { createdAt: "desc" },
				}),
			]);

			if (!vacancy) {
				return NextResponse.json(
					{ message: "Lowongan tidak ditemukan." },
					{ status: 404 }
				);
			}

			if (interests.length === 0) {
				return NextResponse.json([]);
			}

			// --- OPTIMASI 2: Query tunggal untuk mengambil semua CareerPath yang relevan ---
			// Ekstraksi jobRoleIds dari data peminat yang sudah diambil
			const interestedEmployeeJobRoleIds = interests
				.map((interest) => interest.employee?.position?.jobRoleId)
				.filter((id): id is string => !!id);

			// Query ini akan sangat cepat karena adanya index pada `fromJobRoleId` dan `toJobRoleId`
			const careerPaths = await prisma.careerPath.findMany({
				where: {
					fromJobRoleId: { in: interestedEmployeeJobRoleIds },
					toJobRoleId: vacancy.jobRoleId,
				},
				select: {
					fromJobRoleId: true,
					pathType: true,
				},
			});

			// Buat map untuk memetakan pathType dengan mudah dan cepat (O(1) lookup)
			const pathTypeMap = new Map(
				careerPaths.map((path) => [path.fromJobRoleId, path.pathType])
			);

			// --- OPTIMASI 3: Proses penggabungan data di memori (sudah efisien) ---
			const interestedEmployees = interests.map((interest) => {
				const employee = interest.employee;
				const employeeJobRoleId = employee?.position?.jobRoleId;
				const pathType = employeeJobRoleId
					? pathTypeMap.get(employeeJobRoleId)
					: null;

				return {
					employeeId: employee?.employeeId,
					fullName: employee?.fullName,
					currentPosition: employee?.position?.name || "-",
					branchName: employee?.branch?.name || "-",
					pathType: pathType || "N/A", // Tampilkan N/A jika path tidak ditemukan
					isWillingToRelocate:
						employee?.careerPreference?.isWillingToRelocate ?? false,
					appliedAt: interest.createdAt,
				};
			});

			return NextResponse.json(interestedEmployees);
		} catch (error) {
			console.error("Error fetching interested employees:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
