"use client";

import React, { useState, useEffect, useMemo, ElementType } from "react";
import { useParams } from "next/navigation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertCircle,
	Lightbulb,
	Star,
	TrendingDown,
	TrendingUp,
	Minus,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/common/BackButton";

// --- Type Definitions ---
interface EmployeeInfo {
	fullName: string;
	position: { name: string };
	department: { name: string };
	branch: { name: string };
}

interface QuestionDetail {
	id: string;
	text: string;
	value: number;
}

interface SubCompetencyDetail {
	name: string;
	questions: QuestionDetail[];
	recommendations: string[];
}

interface CompetencyDetail {
	competency: string;
	questionnaireTitle: string;
	calculatedScore: number;
	standardScore: number;
	gap: number;
	recommendationNeeded: boolean;
	subCompetencies: SubCompetencyDetail[];
}

const isValidRecommendation = (
	rec: string | null | undefined
): rec is string => {
	return typeof rec === "string" && rec.trim().length > 0;
};

// --- Helper Components ---
const DetailCard = ({
	icon,
	title,
	value,
	className,
}: {
	icon: ElementType;
	title: string;
	value: string | number;
	className?: string;
}) => {
	const Icon = icon;
	return (
		<div
			className={cn(
				"flex flex-col p-4 border rounded-lg bg-slate-50",
				className
			)}
		>
			<div className="flex items-center text-sm font-medium text-slate-600">
				<Icon className="w-4 h-4 mr-2" />
				{title}
			</div>
			<p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
		</div>
	);
};

