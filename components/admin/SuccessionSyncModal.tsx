// /components/admin/SuccessionSyncModal.tsx

"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileWarning, CheckCircle, Info } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

// Tipe data yang diterima dari API analisis
interface VacancyAnalysisData {
	jobRoleId: string;
	jobRoleName: string;
	employeeName: string;
	description: string;
	isPublished: boolean;
	requirements: string;
}

// [!code focus:start]
interface SkippedVacancyData {
	jobRoleId: string;
	jobRoleName: string;
	employeeName: string;
	reason: string;
}

// Tipe untuk hasil analisis lengkap
interface AnalysisResult {
	toCreate: VacancyAnalysisData[];
	skipped: SkippedVacancyData[];
}
// [!code focus:end]

interface SuccessionSyncModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

type SyncStep = "initial" | "analyzing" | "confirm" | "executing" | "final";

export const SuccessionSyncModal: React.FC<SuccessionSyncModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [step, setStep] = useState<SyncStep>("initial");
	// [!code focus:start]
	const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
		null
	);
	// [!code focus:end]
	const [finalMessage, setFinalMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleAnalyze = async () => {
		setIsLoading(true);
		setFinalMessage(null);
		try {
			const response = await fetch(
				"/api/admin/job-vacancies/sync-retirements",
				{ method: "POST" }
			);
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			// [!code focus:start]
			setAnalysisResult(data.analysis);
			// [!code focus:end]
			setStep("confirm");
		} catch (err) {
			setStep("final");
			setFinalMessage({
				type: "error",
				text: err instanceof Error ? err.message : "Analisis Gagal.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleExecute = async () => {
		setIsLoading(true);
		setFinalMessage(null);
		try {
			if (!analysisResult)
				throw new Error("Tidak ada data analisis untuk dieksekusi.");

			const payload = analysisResult.toCreate.map(
				({ jobRoleName: _jobRoleName, employeeName: _employeeName, ...rest }) =>
					rest
			);

			const response = await fetch(
				"/api/admin/job-vacancies/sync-retirements",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			setStep("final");
			setFinalMessage({ type: "success", text: data.message });
			onSuccess();
		} catch (err) {
			setStep("final");
			setFinalMessage({
				type: "error",
				text: err instanceof Error ? err.message : "Eksekusi Gagal.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const resetAndClose = () => {
		setStep("initial");
		setAnalysisResult(null);
		setFinalMessage(null);
		onClose();
	};

	const renderContent = () => {
		switch (step) {
			case "initial":
				return (
					<>
						<DialogDescription>
							Mulai proses untuk menganalisis karyawan yang akan pensiun dan
							melihat pratinjau Job Vacant yang akan dibuat.
						</DialogDescription>
						<DialogFooter className="mt-6">
							<Button variant="outline" onClick={resetAndClose}>
								Batal
							</Button>
							<Button onClick={handleAnalyze} disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Mulai Analisis
							</Button>
						</DialogFooter>
					</>
				);

			case "confirm":
				if (!analysisResult) return null;
				return (
					<>
						<DialogDescription>
							Analisis selesai. Tinjau Job Vacant yang akan dibuat dan dilewati
							sebelum melanjutkan.
						</DialogDescription>
						<Accordion
							type="multiple"
							className="w-full mt-4 max-h-[50vh] overflow-y-auto pr-3"
						>
							{/* Accordion untuk yang akan dibuat */}
							<AccordionItem value="item-1">
								<AccordionTrigger>
									{analysisResult.toCreate.length} Job Vacant akan dibuat
								</AccordionTrigger>
								<AccordionContent>
									{analysisResult.toCreate.length > 0 ? (
										analysisResult.toCreate.map((p) => (
											<div
												key={p.jobRoleId}
												className="text-sm py-2 px-2 border-b last:border-b-0"
											>
												<p className="font-semibold">{p.jobRoleName}</p>
												<p className="text-xs text-gray-500">
													(Dipicu oleh: {p.employeeName})
												</p>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 p-2">
											Tidak ada lowongan baru yang perlu dibuat.
										</p>
									)}
								</AccordionContent>
							</AccordionItem>
							{/* [!code focus:start] */}
							{/* Accordion untuk yang dilewati */}
							<AccordionItem value="item-2">
								<AccordionTrigger className="text-yellow-700 hover:text-yellow-800">
									<Info className="mr-2 h-4 w-4" />
									{analysisResult.skipped.length} Posisi dilewati
								</AccordionTrigger>
								<AccordionContent>
									{analysisResult.skipped.length > 0 ? (
										analysisResult.skipped.map((p) => (
											<div
												key={p.jobRoleId}
												className="text-sm py-2 px-2 border-b last:border-b-0"
											>
												<p className="font-semibold">{p.jobRoleName}</p>
												<p className="text-xs text-gray-500">
													(Karyawan: {p.employeeName}) - Alasan: {p.reason}
												</p>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 p-2">
											Semua posisi yang terdeteksi valid.
										</p>
									)}
								</AccordionContent>
							</AccordionItem>
							{/* [!code focus:end] */}
						</Accordion>
						<DialogFooter className="mt-6">
							<Button
								variant="outline"
								onClick={resetAndClose}
								disabled={isLoading}
							>
								Batal
							</Button>
							<Button onClick={handleExecute} disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Buat Job Vacant
							</Button>
						</DialogFooter>
					</>
				);

			// ... (case "final" tetap sama)
			case "final":
				return (
					<div className="flex flex-col items-center justify-center text-center">
						{finalMessage?.type === "success" ? (
							<CheckCircle className="h-16 w-16 text-green-500" />
						) : (
							<FileWarning className="h-16 w-16 text-red-500" />
						)}
						<h3 className="mt-4 text-lg font-medium">
							{finalMessage?.type === "success"
								? "Sinkronisasi Selesai!"
								: "Terjadi Kesalahan"}
						</h3>
						<p className="mt-1 text-sm text-gray-600">{finalMessage?.text}</p>
						<DialogFooter className="mt-6 w-full">
							<Button onClick={resetAndClose} className="w-full">
								Tutup
							</Button>
						</DialogFooter>
					</div>
				);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Sinkronisasi Posisi Pensiun</DialogTitle>
				</DialogHeader>
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
};
