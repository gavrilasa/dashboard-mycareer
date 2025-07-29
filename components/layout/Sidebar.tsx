"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MenuGroup, NavItem } from "@/app/data/menu-items";
import { LogOut } from "lucide-react";

// Helper component for a single navigation link with updated styling
const NavLink = ({ href, icon, label, startsWith = false }: NavItem) => {
	const pathname = usePathname();
	const isActive = startsWith ? pathname.startsWith(href) : pathname === href;

	return (
		<li>
			<Link
				href={href}
				className={`group relative flex items-center gap-3 rounded-md p-3 text-sm font-medium duration-300 ease-in-out
          ${
						isActive
							? "bg-blue-100 text-blue-600" // Active link style
							: "text-gray-600 hover:bg-gray-100" // Inactive link style
					}`}
			>
				{icon}
				{label}
			</Link>
		</li>
	);
};

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (isOpen: boolean) => void;
	menuGroups: MenuGroup[];
}

export const Sidebar: React.FC<SidebarProps> = ({
	sidebarOpen,
	setSidebarOpen,
	menuGroups,
}) => {
	const trigger = useRef<HTMLButtonElement>(null);
	const sidebar = useRef<HTMLElement>(null);

	// Effect to close sidebar on outside click
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target as Node) ||
				trigger.current.contains(target as Node)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white border-r border-gray-200 duration-300 ease-linear lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
		>
			{/* Sidebar Header */}
			<div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
				<Link href="/dashboard">
					<Image
						src="/IndofoodCBP-Logo-ND.webp"
						alt="Logo"
						width={186}
						height={64}
						priority
					/>
				</Link>
				<button
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls="sidebar"
					aria-expanded={sidebarOpen}
					className="block lg:hidden"
				>
					{/* Hamburger icon can be placed here if needed */}
				</button>
			</div>

			{/* Sidebar Menu */}
			<div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
				<nav className="px-4">
					{menuGroups.map((group) => (
						<div key={group.title}>
							<h3 className="mb-2 ml-2 text-xs font-semibold text-gray-400 uppercase">
								{group.title}
							</h3>
							<ul className="mb-6 flex flex-col gap-1">
								{group.items.map((item) => (
									<NavLink key={item.label} {...item} />
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>

			{/* Sidebar Footer */}
			<div className="mt-auto p-4">
				<button
					onClick={() => signOut({ callbackUrl: "/login" })}
					className="flex w-full items-center justify-center gap-3 rounded-md border border-red-600 px-4 py-2 text-base font-medium text-red-600 duration-200 hover:bg-red-600 hover:text-white"
				>
					<LogOut size={16} />
					<span>Sign Out</span>
				</button>
			</div>
		</aside>
	);
};
