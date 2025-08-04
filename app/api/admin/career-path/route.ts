// app/api/admin/career-path/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

// FIX: Corrected Zod enum syntax
const createCareerPathSchema = z.object({
	fromPositionId: z.string().min(1, "ID Posisi asal tidak valid."),
	toPositions: z
		.array(
			z.object({
				toPositionId: z.string().min(1, "ID Posisi tujuan tidak valid."),
				pathType: z.enum(["ALIGN", "CROSS"]), // Simplified enum definition
			})
		)
		.min(1, "Minimal satu posisi tujuan harus ditambahkan.")
		.max(10, "Maksimal 10 posisi tujuan dapat ditambahkan."),
});

// GET Handler
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

			// FIX: Removed the invalid search condition for the 'pathType' enum
			const where: Prisma.CareerPathWhereInput = search
				? {
						OR: [
							{
								fromPosition: {
									name: { contains: search, mode: "insensitive" },
								},
							},
							{
								toPosition: { name: { contains: search, mode: "insensitive" } },
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
						{ fromPosition: { name: "asc" } },
						{ toPosition: { name: "asc" } },
					],
					include: {
						fromPosition: { select: { id: true, name: true } },
						toPosition: { select: { id: true, name: true } },
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
					hasNext: page < totalPages,
					hasPrev: page > 1,
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

// POST Handler (for creating new paths)
export const POST = withAuthorization(
	{ resource: "careerPath", action: "create" },
	async (request: NextRequest) => {
		try {
			const body = await request.json();
			console.log("Received POST data:", JSON.stringify(body, null, 2));

			const parsedData = createCareerPathSchema.parse(body);
			const { fromPositionId, toPositions } = parsedData;

			// Verify positions exist in database
			const [fromPosition, toPositionsList] = await prisma.$transaction([
				prisma.position.findUnique({
					where: { id: fromPositionId },
					select: { id: true, name: true },
				}),
				prisma.position.findMany({
					where: {
						id: { in: toPositions.map((p) => p.toPositionId) },
					},
					select: { id: true, name: true },
				}),
			]);

			// Check if fromPosition exists
			if (!fromPosition) {
				return NextResponse.json(
					{ message: "Posisi asal tidak ditemukan." },
					{ status: 404 }
				);
			}

			// Check if all toPositions exist
			const toPositionIds = toPositions.map((p) => p.toPositionId);
			const foundToPositionIds = toPositionsList.map((p) => p.id);
			const missingPositionIds = toPositionIds.filter(
				(id) => !foundToPositionIds.includes(id)
			);

			if (missingPositionIds.length > 0) {
				return NextResponse.json(
					{
						message: `Posisi tujuan tidak ditemukan: ${missingPositionIds.join(
							", "
						)}`,
					},
					{ status: 404 }
				);
			}

			// Prevent self-referencing paths
			const selfReferencingPaths = toPositions.filter(
				(p) => p.toPositionId === fromPositionId
			);
			if (selfReferencingPaths.length > 0) {
				return NextResponse.json(
					{
						message: "Tidak dapat membuat jenjang karier ke posisi yang sama.",
					},
					{ status: 400 }
				);
			}

			// Check for existing paths (using the unique constraint fromPositionId + toPositionId)
			const existingPaths = await prisma.careerPath.findMany({
				where: {
					fromPositionId,
					toPositionId: { in: toPositionIds },
				},
				include: {
					toPosition: { select: { name: true } },
				},
			});

			if (existingPaths.length > 0) {
				const duplicateNames = existingPaths
					.map((p) => p.toPosition.name)
					.join(", ");
				return NextResponse.json(
					{
						message: `Jenjang karier sudah ada untuk posisi tujuan: ${duplicateNames}`,
					},
					{ status: 409 }
				);
			}

			// Create the career paths
			const dataToCreate = toPositions.map((pos) => ({
				fromPositionId,
				toPositionId: pos.toPositionId,
				pathType: pos.pathType,
			}));

			// Use transaction to ensure all paths are created together
			const result = await prisma.$transaction(async (tx) => {
				const createdPaths = [];
				for (const pathData of dataToCreate) {
					const createdPath = await tx.careerPath.create({
						data: pathData,
						include: {
							fromPosition: { select: { name: true } },
							toPosition: { select: { name: true } },
						},
					});
					createdPaths.push(createdPath);
				}
				return createdPaths;
			});

			console.log(`Created ${result.length} career paths`);

			return NextResponse.json(
				{
					message: `${result.length} jenjang karier berhasil dibuat.`,
					created: result.length,
					data: result,
				},
				{ status: 201 }
			);
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.error(
					"Zod Validation Error:",
					JSON.stringify(error.flatten(), null, 2)
				);
				return NextResponse.json(
					{
						message: "Data tidak valid.",
						errors: error.flatten().fieldErrors,
					},
					{ status: 400 }
				);
			}
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					return NextResponse.json(
						{ message: "Kombinasi jenjang karier sudah ada." },
						{ status: 409 }
					);
				}
				if (error.code === "P2003") {
					return NextResponse.json(
						{ message: "Posisi yang direferensikan tidak ditemukan." },
						{ status: 404 }
					);
				}
			}
			console.error("POST /api/admin/career-path Error:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
