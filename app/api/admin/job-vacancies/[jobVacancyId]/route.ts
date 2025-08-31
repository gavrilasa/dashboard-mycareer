import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

// Skema untuk memperbarui, semua field bersifat opsional
const updateVacancySchema = z.object({
	jobRoleId: z.string().min(1, "Job Role wajib dipilih.").optional(),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
});

interface HandlerContext {
	params: { jobVacancyId: string };
}

// GET: Mengambil satu lowongan beserta JobRole terkait
export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		const { jobVacancyId } = params;
		try {
			const vacancy = await prisma.jobVacancy.findUnique({
				where: { id: jobVacancyId },
				// Pastikan untuk menyertakan relasi jobRole
				include: {
					jobRole: {
						select: {
							name: true,
						},
					},
				},
			});

			if (!vacancy) {
				return NextResponse.json(
					{ message: "Lowongan tidak ditemukan." },
					{ status: 404 }
				);
			}
			return NextResponse.json(vacancy);
		} catch (error) {
			console.error(`Error fetching vacancy ${jobVacancyId}:`, error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

// PUT: Memperbarui lowongan
export const PUT = withAuthorization(
	{ resource: "jobVacant", action: "update" },
	async (req: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { jobVacancyId } = params;
			const body = await req.json();
			const parsedData = updateVacancySchema.parse(body);

			const updatedVacancy = await prisma.jobVacancy.update({
				where: { id: jobVacancyId },
				data: {
					...parsedData,
					description: parsedData.description ?? "",
				},
			});
			return NextResponse.json(updatedVacancy);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({ errors: error.flatten() }, { status: 400 });
			}
			console.error("Error updating job vacancy:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

// DELETE: Menghapus lowongan
export const DELETE = withAuthorization(
	{ resource: "jobVacant", action: "delete" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { jobVacancyId } = params;
			await prisma.jobVacancy.delete({
				where: { id: jobVacancyId },
			});
			return new NextResponse(null, { status: 204 });
		} catch (error) {
			console.error("Error deleting job vacancy:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
