import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma, VacancyPeriod } from "@prisma/client";
import { z } from "zod";

const createVacancySchema = z.object({
	title: z.string().min(3, "Judul minimal 3 karakter."),
	description: z.string().optional(),
	requirements: z.string().optional(),
	period: z.enum([VacancyPeriod.SHORT_TERM, VacancyPeriod.LONG_TERM]),
	branchId: z.string().min(1, "Cabang wajib dipilih."),
	departmentId: z.string().min(1, "Departemen wajib dipilih."),
	positionId: z.string().min(1, "Posisi wajib dipilih."),
});

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (req: NextRequest, { whereClause }) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search") || "";
		const skip = (page - 1) * limit;

		const finalWhere: Prisma.JobVacancyWhereInput = { ...whereClause };
		if (search) {
			finalWhere.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ position: { name: { contains: search, mode: "insensitive" } } },
			];
		}

		try {
			const [vacancies, totalItems] = await prisma.$transaction([
				prisma.jobVacancy.findMany({
					where: finalWhere,
					skip,
					take: limit,
					include: {
						branch: { select: { name: true } },
						department: { select: { name: true } },
						position: { select: { name: true } },
						_count: {
							select: { interestedEmployees: true },
						},
					},
					orderBy: { createdAt: "desc" },
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

// POST: Membuat lowongan baru
export const POST = withAuthorization(
	{ resource: "jobVacant", action: "create" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();
			const parsedData = createVacancySchema.parse(body);

			const newVacancy = await prisma.jobVacancy.create({
				data: {
					...parsedData,
					description: parsedData.description ?? "",
					requirements: parsedData.requirements ?? "",
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
