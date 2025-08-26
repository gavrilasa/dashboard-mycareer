import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

const updateCareerPathSchema = z
	.object({
		fromJobRoleId: z.string().min(1, "ID Job Role asal tidak valid."),
		toJobRoleId: z.string().min(1, "ID Job Role tujuan tidak valid."),
		pathType: z.enum(["ALIGN", "CROSS"]),
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
			const { fromJobRoleId, toJobRoleId, pathType } = parsedData;

			const potentialDuplicate = await prisma.careerPath.findFirst({
				where: {
					fromJobRoleId,
					toJobRoleId,
					NOT: { id: pathId },
				},
			});

			if (potentialDuplicate) {
				return NextResponse.json(
					{ message: "Kombinasi jenjang karier ini sudah ada." },
					{ status: 409 }
				);
			}

			const updatedCareerPath = await prisma.careerPath.update({
				where: { id: pathId },
				data: {
					fromJobRoleId,
					toJobRoleId,
					pathType,
				},
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
			const { pathId } = params; // Mengambil pathId dari context
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
