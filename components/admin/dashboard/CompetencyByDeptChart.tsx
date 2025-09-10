// components/admin/dashboard/CompetencyByDeptChart.tsx

"use client";

import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NameValueData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface CompetencyByDeptChartProps {
	data: NameValueData[];
	isLoading: boolean;
	className?: string;
}

export function CompetencyByDeptChart({
	data,
	isLoading,
	className,
}: CompetencyByDeptChartProps) {
	if (isLoading) {
		return (
			<Card className={cn("h-full", className)}>
				<CardHeader>
					<Skeleton className="h-6 w-3/5" />
					<Skeleton className="h-4 w-4/5" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-64 w-full" />
				</CardContent>
			</Card>
		);
	}

	const formatXAxisTick = (value: number) => value.toFixed(2);

	return (
		<Card className={cn("flex flex-col", className)}>
			<CardHeader>
				<CardTitle>Rata-rata Skor Kompetensi per Departemen</CardTitle>
				<CardDescription>
					Perbandingan skor rata-rata kompetensi di setiap departemen.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div style={{ width: "100%", height: 500 }}>
					<ResponsiveContainer>
						{data && data.length > 0 ? (
							<BarChart data={data} layout="vertical" margin={{ left: 20 }}>
								<CartesianGrid strokeDasharray="3 3" horizontal={false} />
								<XAxis
									type="number"
									domain={[0, 5]}
									allowDecimals={false}
									tickFormatter={formatXAxisTick}
									tick={{ fontSize: 12 }}
								/>
								<YAxis
									type="category"
									dataKey="name"
									width={80}
									tickLine={false}
									axisLine={false}
									fontSize={12}
								/>
								<Tooltip
									cursor={{ fill: "#f3f4f6" }}
									contentStyle={{
										borderRadius: "0.5rem",
										borderColor: "#e5e7eb",
									}}
									formatter={(value: number) => [
										value.toFixed(2),
										"Rata-rata Skor",
									]}
								/>
								<Bar
									dataKey="value"
									fill="#3b82f6"
									barSize={30}
									radius={[0, 4, 4, 0]}
								/>
							</BarChart>
						) : (
							<div className="flex items-center justify-center h-full text-sm text-muted-foreground">
								Tidak ada data untuk ditampilkan.
							</div>
						)}
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
