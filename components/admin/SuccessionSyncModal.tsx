// /components/admin/SuccessionSyncModal.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, FileWarning, CheckCircle, Clock } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

// --- Type Definitions ---
interface VacancyToCreate {
	jobRoleId: string;
	jobRoleName: string;
	employeeName: string;
}

interface SuccessionAnalysis {
	toCreate: VacancyToCreate[];
}

interface SyncError {
	error: string;
}

interface SuccessionSyncModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

type SyncStep =
	| "initial"
	| "analyzing"
	| "confirm"
	| "starting"
	| "executing"
	| "error"
	| "success";

type SyncStatus = "IDLE" | "PROCESSING" | "SUCCESS" | "FAILED";

const statusMessages: Record<SyncStatus, string> = {
	IDLE: "Menunggu untuk dimulai...",
	PROCESSING: "Sinkronisasi sedang berjalan di latar belakang...",
	SUCCESS: "Sinkronisasi berhasil diselesaikan.",
	FAILED: "Sinkronisasi gagal.",
};

export const SuccessionSyncModal: React.FC<SuccessionSyncModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [step, setStep] = useState<SyncStep>("initial");
	const [analysis, setAnalysis] = useState<SuccessionAnalysis | null>(null);
	const [errors, setErrors] = useState<SyncError[]>([]);
	const [jobId, setJobId] = useState<string | null>(null);
	const [isPolling, setIsPolling] = useState<boolean>(false);
	const [statusMessage, setStatusMessage] = useState(statusMessages.IDLE);

	const handleAnalyze = async () => {
		setStep("analyzing");
		setErrors([]);
		try {
			const response = await fetch(
				"/api/admin/job-vacancies/sync-retirements/analyze",
				{
					method: "POST", // Menggunakan POST untuk memulai proses
				}
			);
			const result = await response.json();

			if (!response.ok) {
				setErrors([{ error: result.message || "Analisis Gagal" }]);
				setStep("error");
				return;
			}
			setAnalysis(result.analysis);
			setJobId(result.jobId);
			setStep("confirm");
		} catch (err) {
			setErrors([{ error: `Gagal terhubung ke server. Error: ${err}` }]);
			setStep("error");
		}
	};

	const handleStartSync = async () => {
		if (!jobId) return;
		setStep("starting");
		try {
			const response = await fetch(
				"/api/admin/job-vacancies/sync-retirements/execute",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ jobId }),
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memulai sinkronisasi.");
			}
			setStep("executing");
			setIsPolling(true);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Terjadi kesalahan.";
			setErrors([{ error: errorMessage }]);
			setStep("error");
		}
	};

	const checkSyncStatus = useCallback(async () => {
		if (!jobId) return;
		try {
			const response = await fetch(
				`/api/admin/job-vacancies/sync-retirements/status?jobId=${jobId}`
			);
			if (!response.ok) {
				setIsPolling(false);
				return;
			}
			const result = await response.json();
			setStatusMessage(
				statusMessages[result.status as SyncStatus] || result.status
			);

			if (result.status === "SUCCESS" || result.status === "FAILED") {
				setIsPolling(false);
				if (result.status === "SUCCESS") {
					setTimeout(() => {
						setStep("success");
						onSuccess();
					}, 1000);
				} else {
					setErrors([
						{ error: result.error || "Terjadi kesalahan saat eksekusi." },
					]);
					setStep("error");
				}
			}
		} catch (error) {
			console.error("Polling failed:", error);
			setIsPolling(false);
		}
	}, [jobId, onSuccess]);

	useEffect(() => {
		if (!isPolling) return;
		const interval = setInterval(checkSyncStatus, 5000);
		return () => clearInterval(interval);
	}, [isPolling, checkSyncStatus]);

	const resetState = () => {
		setAnalysis(null);
		setErrors([]);
		setJobId(null);
		setIsPolling(false);
		setStep("initial");
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const renderContent = () => {
		switch (step) {
			case "initial":
				return (
					<>
						<DialogDescription>
							Proses ini akan memindai semua data karyawan untuk mendeteksi
							siapa saja yang akan mencapai usia pensiun (55 tahun) dalam 5
							tahun ke depan.
							<br />
							<br />
							Sistem akan secara otomatis membuat lowongan pekerjaan (Job
							Vacant) untuk posisi mereka jika belum ada dan jika posisi
							tersebut merupakan bagian dari jenjang karier yang valid.
						</DialogDescription>
						<DialogFooter className="mt-6">
							<Button variant="outline" onClick={handleClose}>
								Batal
							</Button>
							<Button onClick={handleAnalyze}>Mulai Analisis</Button>
						</DialogFooter>
					</>
				);
			case "analyzing":
				return (
					<div className="flex flex-col items-center justify-center h-48">
						<Loader2 className="h-16 w-16 animate-spin text-blue-600" />
						<p className="mt-4 text-lg font-medium text-gray-700">
							Menganalisis data karyawan, mohon tunggu...
						</p>
					</div>
				);
			case "confirm":
				if (!analysis) return null;
				return (
					<>
						<DialogDescription>
							Analisis selesai. Tinjau lowongan yang akan dibuat sebelum
							melanjutkan. Proses ini akan berjalan di latar belakang.
						</DialogDescription>
						<Accordion
							type="single"
							collapsible
							defaultValue="item-1"
							className="w-full mt-4 max-h-[50vh] overflow-y-auto pr-3"
						>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									Job Vacant yang akan Dibuat: {analysis.toCreate.length} posisi
								</AccordionTrigger>
								<AccordionContent>
									{analysis.toCreate.length > 0 ? (
										analysis.toCreate.map((p) => (
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
											Tidak ada lowongan baru yang perlu dibuat saat ini.
										</p>
									)}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<DialogFooter className="mt-6">
							<Button variant="outline" onClick={handleClose}>
								Batal
							</Button>
							<Button onClick={handleStartSync}>Mulai Sinkronisasi</Button>
						</DialogFooter>
					</>
				);
			case "executing":
				return (
					<div className="flex flex-col items-center justify-center h-48">
						<Clock className="h-16 w-16 text-blue-600" />
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							Proses Berjalan
						</h3>
						<p className="mt-2 text-sm text-gray-500 text-center">
							{statusMessage}
						</p>
						<p className="mt-1 text-xs text-gray-400">
							Anda dapat menutup jendela ini.
						</p>
					</div>
				);
			case "error":
				return (
					<>
						<DialogDescription>
							Proses dibatalkan karena error berikut. Tidak ada perubahan yang
							disimpan ke database.
						</DialogDescription>
						<div className="mt-4 max-h-64 overflow-y-auto p-4 bg-red-50 border border-red-200 rounded-md">
							<div className="flex items-start">
								<FileWarning className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
								<div>
									<h3 className="font-semibold text-red-800">
										Terjadi Kesalahan
									</h3>
									<ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-700">
										{errors.map((err, i) => (
											<li key={i}>{err.error}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
						<DialogFooter className="mt-6">
							<Button onClick={handleClose}>Tutup</Button>
						</DialogFooter>
					</>
				);
			case "success":
				return (
					<div className="flex flex-col items-center justify-center h-48 text-center">
						<CheckCircle className="h-16 w-16 text-green-500" />
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							Sinkronisasi Selesai!
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Lowongan pekerjaan untuk suksesi telah berhasil dibuat.
						</p>
						<DialogFooter className="mt-6">
							<Button onClick={handleClose}>Selesai</Button>
						</DialogFooter>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Sinkronisasi Posisi Pensiun</DialogTitle>
				</DialogHeader>
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
};
