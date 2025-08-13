import {
	getServerSession,
	type NextAuthOptions,
	type Session,
	type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
/**
 * Mengambil session saat ini dari server.
 * Ini adalah fungsi utama untuk mendapatkan detail session di seluruh aplikasi.
 * @returns Promise yang resolve ke objek session atau null.
 */
export const auth = (): Promise<Session | null> => {
	return getServerSession(authOptions);
};

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				employeeId: { label: "Employee ID", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.employeeId || !credentials.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { employeeId: credentials.employeeId },
				});

				if (user && bcrypt.compareSync(credentials.password, user.password)) {
					return {
						id: user.id,
						employeeId: user.employeeId,
						role: user.role,
						branchId: user.branchId,
						departmentId: user.departmentId,
					};
				}
				return null;
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.employeeId = user.employeeId;
				token.branchId = user.branchId;
				token.departmentId = user.departmentId;
			}
			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.role = token.role;
				session.user.employeeId = token.employeeId;
				session.user.branchId = token.branchId;
				session.user.departmentId = token.departmentId;
			}
			return session;
		},
	},

	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
/**
 * Tipe spesifik untuk user yang digunakan dalam logika otorisasi.
 * Pastikan tipe User di next-auth.d.ts Anda memiliki properti ini.
 */
type UserForAuthorization = User & {
	role?: string | null;
	employeeId?: string | null;
};

/**
 * Memeriksa apakah seorang pengguna memiliki hak akses berdasarkan peran atau kepemilikan.
 * @param user Objek user dari session (session.user).
 * @param options Opsi untuk otorisasi.
 * @param options.allowedRoles Array berisi peran yang diizinkan.
 * @param options.targetEmployeeId ID dari resource karyawan yang sedang diakses.
 * @returns `true` jika diizinkan, sebaliknya `false`.
 */
export function isAuthorized(
	user: UserForAuthorization | undefined,
	options: {
		allowedRoles?: string[];
		targetEmployeeId?: string;
	}
): boolean {
	// Pengguna harus ada untuk bisa memiliki hak akses.
	if (!user?.role) {
		return false;
	}

	// Izinkan akses jika peran pengguna ada di dalam daftar peran yang diizinkan.
	if (options.allowedRoles && options.allowedRoles.includes(user.role)) {
		return true;
	}

	// Izinkan akses jika pengguna mengakses data miliknya sendiri.
	if (
		options.targetEmployeeId &&
		user.employeeId === options.targetEmployeeId
	) {
		return true;
	}

	// Tolak akses secara default.
	return false;
}
