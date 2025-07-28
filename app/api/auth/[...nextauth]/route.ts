// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				employeeId: { label: "ID Karyawan", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.employeeId || !credentials?.password) {
					return null;
				}

				// 1. Cari pengguna berdasarkan ID Karyawan (username)
				const user = await prisma.user.findUnique({
					where: { employeeId: credentials.employeeId },
				});

				if (!user) {
					return null; // Pengguna tidak ditemukan
				}

				// 2. Bandingkan password yang dikirim dari klien SECARA LANGSUNG
				//    (format: ID + Tanggal Lahir) dengan hash di database.
				const isPasswordValid = await bcrypt.compare(
					credentials.password, // Gunakan password dari input langsung
					user.password
				);

				if (!isPasswordValid) {
					return null; // Password tidak cocok
				}

				// 3. Jika validasi berhasil, kembalikan objek pengguna
				return {
					id: user.employeeId,
					employeeId: user.employeeId,
					name: user.name,
					email: user.email,
					role: user.role,
					branchId: user.branchId,
					departmentId: user.departmentId,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 24 * 60 * 60,
	},
	jwt: {
		maxAge: 24 * 60 * 60,
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.branchId = user.branchId;
				token.departmentId = user.departmentId;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.employeeId = token.id as string;
				session.user.role = token.role as string;
				session.user.branchId = token.branchId as string | null;
				session.user.departmentId = token.departmentId as string | null;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
