import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Role } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "userManagement", action: "read" },
	async (_req, _args, { params }) => {
		const { userId } = params;
		if (typeof userId !== "string") {
			return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
		}
		const user = await prisma.user.findUnique({ where: { id: userId } });
		return user
			? NextResponse.json(user)
			: NextResponse.json({ message: "User not found" }, { status: 404 });
	}
);

export const PUT = withAuthorization(
	{ resource: "userManagement", action: "update" },
	async (req, _args, { params }) => {
		const { userId } = params;
		if (typeof userId !== "string") {
			return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
		}

		const userToUpdate = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (userToUpdate?.employeeId === "superuser") {
			return NextResponse.json(
				{ message: "Super user tidak dapat diubah." },
				{ status: 403 }
			);
		}

		try {
			const { role } = (await req.json()) as { role: Role };
			if (!role) {
				return NextResponse.json(
					{ message: "Role is required." },
					{ status: 400 }
				);
			}
			const updatedUser = await prisma.user.update({
				where: { id: userId },
				data: { role },
			});
			return NextResponse.json(updatedUser);
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{ message: "Failed to update user" },
				{ status: 500 }
			);
		}
	}
);

export const DELETE = withAuthorization(
	{ resource: "userManagement", action: "delete" },
	async (_req, _args, { params }) => {
		const { userId } = params;
		if (typeof userId !== "string") {
			return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
		}

		const userToDelete = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (userToDelete?.employeeId === "superuser") {
			return NextResponse.json(
				{ message: "Super user tidak dapat dihapus." },
				{ status: 403 }
			);
		}

		try {
			await prisma.user.delete({ where: { id: userId } });
			return new NextResponse(null, { status: 204 });
		} catch (error) {
			console.log("Error deleting user:", error);
			return NextResponse.json(
				{ message: "Gagal menghapus pengguna." },
				{ status: 500 }
			);
		}
	}
);
