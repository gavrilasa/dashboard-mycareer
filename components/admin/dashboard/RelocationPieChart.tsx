// components/admin/dashboard/RelocationPieChart.tsx

"use client";

import React, { useState, useMemo } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NameValueData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface RelocationPieChartProps {
	data: NameValueData[];
	isLoading: boolean;
	className?: string;
}

const COLORS: { [key: string]: string } = {
	"Ya, Bersedia": "#22c55e", // green-500
	"Tidak Bersedia": "#ef4444", // red-500
	"Belum Mengisi": "#a1a1aa", // zinc-400
};

export function RelocationPieChart({
	data,
	isLoading,
	className,
}: RelocationPieChartProps) {
	const [includeNotFilled, setIncludeNotFilled] = useState(false);

	const chartData = useMemo(() => {
		if (includeNotFilled) {
			return data;
		}
		return data.filter((entry) => entry.name !== "Belum Mengisi");
	}, [data, includeNotFilled]);

	if (isLoading) {
		return (
			<Card className={cn("h-full", className)}>
				<CardHeader>
					<Skeleton className="h-6 w-3/5" />
					<Skeleton className="h-4 w-4/5" />
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<Skeleton className="h-64 w-64 rounded-full" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("h-full flex flex-col", className)}>
			<CardHeader>
				<CardTitle>Kesediaan Pindah Lokasi</CardTitle>
				<CardDescription>
					Distribusi kesediaan karyawan untuk relokasi.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div style={{ width: "100%", height: 280, fontSize: 14 }}>
					<ResponsiveContainer>
						{data && data.length > 0 ? (
							<PieChart>
								<Tooltip
									cursor={{ fill: "#f3f4f6" }}
									contentStyle={{
										borderRadius: "0.5rem",
										borderColor: "#e5e7eb",
									}}
								/>
								<Legend iconType="circle" />
								<Pie
									data={chartData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
									nameKey="name"
								>
									{chartData.map((entry) => (
										<Cell
											key={`cell-${entry.name}`}
											fill={COLORS[entry.name] || "#000000"}
										/>
									))}
								</Pie>
							</PieChart>
						) : (
							<div className="flex items-center justify-center h-full text-sm text-muted-foreground">
								Tidak ada data untuk ditampilkan.
							</div>
						)}
					</ResponsiveContainer>
				</div>
				<div className="flex items-center space-x-2 justify-center mt-4">
					<Checkbox
						id="include-not-filled"
						checked={includeNotFilled}
						onCheckedChange={(checked) => setIncludeNotFilled(!!checked)}
					/>
					<Label
						htmlFor="include-not-filled"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Sertakan yang Belum Mengisi
					</Label>
				</div>
			</CardContent>
		</Card>
	);
}
