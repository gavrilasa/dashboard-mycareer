// gavrilasa/dashboard-mycareer/dashboard-mycareer-162a70bf8004855e15a6dc4128b4ff1965ccd702/middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PERMISSIONS, Resource, Action } from "@/lib/permissions";
import { Role } from "@prisma/client";

const protectedRoutes: Record<string, { resource: Resource; action: Action }> =
	{
		"/admin": { resource: "dashboard", action: "read" },
		"/admin/employees": { resource: "employee", action: "read" },
		"/admin/positions": { resource: "position", action: "read" },
		"/admin/departments": { resource: "department", action: "read" },
		"/admin/branches": { resource: "branch", action: "read" },
		"/admin/users": { resource: "userManagement", action: "read" },
		"/admin/career-path": { resource: "careerPath", action: "read" },
		"/dashboard": { resource: "dashboard", action: "read" },
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

		// 1. Redirect admin, HR, dan HD jika mencoba akses dashboard karyawan
		if (
			pathname.startsWith("/dashboard") &&
			(userRole === "ADMIN" || userRole === "HR_BRANCH" || userRole === "HD")
		) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		// 2. Redirect karyawan jika mencoba akses halaman admin
		if (pathname.startsWith("/admin") && userRole === "EMPLOYEE") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}

		// 3. Logika redirect setelah login atau saat mengakses root path
		if (pathname === "/login" || pathname === "/") {
			if (userRole === "EMPLOYEE") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
			return NextResponse.redirect(new URL("/admin", req.url));
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
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
