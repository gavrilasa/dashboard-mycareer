"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface InterestedEmployee {
	employeeId: string;
	fullName: string;
	position: { name: string } | null;
	department: { name: string } | null;
	branch: { name: string } | null;
	appliedAt: string;
}

interface InterestedEmployeesDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	jobVacancyId: string | null;
	vacancyTitle: string | null;
}

export function InterestedEmployeesDialog({
	open,
	onOpenChange,
	jobVacancyId,
	vacancyTitle,
}: InterestedEmployeesDialogProps) {
	const [interestedEmployees, setInterestedEmployees] = useState<
		InterestedEmployee[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function fetchInterestedEmployees() {
			if (!jobVacancyId || !open) return;

			setIsLoading(true);
			try {
				const response = await fetch(
					`/api/admin/job-vacancies/${jobVacancyId}/interests`
				);
				if (!response.ok) {
					throw new Error("Gagal mengambil data peminat.");
				}
				const data = await response.json();
				setInterestedEmployees(data);
			} catch (error) {
				toast.error("Gagal Memuat Data", {
					description:
						error instanceof Error ? error.message : "Terjadi kesalahan.",
				});
			} finally {
				setIsLoading(false);
			}
		}

		fetchInterestedEmployees();
	}, [jobVacancyId, open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Peminat untuk: {vacancyTitle}</DialogTitle>
					<DialogDescription>
						Berikut adalah daftar karyawan yang telah menyatakan minat pada
						lowongan ini.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-4 max-h-[60vh] overflow-y-auto">
					{isLoading ? (
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nama Karyawan</TableHead>
									<TableHead>ID Karyawan</TableHead>
									<TableHead>Posisi Saat Ini</TableHead>
									<TableHead>Cabang</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{interestedEmployees.length > 0 ? (
									interestedEmployees.map((employee) => (
										<TableRow key={employee.employeeId}>
											<TableCell>{employee.fullName}</TableCell>
											<TableCell>{employee.employeeId}</TableCell>
											<TableCell>{employee.position?.name || "-"}</TableCell>
											<TableCell>{employee.branch?.name || "-"}</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} className="h-24 text-center">
											Belum ada peminat.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
