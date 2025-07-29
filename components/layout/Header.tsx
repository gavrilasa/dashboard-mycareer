"use client";

import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

interface HeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (isOpen: boolean) => void;
	title?: string;
}

export const Header: React.FC<HeaderProps> = ({
	sidebarOpen,
	setSidebarOpen,
}) => {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-40 flex w-full dark:bg-gray-800 dark:border-b dark:border-gray-700">
			<div className="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-11">
				<div className="flex items-center gap-2 sm:gap-4">
					{/* */}
					<button
						aria-controls="sidebar"
						onClick={(e) => {
							e.stopPropagation();
							setSidebarOpen(!sidebarOpen);
						}}
						className="block rounded-sm border border-gray-200 bg-white p-1.5 shadow-sm lg:hidden dark:border-gray-600 dark:bg-gray-700"
					>
						<Menu className="h-5 w-5" />
					</button>
				</div>
			</div>
		</header>
	);
};
