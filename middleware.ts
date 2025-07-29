// middleware.ts

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { UserRole } from "@prisma/client";

// --- KONFIGURASI IZIN TERPUSAT ---

interface Rule {
	allowedRoles: UserRole[];
	ownerCheck?: { paramIndex: number };
}

// PERBAIKAN: Gunakan URL publik sebagai kunci, bukan nama folder grup
const permissionConfig: Record<string, Rule> = {
	// === Rute di dalam grup (admin) ===
	"/dashboard/employees": { allowedRoles: [UserRole.HR, UserRole.HD] },
	"/dashboard/positions": { allowedRoles: [UserRole.HR, UserRole.HD] },
	"/dashboard/departments": { allowedRoles: [UserRole.HR, UserRole.HD] },
	"/dashboard/branches": { allowedRoles: [UserRole.HR, UserRole.HD] },

	// === Rute di dalam grup (employee) ===
	"/dashboard/profile": {
		allowedRoles: [UserRole.EMPLOYEE, UserRole.HR, UserRole.HD],
		ownerCheck: { paramIndex: 2 }, // URL: /dashboard/profile/[employeeId]
	},

	// === Rute yang bisa diakses bersama ===
	"/dashboard": {
		allowedRoles: [UserRole.HR, UserRole.HD, UserRole.EMPLOYEE],
	},
	"/api/master-data": {
		allowedRoles: [UserRole.HR, UserRole.HD, UserRole.EMPLOYEE],
	},
};

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		const token = req.nextauth.token;

		if (!token) {
			return new NextResponse("Authentication required", { status: 401 });
		}

		const matchedPath = Object.keys(permissionConfig)
			.sort((a, b) => b.length - a.length)
			.find((path) => pathname.startsWith(path));

		if (!matchedPath) {
			const unauthorizedUrl = new URL("/unauthorized", req.url);
			return NextResponse.rewrite(unauthorizedUrl);
		}

		const rule = permissionConfig[matchedPath];
		const userRole = token.role as UserRole;

		if (rule.allowedRoles.includes(userRole)) {
			return NextResponse.next();
		}

		if (rule.ownerCheck) {
			const pathSegments = pathname.split("/");
			if (pathSegments.length > rule.ownerCheck.paramIndex) {
				const targetEmployeeId = pathSegments[rule.ownerCheck.paramIndex];
				if (token.id === targetEmployeeId) {
					return NextResponse.next();
				}
			}
		}

		const unauthorizedUrl = new URL("/unauthorized", req.url);
		return NextResponse.rewrite(unauthorizedUrl);
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/dashboard/:path*"],
};
