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
import { Input } from "@/components/ui/input";
import {
	Loader2,
	UploadCloud,
	FileWarning,
	CheckCircle,
	ArrowRight,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ValidatedRow } from "@/app/api/admin/employees/sync/analyze/route";

// --- Type Definitions (Unchanged) ---
interface ChangeDetail {
	field: string;
	from: string | null;
	to: string | null;
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

export const SyncModal: React.FC<SyncModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
}) => {
	const [step, setStep] = useState<
		"upload" | "processing" | "confirm" | "executing" | "error" | "success"
	>("upload");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<SyncAnalysis | null>(null);
	const [errors, setErrors] = useState<SyncError[]>([]);

	// --- State for Progress Simulation ---
	const [progress, setProgress] = useState(0);
	const [progressMessage, setProgressMessage] = useState(
		"Starting synchronization..."
	);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleUploadAndAnalyze = async () => {
		if (!selectedFile) return;
		setStep("processing");
		setErrors([]); // Clear previous errors

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
						{
							row: 0,
							employeeId: "N/A",
							error: result.message || "An unknown error occurred",
						},
					]
				);
				setStep("error");
				return;
			}

			setAnalysis(result.analysis);
			setStep("confirm");
		} catch (err) {
			console.log(err);
			setErrors([
				{
					row: 0,
					employeeId: "N/A",
					error: "Failed to connect to the server.",
				},
			]);
			setStep("error");
		}
	};

	const handleExecuteSync = async () => {
		if (!analysis) return;
		setStep("executing");
		setProgress(0); // Reset progress

		// --- Progress Simulation Logic ---
		const totalOperations =
			analysis.toDelete.length +
			analysis.toUpdate.length +
			analysis.toCreate.length;
		let progressInterval: NodeJS.Timeout;

		// Simulate progress updates every few seconds
		if (totalOperations > 0) {
			progressInterval = setInterval(() => {
				setProgress((prev) => {
					const next = prev + 10;
					if (next < 30) setProgressMessage("Deleting old records...");
					else if (next < 60)
						setProgressMessage("Updating existing records...");
					else if (next < 90) setProgressMessage("Creating new records...");
					else setProgressMessage("Finalizing transaction...");
					return Math.min(next, 95); // Stop at 95% until complete
				});
			}, 1500);
		}
		// --- End Simulation Logic ---

		try {
			const response = await fetch("/api/admin/employees/sync/execute", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(analysis),
			});

			if (!response.ok) {
				const result = await response.json();
				setErrors([
					{
						row: 0,
						employeeId: "N/A",
						error: result.message || "Execution failed.",
					},
				]);
				setStep("error");
				return;
			}

			setProgress(100);
			setProgressMessage("Synchronization successful!");

			setTimeout(() => {
				setStep("success");
				onSuccess();
			}, 1000);
		} catch (err) {
			console.log(err);
			setErrors([
				{
					row: 0,
					employeeId: "N/A",
					error: "Failed to connect to the server during execution.",
				},
			]);
			setStep("error");
		} finally {
			clearInterval(progressInterval!); // Stop the simulation
		}
	};

	const resetState = () => {
		setSelectedFile(null);
		setAnalysis(null);
		setErrors([]);
		setProgress(0);
		setProgressMessage("");
		setStep("upload");
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const renderContent = () => {
		switch (step) {
			// Cases 'upload', 'processing', 'confirm', 'error', 'success' remain largely the same.
			// The main addition is the new 'executing' case.
			case "executing":
				return (
					<div className="flex flex-col items-center justify-center h-48">
						<Loader2 className="h-16 w-16 animate-spin text-blue-600" />
						<p className="mt-4 text-lg font-medium text-gray-700">
							{progressMessage}
						</p>
						<Progress value={progress} className="w-full mt-4" />
					</div>
				);

			// ... other cases from your provided code ...
			case "upload":
				return (
					<>
						<DialogDescription>
							Select an Excel (.xlsx) or CSV (.csv) file containing the complete
							list of employees. The system will compare this file against the
							database.
						</DialogDescription>
						<div className="mt-4">
							<label
								htmlFor="file-upload"
								className="block text-sm font-medium text-gray-700"
							>
								Employee File
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									<UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
									<div className="flex text-sm text-gray-600">
										<label
											htmlFor="file-upload"
											className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
										>
											<span>Upload a file</span>
											<Input
												id="file-upload"
												name="file-upload"
												type="file"
												className="sr-only"
												onChange={handleFileChange}
												accept=".xlsx, .csv"
											/>
										</label>
										<p className="pl-1">or drag and drop</p>
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
								Cancel
							</Button>
							<Button onClick={handleUploadAndAnalyze} disabled={!selectedFile}>
								Analyze File
							</Button>
						</DialogFooter>
					</>
				);

			case "processing":
				return (
					<div className="flex flex-col items-center justify-center h-48">
						<Loader2 className="h-16 w-16 animate-spin text-blue-600" />
						<p className="mt-4 text-lg font-medium text-gray-700">
							Analyzing file, please wait...
						</p>
					</div>
				);

			case "confirm":
				if (!analysis) return null;
				const noChanges =
					analysis.toCreate.length === 0 &&
					analysis.toUpdate.length === 0 &&
					analysis.toDelete.length === 0;

				if (noChanges) {
					return (
						<>
							<div className="flex flex-col items-center justify-center h-48 text-center">
								<CheckCircle className="h-16 w-16 text-green-500" />
								<h3 className="mt-4 text-lg font-medium text-gray-900">
									Data Synchronized
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									The database is already up-to-date with the provided file.
								</p>
							</div>
							<DialogFooter className="mt-6">
								<Button onClick={handleClose}>Close</Button>
							</DialogFooter>
						</>
					);
				}

				return (
					<>
						<DialogDescription>
							Analysis complete. Review the changes below before proceeding.
							This action cannot be undone.
						</DialogDescription>
						<Accordion
							type="multiple"
							className="w-full mt-4 space-y-2 max-h-[50vh] overflow-y-auto pr-3"
						>
							{analysis.toCreate.length > 0 && (
								<AccordionItem value="create">
									<AccordionTrigger>
										Create: {analysis.toCreate.length} employees
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
										Update: {analysis.toUpdate.length} employees
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
										Delete: {analysis.toDelete.length} employees
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
								Cancel
							</Button>
							<Button onClick={handleExecuteSync}>Confirm & Synchronize</Button>
						</DialogFooter>
					</>
				);

			case "error":
				return (
					<>
						<DialogDescription>
							The process was canceled due to the following errors. No changes
							have been saved to the database.
						</DialogDescription>
						<div className="mt-4 max-h-64 overflow-y-auto p-4 bg-red-50 border border-red-200 rounded-md">
							<div className="flex items-start">
								<FileWarning className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
								<div>
									<h3 className="font-semibold text-red-800">
										Found {errors.length} Error(s)
									</h3>
									<ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-700">
										{errors.map((err, i) => (
											<li key={i}>
												Row {err.row}: ID {err.employeeId} - {err.error}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
						<DialogFooter className="mt-6">
							<Button onClick={handleClose}>Close</Button>
						</DialogFooter>
					</>
				);

			case "success":
				return (
					<>
						<div className="flex flex-col items-center justify-center h-48 text-center">
							<CheckCircle className="h-16 w-16 text-green-500" />
							<h3 className="mt-4 text-lg font-medium text-gray-900">
								Synchronization Successful!
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								The employee database has been updated successfully.
							</p>
						</div>
						<DialogFooter className="mt-6">
							<Button onClick={handleClose}>Done</Button>
						</DialogFooter>
					</>
				);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Bulk Employee Data Synchronization</DialogTitle>
				</DialogHeader>
				{renderContent()}
			</DialogContent>
		</Dialog>
	);
};
