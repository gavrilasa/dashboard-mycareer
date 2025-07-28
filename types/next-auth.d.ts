// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			employeeId: string;
			role: string;
			branchId: string | null;
			departmentId: string | null;
		} & DefaultSession["user"];
	}

	interface User {
		role: string;
		branchId: string | null;
		departmentId: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		employeeId: string;
		role: string;
		branchId: string | null;
		departmentId: string | null;
	}
}
