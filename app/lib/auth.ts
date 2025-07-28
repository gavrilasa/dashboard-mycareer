// app/lib/auth.ts

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);
	return session?.user ?? null;
}

type UserForAuthorization = {
	role: string;
	employeeId: string;
} | null;

export function checkAuthorization(
	currentUser: UserForAuthorization,
	allowedRoles: string[],
	targetEmployeeId?: string
): boolean {
	if (!currentUser) {
		return false;
	}

	if (allowedRoles.includes(currentUser.role)) {
		return true;
	}

	if (targetEmployeeId && currentUser.employeeId === targetEmployeeId) {
		return true;
	}

	return false;
}
