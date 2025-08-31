import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma, PathType, VacancyPeriod } from "@prisma/client";

// Skema Zod diperbarui untuk menyertakan 'period'
const updateCareerPathSchema = z
	.object({
		fromJobRoleId: z.string().min(1, "ID Job Role asal tidak valid."),
		toJobRoleId: z.string().min(1, "ID Job Role tujuan tidak valid."),
		pathType: z.enum([PathType.ALIGN, PathType.CROSS]),
		period: z.enum([VacancyPeriod.SHORT_TERM, VacancyPeriod.LONG_TERM]),
	})
	.refine((data) => data.fromJobRoleId !== data.toJobRoleId, {
		message: "Job Role asal dan tujuan tidak boleh sama.",
		path: ["toJobRoleId"],
	});

interface HandlerContext {
	params: { pathId: string };
}

export const PUT = withAuthorization(
	{ resource: "careerPath", action: "update" },
	async (request: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { pathId } = params;

			const body = await request.json();
			const parsedData = updateCareerPathSchema.parse(body);

			// Cek duplikasi, pastikan tidak ada jenjang karier lain
			// dengan kombinasi from, to, dan period yang sama.
			const potentialDuplicate = await prisma.careerPath.findFirst({
				where: {
					fromJobRoleId: parsedData.fromJobRoleId,
					toJobRoleId: parsedData.toJobRoleId,
					period: parsedData.period,
					NOT: { id: pathId }, // Abaikan path yang sedang diedit
				},
			});

			if (potentialDuplicate) {
				return NextResponse.json(
					{ message: "Kombinasi jenjang karier ini sudah ada." },
					{ status: 409 }
				);
			}

			// Lakukan update dengan semua data yang sudah divalidasi
			const updatedCareerPath = await prisma.careerPath.update({
				where: { id: pathId },
				data: parsedData,
			});

			return NextResponse.json({
				message: "Jenjang karier berhasil diperbarui.",
				data: updatedCareerPath,
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json(
					{
						message: "Data tidak valid.",
						errors: error.flatten().fieldErrors,
					},
					{ status: 400 }
				);
			}
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				return NextResponse.json(
					{ message: "Jenjang karier tidak ditemukan." },
					{ status: 404 }
				);
			}
			console.error("PUT /api/admin/career-path/[pathId] Error:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

export const DELETE = withAuthorization(
	{ resource: "careerPath", action: "delete" },
	async (_request: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { pathId } = params;
			await prisma.careerPath.delete({ where: { id: pathId } });
			return new NextResponse(null, { status: 204 });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				return new NextResponse(null, { status: 204 });
			}
			console.error("DELETE /api/admin/career-path/[pathId] Error:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
