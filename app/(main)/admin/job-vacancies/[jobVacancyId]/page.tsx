"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	AlertCircle,
	FileText,
	FileQuestion,
	Users,
	Check,
	X,
} from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

// --- Type Definitions ---
interface VacancyDetails {
	id: string;
	description: string;
	isPublished: boolean;
	jobRole: { name: string } | null;
}

interface InterestedEmployee {
	employeeId: string;
	fullName: string;
	currentPosition: string;
	branchName: string;
	pathType: "ALIGN" | "CROSS" | "N/A";
	isWillingToRelocate: boolean;
	appliedAt: string;
}

// --- Helper Components ---
const StatCard = ({
	title,
	value,
	icon: Icon,
}: {
	title: string;
	value: string | number;
	icon: React.ElementType;
}) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium text-muted-foreground">
				{title}
			</CardTitle>
			<Icon className="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{value}</div>
		</CardContent>
	</Card>
);

// --- Main Page Component ---
export default function JobVacancyDetailPage() {
	const params = useParams();
	const jobVacancyId = params.jobVacancyId as string;

	const [vacancyDetails, setVacancyDetails] = useState<VacancyDetails | null>(
		null
	);
	const [interestedEmployees, setInterestedEmployees] = useState<
		InterestedEmployee[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!jobVacancyId) return;
		setIsLoading(true);
		setError(null);
		try {
			const [detailsRes, interestsRes] = await Promise.all([
				fetch(`/api/admin/job-vacancies/${jobVacancyId}`),
				fetch(`/api/admin/job-vacancies/${jobVacancyId}/interests`),
			]);

			if (!detailsRes.ok) {
				const errorData = await detailsRes.json();
				throw new Error(errorData.message || "Gagal memuat detail lowongan.");
			}
			if (!interestsRes.ok) {
				const errorData = await interestsRes.json();
				throw new Error(errorData.message || "Gagal memuat data peminat.");
			}

			const detailsData = await detailsRes.json();
			const interestsData = await interestsRes.json();

			setVacancyDetails(detailsData);
			setInterestedEmployees(interestsData);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Terjadi kesalahan.";
			setError(errorMessage);
			toast.error("Gagal Memuat Data", { description: errorMessage });
		} finally {
			setIsLoading(false);
		}
	}, [jobVacancyId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const relocationStats = useMemo(() => {
		if (interestedEmployees.length === 0) {
			return { willing: 0, notWilling: 0, percentage: "0%" };
		}
		const willing = interestedEmployees.filter(
			(e) => e.isWillingToRelocate
		).length;
		const notWilling = interestedEmployees.length - willing;
		const percentage =
			((willing / interestedEmployees.length) * 100).toFixed(0) + "%";
		return { willing, notWilling, percentage };
	}, [interestedEmployees]);

	const columns = useMemo<ColumnDef<InterestedEmployee>[]>(
		() => [
			{ accessorKey: "fullName", header: "Nama Karyawan" },
			{ accessorKey: "currentPosition", header: "Posisi Saat Ini" },
			{ accessorKey: "pathType", header: "Tipe Jenjang" },
			{
				accessorKey: "isWillingToRelocate",
				header: "Relokasi",
				cell: ({ row }) =>
					row.original.isWillingToRelocate ? (
						<Check className="h-5 w-5 text-green-600" />
					) : (
						<X className="h-5 w-5 text-red-600" />
					),
			},
			{
				accessorKey: "appliedAt",
				header: "Tanggal Melamar",
				cell: ({ row }) =>
					formatInTimeZone(
						new Date(row.original.appliedAt),
						"Asia/Jakarta",
						"dd MMM yyyy"
					),
			},
			{
				id: "actions",
				header: "Aksi",
				cell: ({ row }) => (
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							asChild
							className="cursor-pointer"
						>
							<Link href={`/admin/questionnaires/${row.original.employeeId}`}>
								<FileQuestion className="mr-2 h-4 w-4" /> Kuesioner
							</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							asChild
							className="cursor-pointer"
						>
							<Link href={`/admin/forms/${row.original.employeeId}`}>
								<FileText className="mr-2 h-4 w-4" /> Form
							</Link>
						</Button>
					</div>
				),
			},
		],
		[]
	);

	if (isLoading) {
		return (
			<div className="container mx-auto py-10 space-y-6">
				<Skeleton className="h-10 w-32" /> {/* Back Button */}
				<Skeleton className="h-32 w-full" /> {/* Card Header */}
				<div className="grid gap-4 md:grid-cols-3">
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
				<Skeleton className="h-96 w-full" /> {/* Table */}
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
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10 space-y-6">
				<BackButton />
				<Card>
					<CardHeader>
						<div className="flex justify-between items-start">
							<div>
								<CardTitle className="text-2xl">
									{/* FIX: Tampilkan Job Role atau pesan loading/default yang lebih baik */}
									{vacancyDetails?.jobRole?.name || "Memuat Job Role..."}
								</CardTitle>
								<CardDescription className="mt-2">
									{vacancyDetails?.description || "Tidak ada deskripsi."}
								</CardDescription>
							</div>
							{/* FIX: Menambahkan padding dan ukuran font untuk badge */}
							<Badge
								variant={vacancyDetails?.isPublished ? "default" : "secondary"}
								className="px-4 py-2 text-base"
							>
								{vacancyDetails?.isPublished ? "Published" : "Draft"}
							</Badge>
						</div>
					</CardHeader>
				</Card>

				<div className="grid gap-4 md:grid-cols-3">
					<StatCard
						title="Total Peminat"
						value={interestedEmployees.length}
						icon={Users}
					/>
					<StatCard
						title="Bersedia Relokasi"
						value={`${relocationStats.willing} (${relocationStats.percentage})`}
						icon={Check}
					/>
					<StatCard
						title="Tidak Bersedia Relokasi"
						value={relocationStats.notWilling}
						icon={X}
					/>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Daftar Peminat</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									{columns.map((col, index) => (
										<TableHead key={index}>
											{typeof col.header === "string" ? col.header : ""}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{interestedEmployees.length > 0 ? (
									interestedEmployees.map((employee) => (
										<TableRow key={employee.employeeId}>
											<TableCell>{employee.fullName}</TableCell>
											<TableCell>{employee.currentPosition}</TableCell>
											<TableCell>{employee.pathType}</TableCell>
											<TableCell>
												{employee.isWillingToRelocate ? (
													<Check className="h-5 w-5 text-green-600" />
												) : (
													<X className="h-5 w-5 text-red-600" />
												)}
											</TableCell>
											<TableCell>
												{formatInTimeZone(
													new Date(employee.appliedAt),
													"Asia/Jakarta",
													"dd MMM yyyy"
												)}
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														asChild
														className="cursor-pointer"
													>
														<Link
															href={`/admin/questionnaires/${employee.employeeId}`}
														>
															<FileQuestion className="mr-2 h-4 w-4" />{" "}
															Kuesioner
														</Link>
													</Button>
													<Button
														variant="outline"
														size="sm"
														asChild
														className="cursor-pointer"
													>
														<Link href={`/admin/forms`}>
															<FileText className="mr-2 h-4 w-4" /> Form
														</Link>
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Belum ada peminat untuk lowongan ini.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
