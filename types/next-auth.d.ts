// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			employeeId: string;
			role: string;
			branchId: string | null;
			departmentId: string | null;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		role: string;
		branchId: string | null;
		departmentId: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role: string;
		branchId: string | null;
		departmentId: string | null;
	}
}
