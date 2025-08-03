import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

// GET: Mengambil satu posisi
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
			const updatedPosition = await prisma.position.update({
				where: { id: positionId },
				data: body,
			});
			return NextResponse.json(updatedPosition);
		} catch (error) {
			console.error("Error updating position:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
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
			// Periksa apakah posisi masih digunakan oleh karyawan
			const employeeCount = await prisma.employee.count({
				where: { positionId: positionId },
			});

			if (employeeCount > 0) {
				return NextResponse.json(
					{
						message:
							"Tidak dapat menghapus posisi yang masih digunakan oleh karyawan.",
					},
					{ status: 409 } // 409 Conflict
				);
			}

			await prisma.position.delete({
				where: { id: positionId },
			});
			return new NextResponse(null, { status: 204 }); // 204 No Content
		} catch (error) {
			console.error("Error deleting position:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
