import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client"; // Impor UserRole

declare module "next-auth" {
	interface Session {
		user: {
			employeeId: string;
			role: UserRole;
			branchId: string | null;
			departmentId: string | null;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		role: UserRole;
		branchId: string | null;
		departmentId: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		// 'id' akan berisi employeeId
		id: string;
		role: UserRole;
		branchId: string | null;
		departmentId: string | null;
	}
}
