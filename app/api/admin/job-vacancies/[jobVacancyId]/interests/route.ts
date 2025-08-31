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

			// 1. Dapatkan JobVacancy untuk mengetahui JobRoleId tujuan
			const vacancy = await prisma.jobVacancy.findUnique({
				where: { id: jobVacancyId },
				select: { jobRoleId: true },
			});

			if (!vacancy) {
				return NextResponse.json(
					{ message: "Lowongan tidak ditemukan." },
					{ status: 404 }
				);
			}

			// 2. Dapatkan semua peminat beserta data penting dari employee
			const interests = await prisma.jobInterest.findMany({
				where: {
					jobVacancyId: jobVacancyId,
				},
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
				orderBy: {
					createdAt: "desc",
				},
			});

			if (interests.length === 0) {
				return NextResponse.json([]);
			}

			// 3. Ambil semua JobRole ID dari karyawan yang berminat
			const interestedEmployeeJobRoleIds = interests
				.map((interest) => interest.employee?.position?.jobRoleId)
				.filter((id): id is string => !!id);

			// 4. Cari semua CareerPath yang relevan dalam satu query
			const careerPaths = await prisma.careerPath.findMany({
				where: {
					fromJobRoleId: {
						in: interestedEmployeeJobRoleIds,
					},
					toJobRoleId: vacancy.jobRoleId,
				},
			});

			// Buat map untuk memetakan pathType dengan mudah
			const pathTypeMap = new Map(
				careerPaths.map((path) => [path.fromJobRoleId, path.pathType])
			);

			// 5. Gabungkan dan format data untuk respons
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
					pathType: pathType || "N/A",
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
