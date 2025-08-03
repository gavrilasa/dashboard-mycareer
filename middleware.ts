import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PERMISSIONS, Resource, Action } from "@/lib/permissions";
import { Role } from "@prisma/client";

const protectedRoutes: Record<string, { resource: Resource; action: Action }> =
	{
		"/admin/dashboard": { resource: "dashboard", action: "read" },
		"/admin/employees": { resource: "employee", action: "read" },
		"/admin/positions": { resource: "position", action: "read" },
		"/admin/departments": { resource: "department", action: "read" },
		"/admin/branches": { resource: "branch", action: "read" },
		"/admin/users": { resource: "userManagement", action: "read" },

		"/profile": { resource: "dashboard", action: "read" },
		"/form": { resource: "form", action: "read" },
		"/questionnaire": { resource: "questionnaire", action: "read" },
		"/job-vacant": { resource: "jobVacant", action: "read" },
	};

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const { token } = req.nextauth;
		const { pathname } = req.nextUrl;

		if (!token || !token.role) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		const userRole = token.role as Role;

		if (pathname === "/login" || pathname === "/") {
			if (userRole === "EMPLOYEE") {
				return NextResponse.redirect(new URL("/profile", req.url)); // Arahkan ke profil
			}
			return NextResponse.redirect(new URL("/admin/dashboard", req.url));
		}

		const requiredPermission = Object.entries(protectedRoutes).find(([route]) =>
			pathname.startsWith(route)
		)?.[1];

		if (requiredPermission) {
			const userPermissions =
				PERMISSIONS[userRole]?.[
					requiredPermission.resource as keyof (typeof PERMISSIONS)[typeof userRole]
				];

			if (
				!userPermissions ||
				!userPermissions.includes(requiredPermission.action)
			) {
				const url = req.nextUrl.clone();
				url.pathname = "/404";
				return NextResponse.rewrite(url);
			}
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: "/login",
		},
	}
);

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
