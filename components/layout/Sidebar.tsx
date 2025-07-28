"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
	LayoutDashboard,
	Briefcase,
	ClipboardList,
	Network,
	Users,
	Building,
	BarChart3,
	UserCog,
	LogOut,
	Factory,
} from "lucide-react";

type NavItem = {
	href: string;
	icon: React.ReactNode;
	label: string;
	startsWith?: boolean;
};

const menuGroups = [
	{
		title: "MENU",
		items: [
			{
				href: "/dashboard",
				icon: <LayoutDashboard size={18} />,
				label: "Dashboard",
			},
			{
				href: "/dashboard/job-vacant",
				icon: <Briefcase size={18} />,
				label: "Job Vacant",
			},
			{
				href: "/dashboard/questionnaire",
				icon: <ClipboardList size={18} />,
				label: "Questionnaire",
			},
			{
				href: "/dashboard/career-path",
				icon: <Network size={18} />,
				label: "Career Path",
			},
		],
	},
	{
		title: "DATABASE",
		items: [
			{
				href: "/dashboard/employees",
				icon: <Users size={18} />,
				label: "Employees",
				startsWith: true,
			},
			{
				href: "/dashboard/positions",
				icon: <BarChart3 size={18} />,
				label: "Positions",
			},
			{
				href: "/dashboard/departments",
				icon: <Factory size={18} />,
				label: "Departments",
			},
			{
				href: "/dashboard/branches",
				icon: <Building size={18} />,
				label: "Branches",
			},
		],
	},
	{
		title: "OTHERS",
		items: [
			{
				href: "/dashboard/account-control",
				icon: <UserCog size={18} />,
				label: "Account Control",
			},
		],
	},
];

const NavLink = ({ href, icon, label, startsWith = false }: NavItem) => {
	const pathname = usePathname();
	const isActive = startsWith ? pathname.startsWith(href) : pathname === href;

	return (
		<li>
			<Link
				href={href}
				className={`group relative text-sm flex items-center gap-3 rounded-md p-3 font-medium duration-300 ease-in-out
          ${
						isActive
							? "bg-blue-200 text-primary" // Gaya untuk item aktif
							: "text-gray-600 hover:bg-gray-100" // Gaya untuk item non-aktif
					}`}
			>
				{icon}
				{label}
			</Link>
		</li>
	);
};

const Sidebar = () => {
	return (
		<aside className="absolute top-0 left-0 z-50 flex flex-col h-screen overflow-y-hidden duration-300 ease-linear bg-white border-r border-gray-200 w-72 lg:static lg:translate-x-0">
			{/* Sidebar Header */}
			<div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
				<Link href="/dashboard">
					<Image
						src="/IndofoodCBP-Logo-ND.webp"
						alt="Logo"
						width={186}
						height={64}
						className="object-fit"
						priority
					/>
				</Link>
			</div>

			{/* Sidebar Menu */}
			<div className="flex flex-col overflow-hidden duration-300 ease-linear">
				<nav className="px-4">
					{menuGroups.map((group) => (
						<div key={group.title}>
							<h3 className="mb-2 ml-2 text-xs font-semibold text-gray-400 uppercase">
								{group.title}
							</h3>
							<ul className="flex flex-col gap-1 mb-6">
								{group.items.map((item) => (
									<NavLink key={item.label} {...item} />
								))}
							</ul>
						</div>
					))}
				</nav>
			</div>

			{/* Sidebar Footer */}
			<div className="p-4 mt-auto">
				<button
					onClick={() => signOut({ callbackUrl: "/login" })}
					className="flex items-center justify-center w-full gap-3 px-4 py-2 text-base font-medium text-red-600 duration-200 border-red-600 rounded-md cursor-pointer border-1 hover:bg-red-600 hover:text-white"
				>
					<LogOut size={16} />
					<span className="text-base">Sign Out</span>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
