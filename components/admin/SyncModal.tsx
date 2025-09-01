// /components/admin/SyncModal.tsx

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
import { Input } from "@/components/ui/input";
import {
	Loader2,
	UploadCloud,
	FileWarning,
	CheckCircle,
	ArrowRight,
	Clock,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ValidatedRow } from "@/app/api/admin/employees/sync/analyze/route";

// --- Type Definitions ---
interface ChangeDetail {
	field: string;
	from: string | null | undefined;
	to: string | null | undefined;
}

interface EmployeeUpdate {
	employeeId: string;
	name: string;
	changes: ChangeDetail[];
}

interface SyncAnalysis {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: EmployeeUpdate[];
	toDelete: { employeeId: string; name: string }[];
	fullData: ValidatedRow[];
}

interface SyncError {
	row: number;
	employeeId: string;
	error: string;
}

interface SyncModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

type SyncStep =
	| "upload"
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

export const SyncModal: React.FC<SyncModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [step, setStep] = useState<SyncStep>("upload");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<SyncAnalysis | null>(null);
	const [errors, setErrors] = useState<SyncError[]>([]);
	const [jobId, setJobId] = useState<string | null>(null);
	const [isPolling, setIsPolling] = useState<boolean>(false);
	const [statusMessage, setStatusMessage] = useState(statusMessages.IDLE);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleUploadAndAnalyze = async () => {
		if (!selectedFile) return;
		setStep("analyzing");
		setErrors([]);
		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await fetch("/api/admin/employees/sync/analyze", {
				method: "POST",
				body: formData,
			});
			const result = await response.json();

			if (!response.ok) {
				setErrors(
					result.errors || [
						{ row: 0, employeeId: "N/A", error: result.message },
					]
				);
				setStep("error");
				return;
			}
			setAnalysis(result.analysis);
			setJobId(result.jobId);
			setStep("confirm");
		} catch (err) {
			setErrors([
				{
					row: 0,
					employeeId: "N/A",
					error: `Gagal terhubung ke server. Error:${err}`,
				},
			]);
			setStep("error");
		}
	};

	const handleStartSync = async () => {
		if (!jobId) return;
		setStep("starting");
		try {
			const response = await fetch("/api/admin/employees/sync/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ jobId }),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memulai sinkronisasi.");
			}
			setStep("executing");
			setIsPolling(true);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Terjadi kesalahan.";
			setErrors([{ row: 0, employeeId: "System", error: errorMessage }]);
			setStep("error");
		}
	};

	const checkSyncStatus = useCallback(async () => {
		if (!jobId) return;
		try {
			const response = await fetch(
				`/api/admin/employees/sync/status?jobId=${jobId}`
			);
			// Penanganan jika endpoint status belum dibuat atau error
			if (response.status === 404) {
				setIsPolling(false);
				setErrors([
					{
						row: 0,
						employeeId: "System",
						error: "Status endpoint tidak ditemukan.",
					},
				]);
				setStep("error");
				return;
			}
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
						{
							row: 0,
							employeeId: "System",
							error: result.error || "Terjadi kesalahan saat eksekusi.",
						},
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
		setSelectedFile(null);
		setAnalysis(null);
		setErrors([]);
		setJobId(null);
		setIsPolling(false);
		setStep("upload");
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const renderContent = () => {
		switch (step) {
			case "upload":
				return (
					<>
						<DialogDescription>
							Pilih file Excel (.xlsx) yang berisi daftar lengkap karyawan.
						</DialogDescription>
						<div className="mt-4">
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									<UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
									<div className="flex text-sm text-gray-600">
										<label
											htmlFor="file-upload"
											className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
										>
											<span>Unggah file</span>
											<Input
												id="file-upload"
												name="file-upload"
												type="file"
												className="sr-only"
												onChange={handleFileChange}
												accept=".xlsx, .csv"
											/>
										</label>
										<p className="pl-1">atau seret dan lepas</p>
									</div>
									{selectedFile && (
										<p className="text-sm text-gray-500 mt-2">
											{selectedFile.name}
										</p>
									)}
								</div>
							</div>
						</div>
						<DialogFooter className="mt-6">
							<Button variant="outline" onClick={handleClose}>
								Batal
							</Button>
							<Button onClick={handleUploadAndAnalyze} disabled={!selectedFile}>
								Analisis File
							</Button>
						</DialogFooter>
					</>
				);
			case "analyzing":
				return (
					<div className="flex flex-col items-center justify-center h-48">
						<Loader2 className="h-16 w-16 animate-spin text-blue-600" />
						<p className="mt-4 text-lg font-medium text-gray-700">
							Menganalisis file, mohon tunggu...
						</p>
					</div>
				);
			case "confirm":
				if (!analysis) return null;
				return (
					<>
						<DialogDescription>
							Analisis selesai. Tinjau perubahan di bawah sebelum melanjutkan.
							Proses ini akan berjalan di latar belakang.
						</DialogDescription>
						<Accordion
							type="multiple"
							className="w-full mt-4 max-h-[50vh] overflow-y-auto pr-3"
						>
							{analysis.toCreate.length > 0 && (
								<AccordionItem value="create">
									<AccordionTrigger>
										Buat: {analysis.toCreate.length} karyawan baru
									</AccordionTrigger>
									<AccordionContent>
										{analysis.toCreate.map((e) => (
											<div key={e.employeeId} className="text-sm py-1 px-2">
												{e.name} ({e.employeeId})
											</div>
										))}
									</AccordionContent>
								</AccordionItem>
							)}
							{analysis.toUpdate.length > 0 && (
								<AccordionItem value="update">
									<AccordionTrigger>
										Perbarui: {analysis.toUpdate.length} karyawan
									</AccordionTrigger>
									<AccordionContent>
										{analysis.toUpdate.map((emp) => (
											<div
												key={emp.employeeId}
												className="text-sm py-2 px-2 border-b last:border-b-0"
											>
												<p className="font-semibold">
													{emp.name} ({emp.employeeId})
												</p>
												<ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
													{emp.changes.map((change) => (
														<li key={change.field}>
															<strong>{change.field}:</strong>{" "}
															<span className="text-red-600">
																{change.from || '""'}
															</span>{" "}
															<ArrowRight className="inline h-3 w-3 mx-1" />{" "}
															<span className="text-green-600">
																{change.to || '""'}
															</span>
														</li>
													))}
												</ul>
											</div>
										))}
									</AccordionContent>
								</AccordionItem>
							)}
							{analysis.toDelete.length > 0 && (
								<AccordionItem value="delete">
									<AccordionTrigger className="text-red-600 hover:no-underline">
										Hapus: {analysis.toDelete.length} karyawan
									</AccordionTrigger>
									<AccordionContent>
										{analysis.toDelete.map((e) => (
											<div key={e.employeeId} className="text-sm py-1 px-2">
												{e.name} ({e.employeeId})
											</div>
										))}
									</AccordionContent>
								</AccordionItem>
							)}
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
										Ditemukan {errors.length} Error
									</h3>
									<ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-700">
										{errors.map((err, i) => (
											<li key={i}>
												Baris {err.row}: ID {err.employeeId} - {err.error}
											</li>
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
							Database karyawan telah berhasil diperbarui.
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
					<DialogTitle>Sinkronisasi Data Karyawan</DialogTitle>
				</DialogHeader>
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
};
