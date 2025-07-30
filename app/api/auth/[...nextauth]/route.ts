// app/api/auth/[...nextauth]/route.ts

import { prisma } from "@/app/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				employeeId: { label: "Employee ID", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.employeeId || !credentials?.password) {
					throw new Error("Please enter an Employee ID and Password.");
				}

				const user = await prisma.user.findUnique({
					where: { employeeId: credentials.employeeId },
					include: {
						employee: {
							select: { fullName: true },
						},
					},
				});

				if (!user || !user.employee) {
					throw new Error("No user found with this Employee ID.");
				}

				// The provided password IS the string to be compared (e.g., "EMP001TGR04041995")
				const plainTextPassword = credentials.password;

				// Compare the provided password with the hashed password in the DB
				const isPasswordCorrect = await bcrypt.compare(
					plainTextPassword,
					user.password
				);

				if (!isPasswordCorrect) {
					throw new Error("The password you entered is incorrect.");
				}

				return {
					id: user.id,
					employeeId: user.employeeId,
					role: user.role,
					name: user.employee.fullName,
					email: null,
					image: null,
				};
			},
		}),
	],
	callbacks: {
		session({ session, token }) {
			if (session.user) {
				session.user.role = token.role;
				session.user.employeeId = token.employeeId;
			}
			return session;
		},
		jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.employeeId = user.employeeId;
			}
			return token;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
	pages: {
		signIn: "/login", // Use /login as the sign-in page
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
