import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { EducationDegree, Prisma } from "@prisma/client";

export async function GET(
	req: Request,
	{ params }: { params: { employeeId: string } }
) {
	const { employeeId } = params;

	try {
		const employee = await prisma.employee.findUnique({
			where: { employeeId },
			include: {
				branch: { select: { name: true } },
				department: { select: { name: true } },
				level: { select: { name: true } },
				position: { select: { name: true } },
				user: { select: { email: true } },
			},
		});

		if (!employee) {
			return NextResponse.json(
				{ error: "Karyawan tidak ditemukan" },
				{ status: 404 }
			);
		}

		return NextResponse.json(employee);
	} catch (error) {
		console.error(`Error fetching employee ${employeeId}:`, error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { employeeId: string } }
) {
	const { employeeId } = params;

	try {
		const body: {
			name?: string;
			schoolName?: string;
			majorName?: string;
			educationDegree?: EducationDegree;
			email?: string;
		} = await req.json();

		const { name, schoolName, majorName, educationDegree, email } = body;

		if (!name && !schoolName && !majorName && !educationDegree && !email) {
			return NextResponse.json(
				{ error: "Tidak ada data untuk diperbarui" },
				{ status: 400 }
			);
		}

		if (
			educationDegree &&
			!Object.values(EducationDegree).includes(educationDegree)
		) {
			return NextResponse.json(
				{ error: `Nilai tingkat pendidikan tidak valid: ${educationDegree}` },
				{ status: 400 }
			);
		}

		const transaction = [];

		// Siapkan data untuk pembaruan Employee
		const employeeDataToUpdate: Prisma.EmployeeUpdateInput = {};
		if (name) employeeDataToUpdate.name = name;
		if (schoolName) employeeDataToUpdate.schoolName = schoolName;
		if (majorName) employeeDataToUpdate.majorName = majorName;
		if (educationDegree) employeeDataToUpdate.educationDegree = educationDegree;

		if (Object.keys(employeeDataToUpdate).length > 0) {
			employeeDataToUpdate.lastUpdatedAt = new Date();
			transaction.push(
				prisma.employee.update({
					where: { employeeId },
					data: employeeDataToUpdate,
				})
			);
		}

		if (email) {
			transaction.push(
				prisma.user.update({
					where: { employeeId },
					data: { email },
				})
			);
		}

		if (transaction.length === 0) {
			return NextResponse.json(
				{ message: "Tidak ada data yang diubah" },
				{ status: 200 }
			);
		}

		const result = await prisma.$transaction(transaction);

		return NextResponse.json(result[0]);
	} catch (error) {
		console.error(`Error updating employee ${employeeId}:`, error);
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return NextResponse.json(
				{ error: "Karyawan atau pengguna tidak ditemukan" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
