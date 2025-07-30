// File: middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	// The middleware function now has one simple job: inject user data.
	function middleware(req) {
		const { token } = req.nextauth;

		// Create new headers and add the user's data.
		const requestHeaders = new Headers(req.headers);
		if (token?.employeeId) {
			requestHeaders.set("x-user-employee-id", token.employeeId as string);
		}
		if (token?.role) {
			requestHeaders.set("x-user-role", token.role as string);
		}

		// Pass the request through to the correct API route or page,
		// but with the new headers attached.
		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	},
	{
		callbacks: {
			// This is the gatekeeper. If the user is not logged in (no token),
			// they will be redirected to the sign-in page.
			authorized: ({ token }) => !!token,
		},
	}
);

// This config ensures the middleware runs on all dashboard pages and API routes.
// This is the only "permission" check needed at the middleware level.
export const config = {
	matcher: ["/dashboard/:path*", "/api/admin/:path*", "/api/employee/:path*"],
};
