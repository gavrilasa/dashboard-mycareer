// /components/admin/dashboard/RecentJobInterests.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Inbox, User } from "lucide-react"; // [!code focus]

// Tipe data yang diharapkan dari API
interface RecentInterest {
	employeeId: string;
	employeeName: string;
	currentPosition: string;
}

export const RecentJobInterests = () => {
	const [data, setData] = useState<RecentInterest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					"/api/admin/dashboard/recent-job-interests"
				);
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.message || "Gagal mengambil data dari server."
					);
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const renderContent = () => {
		if (loading) {
			return (
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex items-center space-x-4">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-2 flex-1">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						</div>
					))}
				</div>
			);
		}

		if (error) {
			return (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Gagal Memuat Data</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			);
		}

		if (data.length === 0) {
			return (
				// [!code focus:start]
				// FIX: Gunakan flexbox untuk perataan atas
				<div className="flex flex-col items-center justify-start text-center text-sm text-gray-500 pt-8 space-y-2 h-full">
					<Inbox className="h-10 w-10 text-gray-400" />
					<p>Tidak ada aktivitas minat pekerjaan terbaru.</p>
				</div>
				// [!code focus:end]
			);
		}

		return (
			<div className="flex flex-col space-y-2">
				{data.map((interest) => (
					<Link
						key={interest.employeeId}
						href={`/admin/questionnaires/${interest.employeeId}`}
						className="flex items-center space-x-4 p-2 hover:bg-accent rounded-lg transition-colors"
					>
						{/* [!code focus:start] */}
						{/* FIX: Ikon disesuaikan dengan gaya Recent Activity */}
						<div className="p-2 bg-blue-100 rounded-full">
							<User className="h-5 w-5 text-blue-600" />
						</div>
						{/* [!code focus:end] */}
						<div className="overflow-hidden">
							<p className="font-semibold text-sm truncate">
								{interest.employeeName}
							</p>
							<p className="text-xs text-muted-foreground truncate">
								{interest.currentPosition}
							</p>
						</div>
					</Link>
				))}
			</div>
		);
	};

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="gap-1">
				<CardTitle className="text-base font-semibold">
					Minat Pekerjaan Terbaru
				</CardTitle>
				<CardDescription>
					Daftar ketertarikan terakhir yang ada di departemen ini.
				</CardDescription>
			</CardHeader>
			{/* [!code focus:start] */}
			{/* FIX: Hapus flex-grow dan overflow-y-auto dari sini */}
			<CardContent className="px-4 pb-2 overflow-y-auto">
				{/* [!code focus:end] */}
				{renderContent()}
			</CardContent>
		</Card>
	);
};
