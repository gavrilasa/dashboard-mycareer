import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// GET: Mengambil daftar karyawan dengan filter, pencarian, dan paginasi
export async function GET(req: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	// Otorisasi: Hanya Admin, HR Cabang, dan HD yang bisa melihat daftar karyawan
	const allowedRoles: Role[] = ["ADMIN", "HR_BRANCH", "HD"];
	if (!session.user.role || !allowedRoles.includes(session.user.role)) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "10", 10);
	const search = searchParams.get("search") || "";
	const branchId = searchParams.get("branchId");
	const departmentId = searchParams.get("departmentId");

	const skip = (page - 1) * limit;

	// Membangun klausa 'where' untuk filter
	const where: Prisma.EmployeeWhereInput = {};

	// Filter berdasarkan peran pengguna
	const userRole = session.user.role;
	const userBranchId = (session.user as { branchId?: string }).branchId;
	const userDepartmentId = (session.user as { departmentId?: string })
		.departmentId;

	if (userRole === "HR_BRANCH") {
		where.branchId = userBranchId;
	} else if (userRole === "HD") {
		where.branchId = userBranchId;
		where.departmentId = userDepartmentId;
	} else if (userRole === "ADMIN") {
		if (branchId) where.branchId = branchId;
		if (departmentId) where.departmentId = departmentId;
	}

	// Filter berdasarkan pencarian (nama atau ID karyawan)
	if (search) {
		where.OR = [
			{ fullName: { contains: search, mode: "insensitive" } },
			{ employeeId: { contains: search, mode: "insensitive" } },
		];
	}

	try {
		const [employees, totalItems] = await prisma.$transaction([
			prisma.employee.findMany({
				where,
				skip,
				take: limit,
				include: {
					branch: { select: { name: true } },
					department: { select: { name: true } },
					position: { select: { name: true } },
					level: { select: { name: true } },
				},
				orderBy: {
					fullName: "asc",
				},
			}),
			prisma.employee.count({ where }),
		]);

		const totalPages = Math.ceil(totalItems / limit);

		return NextResponse.json({
			data: employees,
			pagination: {
				totalItems,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching employees:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// POST: Membuat karyawan baru
export async function POST(req: Request) {
	const session = await auth();
	if (!session?.user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	// Otorisasi: Hanya Admin dan HR Cabang yang bisa membuat karyawan
	const allowedRoles: Role[] = ["ADMIN", "HR_BRANCH"];
	if (!session.user.role || !allowedRoles.includes(session.user.role)) {
		return NextResponse.json({ message: "Forbidden" }, { status: 403 });
	}

	try {
		const body = await req.json();
		const {
			employeeId,
			password,
			fullName,
			dateOfBirth,
			gender,
			hireDate,
			lastEducationDegree,
			lastEducationSchool,
			lastEducationMajor,
			branchId,
			departmentId,
			positionId,
			levelId,
			role = "EMPLOYEE", // Default role
		} = body;

		// Validasi input
		if (
			!employeeId ||
			!password ||
			!fullName ||
			!branchId ||
			!departmentId ||
			!positionId ||
			!levelId
		) {
			return NextResponse.json(
				{ message: "Data yang diperlukan tidak lengkap" },
				{ status: 400 }
			);
		}

		// HR Cabang hanya bisa membuat karyawan di cabangnya sendiri
		const userBranchId = (session.user as { branchId?: string }).branchId;
		if (session.user.role === "HR_BRANCH" && branchId !== userBranchId) {
			return NextResponse.json(
				{ message: "Anda tidak dapat membuat karyawan untuk cabang lain" },
				{ status: 403 }
			);
		}

		// Cek apakah employeeId sudah ada
		const existingEmployee = await prisma.employee.findUnique({
			where: { employeeId },
		});

		if (existingEmployee) {
			return NextResponse.json(
				{ message: "ID Karyawan sudah digunakan" },
				{ status: 409 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// Membuat User dan Employee dalam satu transaksi
		const newEmployee = await prisma.$transaction(async (tx) => {
			const newUser = await tx.user.create({
				data: {
					employeeId,
					password: hashedPassword,
					role,
					branchId,
					departmentId,
				},
			});

			const employee = await tx.employee.create({
				data: {
					employeeId,
					fullName,
					dateOfBirth: new Date(dateOfBirth),
					gender,
					hireDate: new Date(hireDate),
					lastEducationDegree,
					lastEducationSchool,
					lastEducationMajor,
					branch: { connect: { id: branchId } },
					department: { connect: { id: departmentId } },
					position: { connect: { id: positionId } },
					level: { connect: { id: levelId } },
					user: { connect: { id: newUser.id } },
				},
			});

			return employee;
		});

		return NextResponse.json(newEmployee, { status: 201 });
	} catch (error) {
		console.error("Error creating employee:", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				// Unique constraint violation
				return NextResponse.json(
					{ message: "ID Karyawan sudah ada" },
					{ status: 409 }
				);
			}
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
