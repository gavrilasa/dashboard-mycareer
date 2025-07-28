"use client";

import Sidebar from "../../components/layout/Sidebar";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar />
			<main className="flex-1 overflow-auto">
				<div className="px-8 py-12">{children}</div>
			</main>
		</div>
	);
}
