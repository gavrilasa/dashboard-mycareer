import { cn } from "@/app/lib/utils";
import React from "react";

interface HeaderProps {
	title: string;
	description?: string;
	className?: string;
	children?: React.ReactNode;
}

export default function Header({
	title,
	description,
	className,
	children,
}: HeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center justify-between gap-4",
				className
			)}
		>
			<div>
				<h1 className="text-3xl font-bold text-primary">{title}</h1>
				{description && (
					<p className="mt-2 text-secondary dark:text-gray-400">
						{description}
					</p>
				)}
			</div>
			{children && <div>{children}</div>}
		</div>
	);
}
