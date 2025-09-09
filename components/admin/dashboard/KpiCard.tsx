// components/admin/dashboard/KpiCard.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
	title: string;
	value: string | number;
	icon: React.ElementType;
	isLoading: boolean;
	className?: string;
}

export function KpiCard({
	title,
	value,
	icon: Icon,
	isLoading,
	className,
}: KpiCardProps) {
	if (isLoading) {
		return (
			<Card className={cn(className)}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<Skeleton className="h-5 w-3/5" />
					<Skeleton className="h-6 w-6 rounded-sm" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-8 w-1/2" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn(className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className="h-5 w-5 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}
