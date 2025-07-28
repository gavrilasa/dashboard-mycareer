// app/components/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProviderProps {
	children: React.ReactNode;
}

/**
 * Komponen ini berfungsi sebagai wrapper untuk menyediakan
 * sesi autentikasi ke seluruh aplikasi menggunakan SessionProvider dari NextAuth.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
	return <SessionProvider>{children}</SessionProvider>;
}
