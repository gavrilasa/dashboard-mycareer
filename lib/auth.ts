// /lib/auth.ts
import {
	getServerSession,
	type NextAuthOptions,
	type Session,
	type User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

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
					if (user.role === Role.EMPLOYEE) {
						const employee = await prisma.employee.findUnique({
							where: { employeeId: credentials.employeeId },
							include: {
								level: true,
							},
						});

						if (employee?.level?.name.toUpperCase() !== "STAFF") {
							throw new Error(
								"Akun Anda belum diaktivasi untuk akses sistem. Hubungi Administrator"
							);
						}
					}
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

type UserForAuthorization = User & {
	role?: string | null;
	employeeId?: string | null;
};

export function isAuthorized(
	user: UserForAuthorization | undefined,
	options: {
		allowedRoles?: string[];
		targetEmployeeId?: string;
	}
): boolean {
	if (!user?.role) {
		return false;
	}

	if (options.allowedRoles && options.allowedRoles.includes(user.role)) {
		return true;
	}

	if (
		options.targetEmployeeId &&
		user.employeeId === options.targetEmployeeId
	) {
		return true;
	}

	return false;
}
