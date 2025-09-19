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
import { AlertCircle, CheckCircle2, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface Questionnaire {
	id: string;
	title: string;
	description: string | null;
	isCompleted: boolean;
}

const PageHeader = () => (
	<div>
		<h1 className="text-2xl font-bold tracking-tight">Kuesioner Kompetensi</h1>
		<p className="mt-2 text-base text-muted-foreground">
			Lengkapi kuesioner di bawah ini untuk membantu kami memetakan kompetensi
			Anda dan merancang jalur karier yang lebih baik.
		</p>
	</div>
);

const LoadingState = () => (
	<div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
		{[...Array(3)].map((_, i) => (
			<Card key={i} className="flex flex-col">
				<CardHeader className="flex-grow">
					<Skeleton className="w-3/4 h-6" />
					<Skeleton className="w-full h-4 mt-2" />
					<Skeleton className="w-1/2 h-4 mt-1" />
				</CardHeader>
				<CardFooter>
					<Skeleton className="h-6 w-28" />
				</CardFooter>
			</Card>
		))}
	</div>
);

const ErrorState = ({ message }: { message: string }) => (
	<Alert variant="destructive" className="mt-6">
		<AlertCircle className="w-4 h-4" />
		<AlertTitle>Gagal Memuat Data</AlertTitle>
		<AlertDescription>
			{message || "Terjadi kesalahan saat mengambil data kuesioner."}
		</AlertDescription>
	</Alert>
);

const EmptyState = () => (
	<div className="py-16 mt-6 text-center border-2 border-dashed rounded-lg">
		<FileQuestion className="w-12 h-12 mx-auto text-muted-foreground" />
		<h3 className="mt-4 text-lg font-semibold">Tidak Ada Kuesioner Tersedia</h3>
		<p className="mt-2 text-sm text-muted-foreground">
			Saat ini tidak ada kuesioner yang perlu Anda isi.
		</p>
	</div>
);

const QuestionnaireList = ({
	questionnaires,
}: {
	questionnaires: Questionnaire[];
}) => (
	<div className="grid gap-4 mt-6 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
		{questionnaires.map((q) => (
			<Link
				href={q.isCompleted ? "#" : `/questionnaire/${q.id}`}
				key={q.id}
				className={cn(
					"rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
					q.isCompleted && "pointer-events-none"
				)}
				aria-disabled={q.isCompleted}
			>
				<Card
					className={cn(
						"flex h-full flex-col transition-all",
						q.isCompleted
							? "bg-muted/50 border-dashed"
							: "hover:border-primary hover:shadow-md"
					)}
				>
					<CardHeader className="flex-grow">
						<CardTitle className="leading-normal">{q.title}</CardTitle>
						<CardDescription className="mt-1">
							{q.description || "Tidak ada deskripsi."}
						</CardDescription>
					</CardHeader>
					<CardFooter>
						{q.isCompleted ? (
							<Badge variant="default" className="bg-green-600">
								<CheckCircle2 className="w-4 h-4 mr-1" />
								Selesai
							</Badge>
						) : (
							<Badge variant="secondary">Belum Dikerjakan</Badge>
						)}
					</CardFooter>
				</Card>
			</Link>
		))}
	</div>
);

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
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Terjadi kesalahan yang tidak diketahui.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchQuestionnaires();
	}, []);

	const renderContent = () => {
		if (isLoading) {
			return <LoadingState />;
		}
		if (error) {
			return <ErrorState message={error} />;
		}
		if (questionnaires.length === 0) {
			return <EmptyState />;
		}
		return <QuestionnaireList questionnaires={questionnaires} />;
	};

	return (
		<div className="container py-10 mx-auto">
			<PageHeader />
			{renderContent()}
		</div>
	);
}
