// app/lib/auth-hof.ts

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextRequest, NextResponse } from "next/server";
import { PERMISSIONS, Resource, Action } from "./permissions";
import { Role } from "@prisma/client";

interface CustomSession {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
		role?: Role;
		employeeId?: string;
		branchId?: string;
		departmentId?: string;
	};
}

type GenericWhereClause = { [key: string]: unknown };

interface HandlerArgs {
	session: CustomSession;
	whereClause: GenericWhereClause;
}

type ApiHandler<P> = (
	req: NextRequest,
	args: HandlerArgs,
	context: { params: P }
) => Promise<NextResponse>;

interface RequiredPermission {
	resource: Resource;
	action: Action;
}

export function withAuthorization<
	P extends { [key: string]: string | string[] | undefined }
>(permission: RequiredPermission, handler: ApiHandler<P>) {
	return async (req: NextRequest, context: { params: Promise<P> }) => {
		const session: CustomSession | null = await getServerSession(authOptions);

		if (!session?.user?.role) {
			return NextResponse.json(
				{ message: "Akses Ditolak: Tidak terautentikasi." },
				{ status: 401 }
			);
		}

		const userRole = session.user.role;
		const allowedActions = PERMISSIONS[userRole]?.[permission.resource];

		if (!allowedActions || !allowedActions.includes(permission.action)) {
			return NextResponse.json(
				{
					message:
						"Akses Ditolak: Anda tidak memiliki izin untuk tindakan ini.",
				},
				{ status: 403 }
			);
		}

		let whereClause: GenericWhereClause = {};

		switch (userRole) {
			case "HR_BRANCH":
				whereClause = { branchId: session.user.branchId };
				break;
			case "HD":
				whereClause = {
					branchId: session.user.branchId,
					departmentId: session.user.departmentId,
				};
				break;
			case "EMPLOYEE":
				if (
					permission.resource === "employee" &&
					permission.action === "read"
				) {
					whereClause = { id: session.user.employeeId };
				}
				break;
		}

		try {
			const resolvedParams = await context.params;
			return await handler(
				req,
				{ session, whereClause },
				{ params: resolvedParams }
			);
		} catch (error) {
			console.error("Kesalahan pada API Handler:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan internal pada server." },
				{ status: 500 }
			);
		}
	};
}
