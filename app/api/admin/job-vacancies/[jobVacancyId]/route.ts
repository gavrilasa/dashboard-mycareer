import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
import { VacancyPeriod } from "@prisma/client";

// Skema untuk memperbarui, semua field bersifat opsional
const updateVacancySchema = z.object({
	title: z.string().min(3, "Judul minimal 3 karakter.").optional(),
	description: z.string().optional(),
	requirements: z.string().optional(),
	period: z
		.enum([VacancyPeriod.SHORT_TERM, VacancyPeriod.LONG_TERM])
		.optional(),
	branchId: z.string().min(1, "Cabang wajib dipilih.").optional(),
	departmentId: z.string().min(1, "Departemen wajib dipilih.").optional(),
	positionId: z.string().min(1, "Posisi wajib dipilih.").optional(),
	isPublished: z.boolean().optional(),
});

interface HandlerContext {
	params: { jobVacancyId: string };
}

// GET: Mengambil satu lowongan
export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		const { jobVacancyId } = params;
		const vacancy = await prisma.jobVacancy.findUnique({
			where: { id: jobVacancyId },
		});
		return vacancy
			? NextResponse.json(vacancy)
			: NextResponse.json(
					{ message: "Lowongan tidak ditemukan." },
					{ status: 404 }
			  );
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
				data: parsedData,
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
			// Prisma secara otomatis akan menangani penghapusan relasi di JobInterest
			// jika onDelete: Cascade diatur pada skema. Jika tidak, hapus manual dulu.
			// Asumsi saat ini: relasi akan terhapus.
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
