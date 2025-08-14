"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-slate-900">
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
			<div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				<main>
					<div className="px-4 mx-auto max-w-screen-2xl md:px-6 2xl:px-10">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
