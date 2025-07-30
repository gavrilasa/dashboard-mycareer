import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { EducationDegree, Prisma } from "@prisma/client";

export async function GET(
	req: Request,
	// The { params } object is destructured directly from the second argument.
	{ params }: { params: { employeeId: string } }
) {
	try {
		// --- Authorization Logic ---
		const loggedInEmployeeId = req.headers.get("x-user-employee-id");

		// This check is now the very first step.
		if (!loggedInEmployeeId) {
			return NextResponse.json(
				{ error: "Unauthorized: User identity not found." },
				{ status: 401 }
			);
		}

		// Use params.employeeId directly from the destructured argument.
		if (loggedInEmployeeId !== params.employeeId) {
			return NextResponse.json(
				{ error: "Forbidden: You can only access your own profile." },
				{ status: 403 }
			);
		}
		// --- End Authorization ---

		const employee = await prisma.employee.findUnique({
			where: { employeeId: loggedInEmployeeId },
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
				{ error: "Profil karyawan tidak ditemukan" },
				{ status: 404 }
			);
		}

		return NextResponse.json(employee);
	} catch (error) {
		console.error(`Error in GET /api/employee/${params.employeeId}:`, error);
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
	try {
		// --- Authorization Logic ---
		const loggedInEmployeeId = req.headers.get("x-user-employee-id");

		if (!loggedInEmployeeId) {
			return NextResponse.json(
				{ error: "Unauthorized: User identity not found." },
				{ status: 401 }
			);
		}

		if (loggedInEmployeeId !== params.employeeId) {
			return NextResponse.json(
				{ error: "Forbidden: You can only access your own profile." },
				{ status: 403 }
			);
		}
		// --- End Authorization ---

		const body = await req.json();
		const { schoolName, majorName, educationDegree } = body;
		const dataToUpdate: Prisma.EmployeeUpdateInput = {};

		if (schoolName !== undefined) dataToUpdate.schoolName = schoolName;
		if (majorName !== undefined) dataToUpdate.majorName = majorName;
		if (educationDegree !== undefined) {
			if (!Object.values(EducationDegree).includes(educationDegree)) {
				return NextResponse.json(
					{ error: `Nilai tingkat pendidikan tidak valid` },
					{ status: 400 }
				);
			}
			dataToUpdate.educationDegree = educationDegree;
		}

		if (Object.keys(dataToUpdate).length === 0) {
			return NextResponse.json(
				{ message: "Tidak ada data yang diubah" },
				{ status: 200 }
			);
		}

		dataToUpdate.lastUpdatedAt = new Date();

		const updatedEmployee = await prisma.employee.update({
			where: { employeeId: loggedInEmployeeId },
			data: dataToUpdate,
		});

		return NextResponse.json(updatedEmployee);
	} catch (error) {
		console.error(`Error in PUT /api/employee/${params.employeeId}:`, error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
