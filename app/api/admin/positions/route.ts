// app/api/admin/positions/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

const createPositionSchema = z.object({
	id: z.string().min(1, "ID Posisi tidak boleh kosong"),
	name: z.string().min(1, "Nama Jabatan tidak boleh kosong"),
	branchId: z.string().min(1, "ID Cabang tidak boleh kosong"),
	departmentId: z.string().min(1, "ID Departemen tidak boleh kosong"),
	levelId: z.string().min(1, "ID Level tidak boleh kosong"),
});

export const GET = withAuthorization(
	{ resource: "position", action: "read" },
	async () => {
		try {
			const positions = await prisma.position.findMany({
				include: {
					branch: true,
					department: true,
					level: true,
					jobRole: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			return NextResponse.json(positions);
		} catch (error) {
			console.error("Gagal mengambil data posisi:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

// Handler untuk membuat posisi baru dengan logika JobRole otomatis
export const POST = withAuthorization(
	{ resource: "position", action: "create" },
	async (req: NextRequest) => {
		try {
			const body = await req.json();
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

			const { id, name, branchId, departmentId, levelId } = validation.data;

			const jobRole = await prisma.jobRole.upsert({
				where: {
					name: name,
				},
				update: {},
				create: {
					name: name,
				},
			});

			const newPosition = await prisma.position.create({
				data: {
					id,
					name,
					branchId,
					departmentId,
					levelId,
					jobRoleId: jobRole.id,
				},
			});

			return NextResponse.json(newPosition, { status: 201 });
		} catch (error: any) {
			console.error("Gagal membuat posisi:", error);
			if (error.code === "P2002") {
				return NextResponse.json(
					{ message: "Gagal: ID Posisi yang Anda masukkan sudah ada." },
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
