"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { getMenuItems } from "../data/menu-items";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserRole } from "@prisma/client";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { data: session } = useSession();

	// Tentukan menu items di sisi client setelah sesi tersedia
	const userRole = session?.user?.role as UserRole;
	const menuItems = userRole ? getMenuItems(userRole) : [];

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
			<Sidebar
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
				menuGroups={menuItems}
			/>
			<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
				<Header
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					title="My Career Dashboard"
				/>
				<main>
					<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
