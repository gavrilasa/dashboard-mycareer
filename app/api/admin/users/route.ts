import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Gender, Role, EducationDegree, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";
import { auth } from "@/app/lib/auth";

const createUserSchema = z.object({
	employeeId: z.string().min(1, "Employee ID is required."),
	fullName: z.string().min(1, "Full Name is required."),
	dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format. Expected ISO 8601 string.",
	}),
	hireDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format. Expected ISO 8601 string.",
	}),
	gender: z.enum([Gender.MALE, Gender.FEMALE]),
	role: z.enum([Role.ADMIN, Role.EMPLOYEE, Role.HD, Role.HR_BRANCH]),
	branchId: z.string().min(1, "Branch is required."),
	departmentId: z.string().min(1, "Department is required."),
	positionId: z.string().min(1, "Position is required."),
	levelId: z.string().min(1, "Level is required."),
	lastEducationDegree: z.enum(
		Object.values(EducationDegree) as [string, ...string[]]
	),
	lastEducationSchool: z.string().min(1, "School name is required."),
	lastEducationMajor: z.string().min(1, "Major is required."),
});

/**
 * GET handler for fetching a paginated and searchable list of users.
 */
export async function GET(req: Request) {
	const session = await auth();
	if (session?.user?.role !== "ADMIN") {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const q = searchParams.get("q") || "";
		const skip = (page - 1) * limit;

		const whereClause: Prisma.UserWhereInput = q
			? {
					OR: [
						{ employeeId: { contains: q, mode: "insensitive" } },
						{ employee: { fullName: { contains: q, mode: "insensitive" } } },
						...(Object.values(Role).includes(q.toUpperCase() as Role)
							? [{ role: { equals: q.toUpperCase() as Role } }]
							: []),
					],
			  }
			: {};

		const [users, total] = await prisma.$transaction([
			prisma.user.findMany({
				where: whereClause,
				skip,
				take: limit,
				include: {
					employee: {
						select: {
							fullName: true,
							position: { select: { name: true } },
						},
					},
				},
				orderBy: { createdAt: "desc" },
			}),
			prisma.user.count({ where: whereClause }),
		]);

		return NextResponse.json({
			data: users,
			pagination: {
				totalItems: total,
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Failed to fetch users:", error);
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ message: "An unexpected error occurred." },
			{ status: 500 }
		);
	}
}

/**
 * POST handler for creating a new user and their corresponding employee record.
 */
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const validation = createUserSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					message: "Invalid input.",
					errors: validation.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const {
			employeeId,
			fullName,
			dateOfBirth,
			hireDate,
			gender,
			role,
			branchId,
			departmentId,
			positionId,
			levelId,
			lastEducationDegree,
			lastEducationSchool,
			lastEducationMajor,
		} = validation.data;

		const existingEmployee = await prisma.employee.findUnique({
			where: { employeeId },
		});
		if (existingEmployee) {
			return NextResponse.json(
				{ message: `Employee with ID ${employeeId} already exists.` },
				{ status: 409 }
			);
		}

		const dob = new Date(dateOfBirth);
		const dobForPassword = `${String(dob.getUTCDate()).padStart(
			2,
			"0"
		)}${String(dob.getUTCMonth() + 1).padStart(2, "0")}${dob.getUTCFullYear()}`;
		const hashedPassword = await hash(`${employeeId}${dobForPassword}`, 10);

		const newUser = await prisma.$transaction(async (tx) => {
			await tx.user.create({
				data: {
					employeeId,
					password: hashedPassword,
					role,
					...(role === Role.HR_BRANCH && { branchId }),
					...(role === Role.HD && { branchId, departmentId }),
				},
			});

			return tx.employee.create({
				data: {
					employeeId,
					fullName,
					dateOfBirth: dob,
					hireDate: new Date(hireDate),
					gender,
					branchId,
					departmentId,
					positionId,
					levelId,
					// ## FIX: Explicitly cast to the enum type ##
					lastEducationDegree: lastEducationDegree as EducationDegree,
					lastEducationSchool,
					lastEducationMajor,
				},
			});
		});

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		console.error("Failed to create user:", error);
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ message: "An unexpected error occurred." },
			{ status: 500 }
		);
	}
}
