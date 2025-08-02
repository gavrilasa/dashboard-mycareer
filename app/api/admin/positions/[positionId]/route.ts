import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

// PUT: Mengedit posisi berdasarkan ID
export async function PUT(
	request: Request,
	{ params }: { params: { positionId: string } }
) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { positionId } = params;

	try {
		const body = await request.json();
		const { name } = body;

		if (!name) {
			return NextResponse.json(
				{ message: "Position name is required" },
				{ status: 400 }
			);
		}

		const updatedPosition = await prisma.position.update({
			where: { id: positionId },
			data: { name },
		});

		return NextResponse.json(updatedPosition);
	} catch (error) {
		console.error(`Error updating position ${positionId}:`, error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// DELETE: Menghapus posisi berdasarkan ID
export async function DELETE(
	request: Request,
	{ params }: { params: { positionId: string } }
) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const { positionId } = params;

	try {
		// Tambahan: Cek apakah posisi masih digunakan oleh karyawan
		const employeeCount = await prisma.employee.count({
			where: { positionId: positionId },
		});

		if (employeeCount > 0) {
			return NextResponse.json(
				{ message: "Cannot delete position, it is still in use by employees." },
				{ status: 409 } // 409 Conflict
			);
		}

		await prisma.position.delete({
			where: { id: positionId },
		});

		return NextResponse.json(
			{ message: "Position deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error(`Error deleting position ${positionId}:`, error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