const ScoreBar = ({ score, standard }: { score: number; standard: number }) => {
	const max = 5;
	const scorePercentage = (score / max) * 100;
	const standardPercentage = (standard / max) * 100;
	return (
		<div className="w-full space-y-2 text-xs">
			<div className="flex justify-between items-center">
				<span className="font-semibold">Skor Karyawan: {score.toFixed(2)}</span>
				<div className="h-2 w-full max-w-[60%] bg-blue-100 rounded-full overflow-hidden">
					<div
						className="h-full bg-blue-500"
						style={{ width: `${scorePercentage}%` }}
					/>
				</div>
			</div>
			<div className="flex justify-between items-center">
				<span className="text-slate-600">
					Skor Standar: {standard.toFixed(2)}
				</span>
				<div className="h-2 w-full max-w-[60%] bg-gray-200 rounded-full overflow-hidden">
					<div
						className="h-full bg-gray-400"
						style={{ width: `${standardPercentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

const ScoreIndicator = ({ score }: { score: number }) => {
	if (score >= 4.0) {
		return <TrendingUp className="h-5 w-5 text-green-500" />;
	}
	if (score >= 3.0) {
		return <Minus className="h-5 w-5 text-amber-500" />;
	}
	return <TrendingDown className="h-5 w-5 text-red-500" />;
};

// --- Main Page Component ---
export default function ResultDetailPage() {
	const params = useParams();
	const employeeId = params.employeeId as string;

	const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo | null>(null);
	const [detailData, setDetailData] = useState<CompetencyDetail[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!employeeId) return;
			setIsLoading(true);
			setError(null);
			try {
				const [detailsRes, infoRes] = await Promise.all([
					fetch(`/api/admin/competency-results/${employeeId}`),
					fetch(`/api/admin/employees/${employeeId}`),
				]);

				if (!detailsRes.ok || !infoRes.ok) {
					const errorData = !detailsRes.ok
						? await detailsRes.json()
						: await infoRes.json();
					throw new Error(errorData.message || "Gagal memuat data detail.");
				}

				const details = await detailsRes.json();
				const info = await infoRes.json();

				setDetailData(details);
				setEmployeeInfo(info);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Terjadi kesalahan.";
				setError(errorMessage);
				toast.error("Gagal Memuat Data", { description: errorMessage });
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [employeeId]);

	const groupedData = useMemo(() => {
		if (!Array.isArray(detailData)) return {};
		return detailData.reduce((acc, competency) => {
			const title = competency.questionnaireTitle || "Kompetensi Lainnya";
			if (!acc[title]) {
				acc[title] = [];
			}
			acc[title].push(competency);
			return acc;
		}, {} as Record<string, CompetencyDetail[]>);
	}, [detailData]);

	const { overallAverageScore, strongestCompetency, mainDevelopmentArea } =
		useMemo(() => {
			if (!Array.isArray(detailData) || detailData.length === 0) {
				return {
					overallAverageScore: 0,
					strongestCompetency: "-",
					mainDevelopmentArea: "-",
				};
			}

			const allQuestions = detailData.flatMap((competency) =>
				competency.subCompetencies.flatMap((sub) => sub.questions)
			);

			if (allQuestions.length === 0) {
				return {
					overallAverageScore: 0,
					strongestCompetency: "-",
					mainDevelopmentArea: "-",
				};
			}

			const totalScore = allQuestions.reduce(
				(sum, question) => sum + question.value,
				0
			);

			const avg = totalScore / allQuestions.length;

			const sortedByScore = [...detailData].sort(
				(a, b) => b.calculatedScore - a.calculatedScore
			);
			const sortedByGap = [...detailData].sort((a, b) => a.gap - b.gap);

			return {
				overallAverageScore: avg,
				strongestCompetency: sortedByScore[0]?.competency || "-",
				mainDevelopmentArea:
					sortedByGap[0]?.gap < 0 ? sortedByGap[0]?.competency : "Tidak ada",
			};
		}, [detailData]);

	const allRecommendations = useMemo(() => {
		if (!Array.isArray(detailData)) return [];
		const recommendations = new Set<string>();
		detailData.forEach((comp) => {
			if (comp.recommendationNeeded) {
				comp.subCompetencies.forEach((sub) => {
					sub.recommendations.forEach((rec) => {
						if (isValidRecommendation(rec)) {
							recommendations.add(rec);
						}
					});
				});
			}
		});
		return Array.from(recommendations);
	}, [detailData]);

	if (isLoading) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="h-screen w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-10">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Gagal Memuat</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10 space-y-8">
			<BackButton className="mb-4" />

			<div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold">
						Detail Hasil Kompetensi: {employeeInfo?.fullName}
					</h1>
					<p className="text-lg text-muted-foreground">
						{employeeInfo?.position.name} - {employeeInfo?.department.name}
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<DetailCard
						icon={Star}
						title="Skor Rata-Rata"
						value={(Math.trunc(overallAverageScore * 100) / 100).toFixed(2)}
						className="bg-blue-50 border-blue-200"
					/>
					<DetailCard
						icon={TrendingDown}
						title="Area Pengembangan Utama"
						value={mainDevelopmentArea}
						className="bg-red-50 border-red-200"
					/>
					<DetailCard
						icon={Lightbulb}
						title="Kompetensi Terkuat"
						value={strongestCompetency}
						className="bg-green-50 border-green-200"
					/>
				</div>
			</div>

			<div className="space-y-6">
				{Object.entries(groupedData).map(([title, competencies]) => (
					<div key={title}>
						<h2 className="text-2xl font-semibold mb-4 border-b pb-2">
							{title}
						</h2>
						<Accordion type="multiple" className="w-full space-y-4">
							{competencies.map((competency) => (
								<AccordionItem
									value={competency.competency}
									key={competency.competency}
									className="bg-white rounded-lg border shadow-sm px-4"
								>
									<AccordionTrigger className="font-semibold text-lg hover:no-underline">
										<div className="flex items-center gap-4">
											<ScoreIndicator score={competency.calculatedScore} />
											<span>
												{competency.competency} - Skor:{" "}
												{competency.calculatedScore.toFixed(2)}
											</span>
										</div>
									</AccordionTrigger>
									<AccordionContent className="pt-4 pl-1">
										<div className="grid md:grid-cols-2 gap-4">
											{competency.subCompetencies.map((sub) => (
												<div
													key={sub.name}
													className="p-4 border rounded-md bg-slate-50 space-y-3"
												>
													<h4 className="font-semibold text-base">
														{sub.name}
													</h4>
													<ScoreBar
														score={competency.calculatedScore}
														standard={competency.standardScore}
													/>
													<Accordion
														type="single"
														collapsible
														className="w-full"
													>
														<AccordionItem
															value="questions"
															className="border-b-0"
														>
															<AccordionTrigger className="text-sm py-1 text-muted-foreground">
																Lihat Jawaban Detail
															</AccordionTrigger>
															<AccordionContent className="pt-2 pl-4 border-l-2">
																<ul className="space-y-2 text-sm text-slate-700">
																	{sub.questions.map((q) => (
																		<li key={q.id}>
																			<strong>{q.value}/5</strong> - {q.text}
																		</li>
																	))}
																</ul>
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				))}
			</div>

			{allRecommendations.length > 0 && (
				<div>
					<h3 className="text-xl font-semibold mb-4">Rekomendasi Pelatihan</h3>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{allRecommendations.map((rec) => (
							<div
								key={rec}
								className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900"
							>
								{rec}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
