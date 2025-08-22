"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";

import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Plus, Trash2, Eye } from "lucide-react";
import { JobVacancyForm } from "@/components/admin/job-vacant/JobVacancyForm";
import { InterestedEmployeesDialog } from "@/components/admin/job-vacant/InterestedEmployeesDialog";
// Anda mungkin perlu membuat komponen DeleteAlert terpisah seperti pada fitur lain
// import { DeleteVacancyAlert } from "@/components/admin/job-vacant/DeleteVacancyAlert";

// --- Type Definitions ---
interface JobVacancy {
	id: string;
	title: string;
	isPublished: boolean;
	branch: { name: string } | null;
	department: { name: string } | null;
	position: { name: string } | null;
	_count: { interestedEmployees: number };
}

interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
	departmentId?: string;
}
interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
	positions: MasterDataItem[];
}

export default function JobVacanciesPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<JobVacancy[]>([]);
	const [pagination, setPagination] = useState({
		totalRecords: 0,
		totalPages: 0,
		currentPage: 1,
	});
	const [masterData, setMasterData] = useState<MasterData | null>(null);
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [isFormModalOpen, setIsFormModalOpen] = useState(false);
	const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
	const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(
		null
	);

	const { canCreate, canEdit, canDelete } = useMemo(() => {
		if (!session?.user?.role)
			return { canCreate: false, canEdit: false, canDelete: false };
		const permissions = PERMISSIONS[session.user.role]?.jobVacant || [];
		return {
			canCreate: permissions.includes("create"),
			canEdit: permissions.includes("update"),
			canDelete: permissions.includes("delete"),
		};
	}, [session]);

	const fetchVacancies = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(
				`/api/admin/job-vacancies?${params.toString()}`
			);
			if (!response.ok)
				throw new Error(
					(await response.json()).message || "Gagal memuat lowongan"
				);
			const result = await response.json();
			setData(result.data || []);
			setPagination(
				result.pagination || { totalRecords: 0, totalPages: 0, currentPage: 1 }
			);
		} catch (error) {
			toast.error("Error Memuat Data", {
				description: (error as Error).message,
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	const fetchMasterData = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/master-data");
			if (!res.ok) throw new Error("Gagal memuat data master");
			setMasterData(await res.json());
		} catch (error) {
			toast.error("Error Master Data", {
				description: (error as Error).message,
			});
		}
	}, []);

	useEffect(() => {
		fetchVacancies();
		fetchMasterData();
	}, [fetchVacancies, fetchMasterData]);

	const handleOpenFormModal = (vacancy: JobVacancy | null) => {
		setSelectedVacancy(vacancy);
		setIsFormModalOpen(true);
	};

	const handleOpenInterestModal = (vacancy: JobVacancy) => {
		setSelectedVacancy(vacancy);
		setIsInterestModalOpen(true);
	};

	const handleCloseModals = () => {
		setIsFormModalOpen(false);
		setIsInterestModalOpen(false);
		setSelectedVacancy(null);
	};

	const columns = useMemo<ColumnDef<JobVacancy>[]>(
		() => [
			{ accessorKey: "title", header: "Judul", size: 30 },
			{
				accessorKey: "position.name",
				header: "Posisi",
				cell: ({ row }) => row.original.position?.name || "-",
				size: 20,
			},
			{
				accessorKey: "branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
				size: 15,
			},
			{
				accessorKey: "isPublished",
				header: "Status",
				cell: ({ row }) => (
					<Badge variant={row.original.isPublished ? "default" : "secondary"}>
						{row.original.isPublished ? "Published" : "Draft"}
					</Badge>
				),
				size: 10,
			},
			{
				accessorKey: "_count.interestedEmployees",
				header: "Peminat",
				cell: ({ row }) => row.original._count.interestedEmployees,
				size: 10,
			},
			{
				id: "actions",
				header: "Aksi",
				size: 15,
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						<Button
							onClick={() => handleOpenInterestModal(row.original)}
							variant="ghost"
							size="icon"
							className="h-8 w-8"
						>
							<Eye size={16} />
						</Button>
						{canEdit && (
							<Button
								onClick={() => handleOpenFormModal(row.original)}
								variant="ghost"
								size="icon"
								className="h-8 w-8"
							>
								<Edit size={16} />
							</Button>
						)}
						{/* {canDelete && <Button onClick={() => {}} variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"><Trash2 size={16} /></Button>} */}
					</div>
				),
			},
		],
		[canEdit, canDelete]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Manajemen Lowongan Pekerjaan</h1>
				</div>
				<CrudTable
					columns={columns}
					data={data}
					loading={loading}
					search={searchTerm}
					onSearchChange={setSearchTerm}
					pagination={{ ...pagination, onPageChange: setPage }}
					limit={limit}
					onLimitChange={setLimit}
					createButton={
						canCreate ? (
							<Button onClick={() => handleOpenFormModal(null)}>
								<Plus className="mr-2 h-4 w-4" /> Buat Lowongan
							</Button>
						) : null
					}
				/>
			</div>

			<Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							{selectedVacancy ? "Edit Lowongan" : "Buat Lowongan Baru"}
						</DialogTitle>
					</DialogHeader>
					<JobVacancyForm
						initialData={selectedVacancy || {}}
						masterData={masterData}
						onSuccess={() => {
							handleCloseModals();
							fetchVacancies();
						}}
						onCancel={handleCloseModals}
					/>
				</DialogContent>
			</Dialog>

			<InterestedEmployeesDialog
				open={isInterestModalOpen}
				onOpenChange={setIsInterestModalOpen}
				jobVacancyId={selectedVacancy?.id || null}
				vacancyTitle={selectedVacancy?.title || null}
			/>
		</>
	);
}
