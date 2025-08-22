"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Definisikan tipe data untuk respons API agar lebih aman
interface Questionnaire {
	id: string;
	title: string;
	description: string | null;
	isCompleted: boolean;
}

export default function QuestionnairePage() {
	const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchQuestionnaires = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const res = await fetch("/api/employee/questionnaires");

				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.message || "Gagal memuat data kuesioner.");
				}

				const data: Questionnaire[] = await res.json();
				setQuestionnaires(data);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchQuestionnaires();
	}, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen dimuat

	// 1. Tampilan saat data sedang dimuat
	if (isLoading) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Kuesioner Kompetensi</h1>
				<p className="text-muted-foreground">
					Silakan lengkapi kuesioner di bawah ini untuk pemetaan kompetensi
					Anda.
				</p>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full mt-2" />
								<Skeleton className="h-4 w-1/2 mt-1" />
							</CardHeader>
							<CardFooter>
								<Skeleton className="h-6 w-28" />
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		);
	}

	// 2. Tampilan jika terjadi error saat memuat data
	if (error) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Kuesioner Kompetensi</h1>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Gagal Memuat Data</AlertTitle>
					<AlertDescription>
						{error || "Terjadi kesalahan saat mengambil data kuesioner."}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	// 3. Tampilan jika data berhasil dimuat
	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Kuesioner Kompetensi</h1>
			<p className="text-muted-foreground">
				Silakan lengkapi kuesioner di bawah ini untuk pemetaan kompetensi Anda.
			</p>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{questionnaires.map((q) => {
					const cardContent = (
						<Card
							key={q.id}
							className={
								q.isCompleted
									? "bg-muted/50"
									: "hover:border-primary transition-colors"
							}
						>
							<CardHeader>
								<CardTitle>{q.title}</CardTitle>
								<CardDescription>
									{q.description || "Tidak ada deskripsi."}
								</CardDescription>
							</CardHeader>
							<CardFooter>
								{q.isCompleted ? (
									<Badge variant="default">
										<CheckCircle2 className="mr-1 h-4 w-4" />
										Selesai
									</Badge>
								) : (
									<Badge variant="secondary">Belum Dikerjakan</Badge>
								)}
							</CardFooter>
						</Card>
					);

					if (q.isCompleted) {
						return cardContent; // Jika sudah selesai, kartu tidak bisa diklik
					}

					return (
						<Link
							href={`/questionnaire/${q.id}`}
							key={q.id}
							className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
						>
							{cardContent}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
