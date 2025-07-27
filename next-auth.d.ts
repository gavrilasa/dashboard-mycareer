// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			role: string;
			nik: string;
			branch: string | undefined; // Ubah di sini
			dept: string | undefined; // Ubah di sini
		} & DefaultSession["user"];
	}

	interface User {
		role: string;
		nik: string;
		branch: string | undefined; // Ubah di sini
		dept: string | undefined; // Ubah di sini
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
		nik: string;
		branch: string | undefined; // Ubah di sini
		dept: string | undefined; // Ubah di sini
	}
}
