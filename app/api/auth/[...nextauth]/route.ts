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

				const user = await prisma.user.findUnique({
					where: { employeeId: credentials.employeeId },
					include: { employee: true },
				});

				if (!user || !user.employee) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: user.employeeId,
					name: user.employee.name,
					email: user.email,
					role: user.role,
					branchId: user.employee.personnelAreaId,
					departmentId: user.employee.departmentId,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
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
	pages: {
		signIn: "/login",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
