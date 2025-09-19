"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Opportunity,
	JobVacancyCard,
} from "@/components/employee/job-vacant/JobVacancyCard";
import {
	ConfirmationDialog,
	FormIncompleteAlert,
} from "@/components/employee/job-vacant/ActionDialogs";
import { RelocationCard } from "@/components/employee/job-vacant/RelocationCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

// --- Type Definitions ---
type Stage =
	| "LOADING"
	| "AWAITING_RELOCATION"
	| "INCOMPLETE_PROFILE"
	| "GUIDED_ALIGN_SHORT_TERM"
	| "GUIDED_ALIGN_LONG_TERM"
	| "GUIDED_TRANSITION"
	| "GUIDED_CROSS_SHORT_TERM"
	| "GUIDED_CROSS_LONG_TERM"
	| "COMPLETED";

interface OpportunitiesResponse {
	stage: Stage;
	opportunities: Opportunity[];
}

// --- Helper & State Components ---

const LoadingState = () => (
	<div className="space-y-6">
		<Skeleton className="w-1/2 h-10" />
		<Skeleton className="w-3/4 h-4" />
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{[...Array(3)].map((_, i) => (
				<Skeleton key={i} className="w-full h-56" />
			))}
		</div>
	</div>
);

const CompletionState = () => (
	<Card className="w-full max-w-lg mx-auto text-center">
		<CardHeader>
			<div className="p-3 mx-auto bg-green-100 rounded-full">
				<CheckCircle className="w-10 h-10 text-green-600" />
			</div>
			<CardTitle className="mt-4 text-2xl">Terima Kasih!</CardTitle>
			<CardDescription>
				Anda telah berhasil melengkapi semua pilihan minat karier Anda. Pilihan
				Anda telah kami simpan.
			</CardDescription>
		</CardHeader>
	</Card>
);

const TransitionState = ({ onNextStage }: { onNextStage: () => void }) => (
	<Card className="w-full max-w-lg mx-auto text-center">
		<CardHeader>
			<div className="p-3 mx-auto bg-blue-100 rounded-full">
				<ArrowRight className="w-10 h-10 text-blue-600" />
			</div>
			<CardTitle className="mt-4 text-2xl">
				Tahap Selanjutnya: Karier Lintas Jalur
			</CardTitle>
			<CardDescription>
				Anda telah menyelesaikan pemilihan minat karier sejalur. Sekarang, mari
				kita lihat peluang di jalur karier yang berbeda (Cross).
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Button onClick={onNextStage}>Lanjutkan ke Jenjang Karier Cross</Button>
		</CardContent>
	</Card>
);

// --- Main Page Component ---
export default function JobVacantPage() {
	const [stage, setStage] = useState<Stage>("LOADING");
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [incompleteDetails, setIncompleteDetails] = useState({
		form: false,
		questionnaire: false,
	});
	const [dialogState, setDialogState] = useState<{
		type: "confirm" | "alert" | "closed";
		data: Opportunity | null;
	}>({ type: "closed", data: null });

	const fetchOpportunities = useCallback(
		async (currentStage: Stage | "INITIAL" = "INITIAL") => {
			setStage("LOADING");
			try {
				const res = await fetch(
					`/api/employee/job-vacant/opportunities?stage=${currentStage}`
				);
				if (!res.ok) throw new Error("Gagal memuat data peluang karier.");

				const data: OpportunitiesResponse = await res.json();
				setOpportunities(data.opportunities);
				setStage(data.stage);
			} catch (error) {
				toast.error("Terjadi Kesalahan", {
					description:
						error instanceof Error ? error.message : "Tidak dapat memuat data.",
				});
				setStage("INCOMPLETE_PROFILE");
			}
		},
		[]
	);

	useEffect(() => {
		fetchOpportunities("INITIAL");
	}, [fetchOpportunities]);

	const handleInterestClick = (opportunity: Opportunity) => {
		setDialogState({ type: "confirm", data: opportunity });
	};

	const handleConfirmInterest = async () => {
		if (!dialogState.data) return;

		setIsSubmitting(true);
		const opportunityId = dialogState.data.id;
		setDialogState({ type: "closed", data: null });

		try {
			const response = await fetch("/api/employee/job-vacant/interest", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobVacancyId: opportunityId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (errorData.code === "PROFILE_INCOMPLETE") {
					setIncompleteDetails(errorData.details);
					setDialogState({ type: "alert", data: null });
				} else {
					throw new Error(errorData.message || "Gagal menyimpan pilihan.");
				}
			} else {
				toast.success("Pilihan Disimpan", {
					description: "Memuat tahap berikutnya...",
				});
				fetchOpportunities(stage);
			}
		} catch (error) {
			toast.error("Gagal Menyimpan", {
				description:
					error instanceof Error ? error.message : "Terjadi kesalahan.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderContent = () => {
		if (stage === "AWAITING_RELOCATION") {
			return <RelocationCard onSave={() => fetchOpportunities("INITIAL")} />;
		}

		if (stage === "LOADING") return <LoadingState />;
		if (stage === "COMPLETED") return <CompletionState />;
		if (stage === "GUIDED_TRANSITION") {
			return (
				<TransitionState
					onNextStage={() => fetchOpportunities("GUIDED_CROSS_SHORT_TERM")}
				/>
			);
		}

		// FIX: Tambahkan judul untuk keempat tahap
		const titles: Record<string, string> = {
			INCOMPLETE_PROFILE: "Peluang Karier Untuk Anda",
			GUIDED_ALIGN_SHORT_TERM:
				"Tahap 1: Jenjang Karier Sejalur (Jangka Pendek)",
			GUIDED_ALIGN_LONG_TERM:
				"Tahap 2: Jenjang Karier Sejalur (Jangka Panjang)",
			GUIDED_CROSS_SHORT_TERM:
				"Tahap 3: Jenjang Karier Lintas Jalur (Jangka Pendek)",
			GUIDED_CROSS_LONG_TERM:
				"Tahap 4: Jenjang Karier Lintas Jalur (Jangka Panjang)",
		};

		const currentTitle = titles[stage] || "Peluang Karier";

		return (
			<section>
				<h2 className="mb-4 text-2xl font-bold">{currentTitle}</h2>
				{stage === "INCOMPLETE_PROFILE" && (
					<p className="mb-6 text-muted-foreground">
						Berikut adalah semua peluang yang relevan dengan posisi Anda saat
						ini. Lengkapi Form Data Diri dan Kuesioner untuk mendapatkan alur
						pemilihan minat karier yang terpandu.
					</p>
				)}
				{opportunities.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{opportunities.map((opp) => (
							<JobVacancyCard
								key={opp.id}
								opportunity={opp}
								onInterestClick={() => handleInterestClick(opp)}
								isSubmitting={isSubmitting}
							/>
						))}
					</div>
				) : (
					<p className="py-10 text-center text-gray-500">
						Tidak ada peluang yang tersedia untuk tahap ini.
					</p>
				)}
			</section>
		);
	};

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container py-10 mx-auto">{renderContent()}</div>

			<ConfirmationDialog
				open={dialogState.type === "confirm"}
				onOpenChange={(open) =>
					!open && setDialogState({ type: "closed", data: null })
				}
				onConfirm={handleConfirmInterest}
				positionName={dialogState.data?.jobRole?.name || ""}
				category="pilihan Anda"
			/>

			<FormIncompleteAlert
				open={dialogState.type === "alert"}
				onOpenChange={(open) =>
					!open && setDialogState({ type: "closed", data: null })
				}
				incompleteDetails={incompleteDetails}
			/>
		</>
	);
}
