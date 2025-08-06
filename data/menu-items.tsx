import {
	LayoutDashboard,
	Users,
	Building2,
	Network,
	FileText,
	ClipboardCheck,
	Search,
	Route,
	CircleUser,
	ShieldUser,
	NotepadText,
} from "lucide-react";
import { Resource, Action } from "@/lib/permissions";

export interface NavItem {
	href: string;
	icon: React.ReactNode;
	label: string;
	startsWith?: boolean;
	permission?: {
		resource: Resource;
		action: Action;
	};
}

export interface MenuGroup {
	title: string;
	items: NavItem[];
}

export const adminMenuGroups: MenuGroup[] = [
	{
		title: "Menu",
		items: [
			{
				href: "/admin",
				icon: <LayoutDashboard size={18} />,
				label: "Dashboard",
				permission: { resource: "dashboard", action: "read" },
			},
			{
				href: "/admin/forms",
				icon: <NotepadText size={18} />,
				label: "Form",
				permission: { resource: "form", action: "read" },
			},
			{
				href: "/admin/career-path",
				icon: <Route size={18} />,
				label: "Career Path",
				permission: { resource: "careerPath", action: "read" },
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
				permission: { resource: "employee", action: "read" },
			},
			{
				href: "/admin/positions",
				icon: <CircleUser size={18} />,
				label: "Positions",
				permission: { resource: "position", action: "read" },
			},
			{
				href: "/admin/departments",
				icon: <Network size={18} />,
				label: "Departments",
				permission: { resource: "department", action: "read" },
			},
			{
				href: "/admin/branches",
				icon: <Building2 size={18} />,
				label: "Branches",
				permission: { resource: "branch", action: "read" },
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				href: "/admin/users",
				icon: <ShieldUser size={18} />,
				label: "User Management",
				permission: { resource: "userManagement", action: "read" },
			},
		],
	},
];

export const employeeMenuGroups: MenuGroup[] = [
	{
		title: "Menu",
		items: [
			{
				href: "/dashboard",
				icon: <LayoutDashboard size={18} />,
				label: "Dashboard",
				permission: { resource: "dashboard", action: "read" },
			},
			{
				href: "/form",
				icon: <FileText size={18} />,
				label: "Form",
				permission: { resource: "form", action: "read" },
			},
			{
				href: "/questionnaire",
				icon: <ClipboardCheck size={18} />,
				label: "Questionnaires",
				permission: { resource: "questionnaire", action: "read" },
			},
			{
				href: "/job-vacant",
				icon: <Search size={18} />,
				label: "Job Vacant",
				permission: { resource: "jobVacant", action: "read" },
			},
		],
	},
];
