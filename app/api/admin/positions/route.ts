import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const createPositionSchema = z.object({
	name: z.string().min(1, "Nama Jabatan tidak boleh kosong"),
	branchId: z.string().min(1, "ID Cabang tidak boleh kosong"),
	departmentId: z.string().min(1, "ID Departemen tidak boleh kosong"),
	levelId: z.string().min(1, "ID Level tidak boleh kosong"),
});

export const GET = withAuthorization(
	{ resource: "position", action: "read" },
	async (req: NextRequest) => {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search") || "";

		const skip = (page - 1) * limit;

		try {
			const whereClause = {
				name: {
					contains: search,
					mode: "insensitive" as const,
				},
			};

			const [positions, totalItems] = await prisma.$transaction([
				prisma.position.findMany({
					where: whereClause,
					skip,
					take: limit,
					include: {
						branch: true,
						department: true,
						level: true,
						jobRole: true,
					},
					orderBy: {
						branch: {
							id: "asc",
						},
					},
				}),
				prisma.position.count({ where: whereClause }),
			]);

			const totalPages = Math.ceil(totalItems / limit);

			return NextResponse.json({
				data: positions,
				pagination: {
					totalItems,
					totalPages,
					currentPage: page,
				},
			});
		} catch (error) {
			console.error("Gagal mengambil data posisi:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

// Handler untuk membuat posisi baru (sudah diperbaiki)
export const POST = withAuthorization(
	{ resource: "position", action: "create" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();

			// --- PERBAIKI LOGIKA VALIDASI INI ---
			// Validasi body secara langsung, tanpa destructuring atau .omit()
			const validation = createPositionSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Data yang dikirim tidak valid.",
						errors: validation.error.issues,
					},
					{ status: 400 }
				);
			}

			// Data yang sudah divalidasi sekarang aman untuk digunakan
			const { name, branchId, departmentId, levelId } = validation.data;

			// Logika JobRole tetap sama
			const jobRole = await prisma.jobRole.upsert({
				where: {
					name: name,
				},
				update: {},
				create: {
					name: name,
				},
			});

			// Buat ID unik untuk posisi baru di backend
			const newPositionId = `${branchId}-${departmentId}-${Math.random()
				.toString(16)
				.slice(2, 8)}`;

			const newPosition = await prisma.position.create({
				data: {
					id: newPositionId,
					name,
					branchId,
					departmentId,
					levelId,
					jobRoleId: jobRole.id,
				},
			});

			return NextResponse.json(newPosition, { status: 201 });
		} catch (error: unknown) {
			console.error("Gagal membuat posisi:", error);
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				return NextResponse.json(
					{
						message: "Gagal: Posisi dengan detail tersebut mungkin sudah ada.",
					},
					{ status: 409 }
				);
			}
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
