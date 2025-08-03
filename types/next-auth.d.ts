import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			role: Role;
			employeeId?: string | null;
			branchId?: string | null;
			departmentId?: string | null;
		} & DefaultSession["user"];
	}
	interface User extends DefaultUser {
		role: Role;
		employeeId?: string | null;
		branchId?: string | null;
		departmentId?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role: Role;
		employeeId?: string | null;
		branchId?: string | null;
		departmentId?: string | null;
	}
}
