import React from "react";
import {
	LayoutDashboard,
	Users,
	Briefcase,
	Building2,
	GitBranch,
	Layers,
	FileText,
	ClipboardList,
} from "lucide-react";

export interface NavItem {
	href: string;
	icon: React.ReactNode;
	label: string;
	startsWith?: boolean; // To match parent routes like /admin/employees/*
}

export interface MenuGroup {
	title: string;
	items: NavItem[];
}

// Defines the navigation structure for the admin sidebar
export const adminMenuGroups: MenuGroup[] = [
	{
		title: "Menu",
		items: [
			{
				href: "/admin/dashboard",
				icon: <LayoutDashboard size={18} />,
				label: "Dashboard",
			},
			{
				href: "/admin/job-vacant",
				icon: <Briefcase size={18} />,
				label: "Job Vacant",
			},
			{
				href: "/admin/career-path",
				icon: <GitBranch size={18} />,
				label: "Career Path",
			},
			{
				href: "/admin/questionnaires",
				icon: <ClipboardList size={18} />,
				label: "Questionnaires",
				startsWith: true,
			},
			{
				href: "/admin/forms",
				icon: <FileText size={18} />,
				label: "Forms",
				startsWith: true,
			},
		],
	},
	{
		title: "Database",
		items: [
			{
				href: "/admin/employees",
				icon: <Users size={18} />,
				label: "Employees",
				startsWith: true,
			},
			{
				href: "/admin/positions",
				icon: <Layers size={18} />,
				label: "Positions",
				startsWith: true,
			},
			{
				href: "/admin/departments",
				icon: <Building2 size={18} />,
				label: "Departments",
				startsWith: true,
			},
			{
				href: "/admin/branches",
				icon: <GitBranch size={18} />,
				label: "Branches",
				startsWith: true,
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				href: "/admin/users",
				icon: <Users size={18} />,
				label: "Users",
				startsWith: true,
			},
		],
	},
];
