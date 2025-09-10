// components/admin/dashboard/QuestionnaireTrendChart.tsx

"use client";

import React from "react";
import {
	AreaChart, // Ganti LineChart menjadi AreaChart
	Area, // Ganti Line menjadi Area
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
import { DateCountData } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface QuestionnaireTrendChartProps {
	data: DateCountData[];
	isLoading: boolean;
	className?: string;
}

export function QuestionnaireTrendChart({
	data,
	isLoading,
	className,
}: QuestionnaireTrendChartProps) {
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

	return (
		<Card className={cn("h-full flex flex-col", className)}>
			<CardHeader>
				<CardTitle>Tren Pengisian Kuesioner</CardTitle>
				<CardDescription>
					Jumlah kuesioner yang diisi dari waktu ke waktu.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div style={{ width: "100%", height: 300 }}>
					<ResponsiveContainer>
						{data && data.length > 0 ? (
							<AreaChart
								data={data}
								margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
							>
								{/* Definisikan gradasi untuk area di bawah garis */}
								<defs>
									<linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" fontSize={12} tickLine={false} />
								<YAxis
									allowDecimals={false}
									// Atur ukuran font sumbu Y menjadi lebih kecil
									tick={{ fontSize: 10 }}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "0.5rem",
										borderColor: "#e5e7eb",
									}}
									// Ubah label "count" menjadi "Jumlah"
									formatter={(value: number) => [value, "Jumlah"]}
								/>
								<Area
									type="monotone"
									dataKey="count"
									stroke="#3b82f6"
									strokeWidth={2}
									// Isi area dengan gradasi yang telah didefinisikan
									fillOpacity={1}
									fill="url(#colorCount)"
									// Atur ukuran titik menjadi lebih kecil
									dot={{ r: 3, fill: "#3b82f6" }}
									activeDot={{ r: 5 }}
								/>
							</AreaChart>
						) : (
							<div className="flex items-center justify-center h-full text-sm text-muted-foreground">
								Tidak ada data untuk ditampilkan pada rentang ini.
							</div>
						)}
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
