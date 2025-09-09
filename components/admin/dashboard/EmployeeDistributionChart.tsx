// components/admin/dashboard/EmployeeDistributionChart.tsx

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

interface EmployeeDistributionChartProps {
	data: NameValueData[];
	isLoading: boolean;
	title: string;
	description: string;
}

export function EmployeeDistributionChart({
	data,
	isLoading,
	title,
	description,
}: EmployeeDistributionChartProps) {
	if (isLoading) {
		return (
			<Card>
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

	const formatYAxisLabel = (name: string) => {
		const prefix = "ICBP-Noodle ";
		if (name.startsWith(prefix)) {
			return name.substring(prefix.length);
		}
		return name;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div style={{ width: "100%", height: 300 }}>
					<ResponsiveContainer>
						{data && data.length > 0 ? (
							<BarChart
								data={data}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								{" "}
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis
									dataKey="name"
									type="category"
									angle={-30}
									textAnchor="end"
									height={60}
									tickFormatter={formatYAxisLabel}
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									type="number"
									allowDecimals={false}
									width={30}
									tick={{ fontSize: 14 }}
								/>
								<Tooltip
									cursor={{ fill: "#f3f4f6" }}
									contentStyle={{
										borderRadius: "0.5rem",
										borderColor: "#e5e7eb",
									}}
									formatter={(value: number) => [value, "Jumlah"]}
								/>
								<Bar dataKey="value" fill="#3b82f6" barSize={30} />
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
