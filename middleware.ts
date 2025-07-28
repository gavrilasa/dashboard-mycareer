import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { UserRole } from "@prisma/client";

// Definisikan tipe untuk aturan izin agar konsisten
type PermissionRule = {
	allowedRoles: UserRole[]; // Tipe harus array dari UserRole
	allowOwner: boolean;
};

// Definisikan tipe untuk objek konfigurasi utama
type PermissionConfig = {
	[path: string]: PermissionRule;
};

// Terapkan tipe pada objek konfigurasi untuk mencegah penyimpulan tipe yang terlalu sempit
const permissionConfig: PermissionConfig = {
	"/api/employees": {
		allowedRoles: [UserRole.HR, UserRole.HD],
		allowOwner: true,
	},
	"/api/master-data": {
		allowedRoles: [UserRole.HR],
		allowOwner: false,
	},
};

export default withAuth(
	function middleware(req) {
		const { pathname } = req.nextUrl;
		const token = req.nextauth.token;

		if (!token) {
			return new NextResponse("Authentication required", { status: 401 });
		}

		const matchedPath = Object.keys(permissionConfig).find((path) =>
			pathname.startsWith(path)
		) as keyof typeof permissionConfig | undefined;

		if (!matchedPath) {
			return new NextResponse("No permission rule found for this path", {
				status: 403,
			});
		}

		const rule = permissionConfig[matchedPath];

		// Cek otorisasi berdasarkan peran
		if (rule.allowedRoles.includes(token.role as UserRole)) {
			return NextResponse.next();
		}

		// Cek otorisasi berdasarkan kepemilikan
		if (rule.allowOwner) {
			const targetEmployeeId = pathname.split("/")[3];
			if (token.id === targetEmployeeId) {
				return NextResponse.next();
			}
		}

		// Tolak akses jika tidak ada kondisi yang terpenuhi
		return new NextResponse(
			"Forbidden: You do not have permission to access this resource.",
			{ status: 403 }
		);
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/api/:path*"],
};
