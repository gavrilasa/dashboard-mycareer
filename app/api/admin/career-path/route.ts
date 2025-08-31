import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma, PathType, VacancyPeriod } from "@prisma/client";

// FIX: Skema Zod diperbarui untuk menyertakan 'period'
const createCareerPathSchema = z.object({
	fromJobRoleId: z.string().min(1, "Job Role asal tidak valid."),
	toPositions: z
		.array(
			z.object({
				toJobRoleId: z.string().min(1, "Job Role tujuan tidak valid."),
				pathType: z.enum([PathType.ALIGN, PathType.CROSS]),
				period: z.enum([VacancyPeriod.SHORT_TERM, VacancyPeriod.LONG_TERM]),
			})
		)
		.min(1, "Minimal satu posisi tujuan harus ditambahkan."),
});

// GET Handler (tidak ada perubahan)
export const GET = withAuthorization(
	{ resource: "careerPath", action: "read" },
	async (request: NextRequest) => {
		try {
			const { searchParams } = new URL(request.url);
			const page = parseInt(searchParams.get("page") || "1", 10);
			const limit = Math.min(
				parseInt(searchParams.get("limit") || "10", 10),
				100
			);
			const search = searchParams.get("search") || "";
			const skip = (page - 1) * limit;

			const where: Prisma.CareerPathWhereInput = search
				? {
						OR: [
							{
								fromJobRole: {
									name: { contains: search, mode: "insensitive" },
								},
							},
							{
								toJobRole: { name: { contains: search, mode: "insensitive" } },
							},
						],
				  }
				: {};

			const [data, totalRecords] = await prisma.$transaction([
				prisma.careerPath.findMany({
					where,
					skip,
					take: limit,
					orderBy: [
						{ fromJobRole: { name: "asc" } },
						{ toJobRole: { name: "asc" } },
					],
					include: {
						fromJobRole: { select: { id: true, name: true } },
						toJobRole: { select: { id: true, name: true } },
					},
				}),
				prisma.careerPath.count({ where }),
			]);

			const totalPages = Math.ceil(totalRecords / limit);

			return NextResponse.json({
				data,
				pagination: {
					totalRecords,
					totalPages,
					currentPage: page,
				},
			});
		} catch (error) {
			console.error("Error fetching career paths:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan saat mengambil data jenjang karier." },
				{ status: 500 }
			);
		}
	}
);

// POST Handler (diperbarui)
export const POST = withAuthorization(
	{ resource: "careerPath", action: "create" },
	async (request: NextRequest) => {
		try {
			const body = await request.json();
			const parsedData = createCareerPathSchema.parse(body);
			const { fromJobRoleId, toPositions } = parsedData;

			if (toPositions.some((p) => p.toJobRoleId === fromJobRoleId)) {
				return NextResponse.json(
					{
						message:
							"Tidak dapat membuat jenjang karier ke job role yang sama.",
					},
					{ status: 400 }
				);
			}

			// Cek duplikasi dengan mempertimbangkan periode
			const existingPaths = await prisma.careerPath.findMany({
				where: {
					fromJobRoleId,
					OR: toPositions.map((p) => ({
						toJobRoleId: p.toJobRoleId,
						period: p.period,
					})),
				},
			});

			if (existingPaths.length > 0) {
				return NextResponse.json(
					{
						message:
							"Satu atau lebih jenjang karier yang diajukan (dengan periode yang sama) sudah ada.",
					},
					{ status: 409 } // Conflict
				);
			}

			// FIX: Siapkan data untuk createMany dengan menyertakan 'period'
			const dataToCreate = toPositions.map((pos) => ({
				fromJobRoleId,
				toJobRoleId: pos.toJobRoleId,
				pathType: pos.pathType,
				period: pos.period, // <-- Menyimpan period
			}));

			await prisma.careerPath.createMany({
				data: dataToCreate,
			});

			return NextResponse.json(
				{ message: "Jenjang karier berhasil dibuat." },
				{ status: 201 }
			);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json(
					{ message: "Data tidak valid.", errors: error.flatten().fieldErrors },
					{ status: 400 }
				);
			}
			console.error("Error creating career path:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
