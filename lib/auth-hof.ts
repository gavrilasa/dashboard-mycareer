// app/lib/auth-hof.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

type GenericWhereClause = { [key: string]: any };

interface HandlerArgs {
	session: CustomSession;
	whereClause: GenericWhereClause;
}

type NextJsParams = {
	params: { [key: string]: string | string[] | undefined };
};

type ApiHandler = (
	req: NextRequest,
	args: HandlerArgs,
	nextJsParams: NextJsParams
) => Promise<NextResponse>;

interface RequiredPermission {
	resource: Resource;
	action: Action;
}

export function withAuthorization(
	permission: RequiredPermission,
	handler: ApiHandler
) {
	return async (req: NextRequest, nextJsParams: NextJsParams) => {
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
			return await handler(req, { session, whereClause }, nextJsParams);
		} catch (error) {
			console.error("Kesalahan pada API Handler:", error);
			// Hindari membocorkan detail error di produksi
			return NextResponse.json(
				{ message: "Terjadi kesalahan internal pada server." },
				{ status: 500 }
			);
		}
	};
}
