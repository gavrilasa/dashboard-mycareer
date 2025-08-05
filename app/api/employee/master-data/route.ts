import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Menggunakan auth langsung untuk cek sesi

export async function GET() {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const [branches, departments, positions] = await prisma.$transaction([
			prisma.branch.findMany({
				orderBy: { name: "asc" },
				select: { id: true, name: true },
			}),
			prisma.department.findMany({
				orderBy: { name: "asc" },
				select: { id: true, name: true, branchId: true },
			}),
			prisma.position.findMany({
				orderBy: { name: "asc" },
				select: { id: true, name: true, departmentId: true },
			}),
		]);

		return NextResponse.json({ branches, departments, positions });
	} catch (error) {
		console.error("Error fetching employee master data:", error);
		return NextResponse.json(
			{ message: "Terjadi kesalahan pada server." },
			{ status: 500 }
		);
	}
}
