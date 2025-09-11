// app/api/admin/job-vacancies/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { Role } from "@prisma/client";

const createVacancySchema = z.object({
	jobRoleId: z.string().min(1, "Job Role wajib dipilih."),
	description: z.string().optional(),
	isPublished: z.boolean().default(false),
});

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (req: NextRequest, { session, whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const status = searchParams.get("status");
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder") || "desc";

		// Inisialisasi finalWhere sebagai objek kosong
		const finalWhere: Prisma.JobVacancyWhereInput = {};

		try {
			// --- Logika Baru: Filter jobRoleId untuk peran terbatas ---
			if (
				session?.user?.role === Role.HR_BRANCH ||
				session?.user?.role === Role.HD
			) {
				// Ambil semua posisi yang relevan dengan branch/department pengguna
				const relevantPositions = await prisma.position.findMany({
					where: whereClause, // Gunakan whereClause HANYA untuk query Position
					select: { jobRoleId: true },
				});

				// Jika tidak ada posisi, berarti tidak ada lowongan yang relevan
				if (relevantPositions.length === 0) {
					return NextResponse.json({
						data: [],
						pagination: {
							totalItems: 0,
							totalPages: 0,
							currentPage: page,
							limit,
						},
					});
				}

				// Dapatkan daftar jobRoleId yang unik
				const relevantJobRoleIds = [
					...new Set(relevantPositions.map((p) => p.jobRoleId)),
				];

				// Terapkan filter ke finalWhere
				finalWhere.jobRoleId = { in: relevantJobRoleIds };
			}

			// --- Gabungkan dengan filter lain ---
			if (search) {
				finalWhere.jobRole = {
					name: { contains: search, mode: "insensitive" },
				};
			}

			if (status === "published") {
				finalWhere.isPublished = true;
			} else if (status === "draft") {
				finalWhere.isPublished = false;
			}

			let orderBy: Prisma.JobVacancyOrderByWithRelationInput = {
				createdAt: "desc",
			};
			if (sortBy === "interestedEmployees") {
				orderBy = {
					interestedEmployees: {
						_count: sortOrder as Prisma.SortOrder,
					},
				};
			}

			const [vacancies, totalItems] = await prisma.$transaction([
				prisma.jobVacancy.findMany({
					where: finalWhere, // Gunakan finalWhere yang sudah benar
					skip,
					take: limit,
					include: {
						jobRole: { select: { name: true } },
						_count: {
							select: { interestedEmployees: true },
						},
					},
					orderBy,
				}),
				prisma.jobVacancy.count({ where: finalWhere }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: vacancies,
				pagination: { totalItems, totalPages, currentPage: page, limit },
			});
		} catch (error) {
			console.error("Error fetching job vacancies:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

export const POST = withAuthorization(
	{ resource: "jobVacant", action: "create" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();
			const parsedData = createVacancySchema.parse(body);

			const newVacancy = await prisma.jobVacancy.create({
				data: {
					jobRoleId: parsedData.jobRoleId,
					description: parsedData.description ?? "",
					isPublished: parsedData.isPublished,
					requirements: "",
				},
			});

			return NextResponse.json(newVacancy, { status: 201 });
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({ errors: error.flatten() }, { status: 400 });
			}
			console.error("Error creating job vacancy:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
