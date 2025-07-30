// types/next-auth.d.ts

import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the built-in session and user types
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: Role;
			employeeId: string | null;
		} & DefaultSession["user"]; // Keep the default properties
	}

	interface User extends DefaultUser {
		role: Role;
		employeeId: string | null;
	}
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		role: Role;
		employeeId: string | null;
	}
}
