import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

// Skema validasi untuk data update
const updatePositionSchema = z.object({
	name: z.string().min(1, "Nama Jabatan tidak boleh kosong"),
	branchId: z.string().min(1, "ID Cabang tidak boleh kosong"),
	departmentId: z.string().min(1, "ID Departemen tidak boleh kosong"),
	levelId: z.string().min(1, "ID Level tidak boleh kosong"),
});

// GET: Mengambil satu posisi (sudah disesuaikan)
export const GET = withAuthorization(
	{ resource: "position", action: "read" },
	async (_req, _args, { params }) => {
		const { positionId } = params;
		if (typeof positionId !== "string") {
			return NextResponse.json(
				{ message: "ID Posisi tidak valid" },
				{ status: 400 }
			);
		}

		const position = await prisma.position.findUnique({
			where: { id: positionId },
			include: {
				jobRole: true,
				branch: true,
				department: true,
				level: true,
			},
		});

		if (!position) {
			return NextResponse.json(
				{ message: "Posisi tidak ditemukan" },
				{ status: 404 }
			);
		}
		return NextResponse.json(position);
	}
);

// PUT: Memperbarui posisi
export const PUT = withAuthorization(
	{ resource: "position", action: "update" },
	async (req, _args, { params }) => {
		const { positionId } = params;
		if (typeof positionId !== "string") {
			return NextResponse.json(
				{ message: "ID Posisi tidak valid" },
				{ status: 400 }
			);
		}

		try {
			const body = await req.json();
			const validation = updatePositionSchema.safeParse(body);

			if (!validation.success) {
				return NextResponse.json(
					{ message: "Data tidak valid", errors: validation.error.issues },
					{ status: 400 }
				);
			}

			const { name, ...otherData } = validation.data;

			const jobRole = await prisma.jobRole.upsert({
				where: { name: name },
				update: {},
				create: { name: name },
			});

			const updatedPosition = await prisma.position.update({
				where: { id: positionId },
				data: {
					name,
					...otherData,
					jobRoleId: jobRole.id,
				},
			});
			return NextResponse.json(updatedPosition);
		} catch (error) {
			console.error("Gagal memperbarui posisi:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server" },
				{ status: 500 }
			);
		}
	}
);

// DELETE: Menghapus posisi
export const DELETE = withAuthorization(
	{ resource: "position", action: "delete" },
	async (_req, _args, { params }) => {
		const { positionId } = params;
		if (typeof positionId !== "string") {
			return NextResponse.json(
				{ message: "ID Posisi tidak valid" },
				{ status: 400 }
			);
		}

		try {
			const positionToDelete = await prisma.position.findUnique({
				where: { id: positionId },
				select: { jobRoleId: true },
			});

			if (!positionToDelete) {
				return new NextResponse(null, { status: 204 });
			}

			await prisma.position.delete({
				where: { id: positionId },
			});

			const remainingPositionsWithJobRole = await prisma.position.count({
				where: { jobRoleId: positionToDelete.jobRoleId },
			});

			if (remainingPositionsWithJobRole === 0) {
				await prisma.jobRole.delete({
					where: { id: positionToDelete.jobRoleId },
				});
			}

			return new NextResponse(null, { status: 204 });
		} catch (error) {
			console.error("Gagal menghapus posisi:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server" },
				{ status: 500 }
			);
		}
	}
);
