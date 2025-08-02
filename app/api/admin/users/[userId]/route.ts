import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Role } from "@prisma/client";
import { z } from "zod";

const updateUserSchema = z.object({
	role: z.enum([Role.ADMIN, Role.EMPLOYEE, Role.HD, Role.HR_BRANCH]),
});

/**
 * GET handler for fetching a single user by their ID.
 */
export async function GET(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: params.userId },
			include: {
				employee: true,
			},
		});
		return NextResponse.json(user);
	} catch (error) {
		console.error("Failed to fetch user:", error);
		return NextResponse.json({ message: "User not found." }, { status: 404 });
	}
}

/**
 * PUT handler for updating a user's role.
 */
export async function PUT(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const body = await req.json();
		const validation = updateUserSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					message: "Invalid input.",
					errors: validation.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { role } = validation.data;

		const updatedUser = await prisma.user.update({
			where: { id: params.userId },
			data: {
				role,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Failed to update user:", error);
		const errorMessage =
			error instanceof Error ? error.message : "An unexpected error occurred.";
		return NextResponse.json({ message: errorMessage }, { status: 500 });
	}
}

/**
 * DELETE handler for removing a user and their associated employee record.
 */
export async function DELETE(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: params.userId },
		});

		// ## FIX: Add a null check for employeeId ##
		if (!user.employeeId) {
			throw new Error("User does not have an associated employee ID.");
		}

		await prisma.$transaction(async (tx) => {
			await tx.employee.delete({
				where: { employeeId: user.employeeId as string }, // Now safe to cast
			});
			await tx.user.delete({
				where: { id: params.userId },
			});
		});

		return NextResponse.json({ message: "User deleted successfully." });
	} catch (error) {
		console.error("Failed to delete user:", error);
		const message =
			error instanceof Error ? error.message : "Failed to delete user.";
		return NextResponse.json({ message }, { status: 500 });
	}
}
