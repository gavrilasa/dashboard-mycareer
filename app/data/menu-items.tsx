import {
	LayoutDashboard,
	Briefcase,
	ClipboardList,
	Network,
	User,
	Users,
	Building2,
	Building,
	BarChart3,
	UserCog,
} from "lucide-react";
import { UserRole } from "@prisma/client";

export type NavItem = {
	href: string;
	icon: React.ReactNode;
	label: string;
	startsWith?: boolean;
};

export type MenuGroup = {
	title: string;
	items: NavItem[];
};

const getAdminMenu = (): MenuGroup[] => [
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
				icon: <Building2 size={18} />,
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

// Fungsi ini akan menghasilkan menu untuk karyawan
const getEmployeeMenu = (): MenuGroup[] => [
	{
		title: "MENU",
		items: [
			{
				href: "/dashboard",
				icon: <LayoutDashboard size={18} />,
				label: "Dashboard",
			},
			{
				href: `/dashboard/form`,
				icon: <User size={18} />,
				label: "Form",
			},
			{
				href: "/dashboard/questionnaire",
				icon: <ClipboardList size={18} />,
				label: "Questionnaire",
			},
			{
				href: "/dashboard/job-vacant",
				icon: <Briefcase size={18} />,
				label: "Job Vacant",
			},
		],
	},
];

// Fungsi utama untuk mendapatkan menu berdasarkan peran
export const getMenuItems = (role: UserRole): MenuGroup[] => {
	switch (role) {
		case UserRole.HR:
		case UserRole.HD:
			return getAdminMenu();
		case UserRole.EMPLOYEE:
			return getEmployeeMenu();
		default:
			return [];
	}
};
