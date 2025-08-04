import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

// FIX: Skema update sekarang mencakup semua field yang dapat diedit.
const updateCareerPathSchema = z
	.object({
		fromPositionId: z.string().min(1, "ID Posisi asal tidak valid."),
		toPositionId: z.string().min(1, "ID Posisi tujuan tidak valid."),
		pathType: z.enum(["ALIGN", "CROSS"]),
	})
	.refine((data) => data.fromPositionId !== data.toPositionId, {
		message: "Posisi asal dan tujuan tidak boleh sama.",
		path: ["toPositionId"],
	});

export const PUT = withAuthorization(
	{ resource: "careerPath", action: "update" },
	async (request: NextRequest) => {
		try {
			const pathId = request.nextUrl.pathname.split("/").pop();
			if (!pathId) {
				return NextResponse.json(
					{ message: "ID Jenjang Karier tidak ditemukan di URL." },
					{ status: 400 }
				);
			}

			const body = await request.json();
			const parsedData = updateCareerPathSchema.parse(body);
			const { fromPositionId, toPositionId, pathType } = parsedData;

			// 1. Periksa apakah jenjang karier yang akan diedit ada
			const existingPath = await prisma.careerPath.findUnique({
				where: { id: pathId },
			});
			if (!existingPath) {
				return NextResponse.json(
					{ message: "Jenjang karier tidak ditemukan." },
					{ status: 404 }
				);
			}

			// 2. Periksa apakah pembaruan akan menciptakan duplikat
			if (
				existingPath.fromPositionId !== fromPositionId ||
				existingPath.toPositionId !== toPositionId
			) {
				const potentialDuplicate = await prisma.careerPath.findFirst({
					where: {
						fromPositionId,
						toPositionId,
						// Pastikan kita tidak membandingkan dengan record itu sendiri
						NOT: { id: pathId },
					},
				});
				if (potentialDuplicate) {
					return NextResponse.json(
						{ message: "Kombinasi jenjang karier ini sudah ada." },
						{ status: 409 }
					);
				}
			}

			// 3. Lakukan pembaruan
			const updatedCareerPath = await prisma.careerPath.update({
				where: { id: pathId },
				data: {
					fromPositionId,
					toPositionId,
					pathType,
				},
				include: {
					fromPosition: { select: { id: true, name: true } },
					toPosition: { select: { id: true, name: true } },
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

// Fungsi DELETE sudah benar dan tidak memerlukan perubahan.
export const DELETE = withAuthorization(
	{ resource: "careerPath", action: "delete" },
	async (request: NextRequest) => {
		try {
			const pathId = request.nextUrl.pathname.split("/").pop();
			if (!pathId) {
				return NextResponse.json(
					{ message: "ID Jenjang Karier tidak ditemukan di URL." },
					{ status: 400 }
				);
			}

			const cuidRegex = /^c[^\s-]{8,}$/i;
			if (!cuidRegex.test(pathId)) {
				return NextResponse.json(
					{ message: "Format ID Jenjang Karier tidak valid." },
					{ status: 400 }
				);
			}

			await prisma.careerPath.delete({ where: { id: pathId } });

			return new NextResponse(null, { status: 204 });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2025"
			) {
				// Ini adalah error yang diharapkan jika record tidak ditemukan, jadi kita bisa anggap "berhasil"
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
