"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
	adminMenuGroups,
	employeeMenuGroups,
	NavItem,
} from "@/data/menu-items";
import { LogOut } from "lucide-react";
import { PERMISSIONS, Resource, Action } from "@/lib/permissions";
import { Role } from "@prisma/client";

const hasPermission = (
	role: Role,
	permission: { resource: Resource; action: Action }
): boolean => {
	const userPermissions =
		PERMISSIONS[role]?.[
			permission.resource as keyof (typeof PERMISSIONS)[typeof role]
		];
	return userPermissions?.includes(permission.action) ?? false;
};

const NavLink = ({ href, icon, label, startsWith = false }: NavItem) => {
	const pathname = usePathname();
	const isActive = startsWith ? pathname.startsWith(href) : pathname === href;
	return (
		<li>
			<Link
				href={href}
				className={`group relative flex items-center gap-3 rounded-md p-3 text-sm font-medium duration-300 ease-in-out ${
					isActive
						? "bg-blue-100 text-blue-600"
						: "text-gray-600 hover:bg-gray-100"
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
}

export const Sidebar: React.FC<SidebarProps> = ({
	sidebarOpen,
	setSidebarOpen,
}) => {
	const { data: session } = useSession();
	const trigger = useRef<HTMLButtonElement>(null);
	const sidebar = useRef<HTMLElement>(null);

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

	const filteredMenuGroups = useMemo(() => {
		const userRole = session?.user?.role;
		if (!userRole) return [];

		const sourceMenu =
			userRole === "EMPLOYEE" ? employeeMenuGroups : adminMenuGroups;

		return sourceMenu
			.map((group) => {
				const accessibleItems = group.items.filter((item) =>
					item.permission ? hasPermission(userRole, item.permission) : true
				);
				return { ...group, items: accessibleItems };
			})
			.filter((group) => group.items.length > 0);
	}, [session]);

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white border-r border-gray-200 duration-300 ease-linear lg:static lg:translate-x-0 ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full"
			}`}
		>
			<div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
				<Link href="/">
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
				/>
			</div>

			<div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
				<nav className="px-4">
					{filteredMenuGroups.map((group) => (
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
