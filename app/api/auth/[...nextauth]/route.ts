import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
