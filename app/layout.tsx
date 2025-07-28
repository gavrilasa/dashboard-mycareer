// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/AuthProvider"; // 1. Impor provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MyCareer Dashboard",
	description: "Employee career management",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{/* 2. Bungkus children dengan AuthProvider */}
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
