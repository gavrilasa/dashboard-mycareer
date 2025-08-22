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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { PathType, VacancyPeriod } from "@prisma/client";

// --- Type Definitions ---
interface Section {
	interestType: PathType;
	period: VacancyPeriod;
}

interface StatusResponse {
	completedSections: Section[];
	nextSection: Section | null;
	isCompleted: boolean;
}

interface OpportunitiesResponse {
	section: Section;
	opportunities: Opportunity[];
}

const SECTION_TITLES: Record<PathType, Record<VacancyPeriod, string>> = {
	ALIGN: {
		SHORT_TERM: "Minat Karier Sejalur (1-3 Tahun ke Depan)",
		LONG_TERM: "Minat Karier Sejalur (Lebih dari 3 Tahun)",
	},
	CROSS: {
		SHORT_TERM: "Minat Karier Lintas Jalur (1-3 Tahun ke Depan)",
		LONG_TERM: "Minat Karier Lintas Jalur (Lebih dari 3 Tahun)",
	},
};

// --- Helper Components ---
const LoadingState = () => (
	<div className="space-y-4">
		<Skeleton className="h-8 w-1/3" />
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<Skeleton className="h-56 w-full" />
			<Skeleton className="h-56 w-full" />
			<Skeleton className="h-56 w-full" />
		</div>
	</div>
);

const CompletionState = () => (
	<Card className="w-full max-w-lg mx-auto text-center">
		<CardHeader>
			<div className="mx-auto bg-green-100 p-3 rounded-full">
				<CheckCircle className="h-10 w-10 text-green-600" />
			</div>
			<CardTitle className="mt-4 text-2xl">Terima Kasih!</CardTitle>
			<CardDescription>
				Anda telah berhasil melengkapi semua pilihan minat karier Anda. Pilihan
				Anda telah kami simpan.
			</CardDescription>
		</CardHeader>
	</Card>
);

const EmptyState = ({ sectionTitle }: { sectionTitle: string }) => (
	<Card>
		<CardHeader>
			<CardTitle>{sectionTitle}</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="text-center text-gray-500 py-10">
				Tidak ada peluang karier yang tersedia untuk kategori ini saat ini.
				Silakan hubungi HRD untuk informasi lebih lanjut.
			</p>
		</CardContent>
	</Card>
);

// --- Main Page Component ---
export default function JobVacantPage() {
	const [currentSection, setCurrentSection] = useState<Section | null>(null);
	const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCompleted, setIsCompleted] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogState, setDialogState] = useState<{
		type: "confirm" | "alert" | "closed";
		data: Opportunity | null;
	}>({ type: "closed", data: null });

	const fetchStatusAndOpportunities = useCallback(async () => {
		setIsLoading(true);
		try {
			const statusRes = await fetch("/api/employee/job-vacant/status");
			if (!statusRes.ok) throw new Error("Gagal memuat status progres Anda.");

			const statusData: StatusResponse = await statusRes.json();

			if (statusData.isCompleted) {
				setIsCompleted(true);
				setIsLoading(false);
				return;
			}

			if (statusData.nextSection) {
				setCurrentSection(statusData.nextSection);
				const opportunitiesRes = await fetch(
					"/api/employee/job-vacant/opportunities"
				);
				if (!opportunitiesRes.ok)
					throw new Error("Gagal memuat peluang karier.");

				const opportunitiesData: OpportunitiesResponse =
					await opportunitiesRes.json();
				setOpportunities(opportunitiesData.opportunities);
			} else {
				setIsCompleted(true); // Fallback jika tidak ada section berikutnya
			}
		} catch (error) {
			toast.error("Terjadi Kesalahan", {
				description:
					error instanceof Error ? error.message : "Tidak dapat memuat data.",
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStatusAndOpportunities();
	}, [fetchStatusAndOpportunities]);

	const handleInterestClick = (opportunityId: string) => {
		const opportunity = opportunities.find((o) => o.id === opportunityId);
		if (opportunity) {
			setDialogState({ type: "confirm", data: opportunity });
		}
	};

	const handleConfirmInterest = async () => {
		if (!dialogState.data || !currentSection) return;

		setIsSubmitting(true);
		setDialogState({ type: "closed", data: null });

		try {
			const response = await fetch("/api/employee/job-vacant/interest", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					jobVacancyId: dialogState.data.id,
					interestType: currentSection.interestType,
					period: currentSection.period,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (errorData.code === "FORM_INCOMPLETE") {
					setDialogState({ type: "alert", data: null });
				} else {
					throw new Error(errorData.message || "Gagal menyimpan pilihan.");
				}
			} else {
				toast.success("Pilihan Disimpan", {
					description: "Memuat section berikutnya...",
				});
				fetchStatusAndOpportunities(); // Refresh untuk memuat section selanjutnya
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

	if (isLoading) {
		return (
			<div className="container mx-auto py-10">
				<LoadingState />
			</div>
		);
	}

	if (isCompleted) {
		return (
			<div className="container mx-auto py-10 flex items-center justify-center">
				<CompletionState />
			</div>
		);
	}

	const sectionTitle = currentSection
		? SECTION_TITLES[currentSection.interestType][currentSection.period]
		: "";

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10 space-y-8">
				{opportunities.length > 0 ? (
					<section>
						<h2 className="text-2xl font-bold mb-4">{sectionTitle}</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{opportunities.map((opp) => (
								<JobVacancyCard
									key={opp.id}
									opportunity={opp}
									onInterestClick={handleInterestClick}
									isSubmitting={isSubmitting}
								/>
							))}
						</div>
					</section>
				) : (
					<EmptyState sectionTitle={sectionTitle} />
				)}
			</div>

			<ConfirmationDialog
				open={dialogState.type === "confirm"}
				onOpenChange={(open) =>
					!open && setDialogState({ type: "closed", data: null })
				}
				onConfirm={handleConfirmInterest}
				positionName={dialogState.data?.position?.name || ""}
				category={sectionTitle}
			/>

			<FormIncompleteAlert
				open={dialogState.type === "alert"}
				onOpenChange={(open) =>
					!open && setDialogState({ type: "closed", data: null })
				}
			/>
		</>
	);
}
