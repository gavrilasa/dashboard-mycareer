// app/(main)/admin/job-vacancies/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";

import { CrudTable } from "@/components/common/CrudTable";
import {
	FilterPopover,
	ActiveFilters,
	FilterConfigItem,
} from "@/components/common/FilterPopover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Plus, Eye } from "lucide-react";
import { JobVacancyForm } from "@/components/admin/job-vacant/JobVacancyForm";

// --- Type Definitions ---
interface JobVacancy {
	id: string;
	isPublished: boolean;
	jobRole: { name: string } | null;
	_count: { interestedEmployees: number };
}

interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	jobRolesForVacancy?: MasterDataItem[];
}

export default function JobVacanciesPage() {
	const { data: session } = useSession();
	const router = useRouter();
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
	const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(
		null
	);
	const [filters, setFilters] = useState<ActiveFilters>({ status: "" });
	const [sorting, setSorting] = useState<SortingState>([]);

	const { canCreate, canEdit } = useMemo(() => {
		if (!session?.user?.role) return { canCreate: false, canEdit: false };
		const permissions = PERMISSIONS[session.user.role]?.jobVacant || [];
		return {
			canCreate: permissions.includes("create"),
			canEdit: permissions.includes("update"),
		};
	}, [session]);

	const fetchVacancies = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
				status: filters.status || "",
			});
			if (sorting.length > 0) {
				params.append("sortBy", sorting[0].id);
				params.append("sortOrder", sorting[0].desc ? "desc" : "asc");
			}
			const response = await fetch(
				`/api/admin/job-vacancies?${params.toString()}`
			);
			if (!response.ok)
				throw new Error(
					(await response.json()).message || "Gagal memuat lowongan"
				);
			const result = await response.json();
			setData(result.data || []);

			// PERBAIKAN: Petakan properti dari API ke state dengan benar
			if (result.pagination) {
				setPagination({
					totalRecords: result.pagination.totalItems,
					totalPages: result.pagination.totalPages,
					currentPage: result.pagination.currentPage,
				});
			} else {
				setPagination({ totalRecords: 0, totalPages: 0, currentPage: 1 });
			}
		} catch (error) {
			toast.error("Error Memuat Data", {
				description: (error as Error).message,
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm, filters, sorting]);

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
		fetchMasterData();
	}, [fetchMasterData]);

	useEffect(() => {
		fetchVacancies();
	}, [fetchVacancies]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm, filters, sorting]);

	const handleOpenFormModal = (vacancy: JobVacancy | null) => {
		setSelectedVacancy(vacancy);
		setIsFormModalOpen(true);
	};

	const handleCloseModals = () => {
		setIsFormModalOpen(false);
		setSelectedVacancy(null);
	};

	const columns = useMemo<ColumnDef<JobVacancy>[]>(
		() => [
			{
				accessorKey: "jobRole.name",
				header: "Job Role",
				cell: ({ row }) => row.original.jobRole?.name || "-",
				size: 55,
			},
			{
				accessorKey: "isPublished",
				header: "Status",
				cell: ({ row }) => (
					<Badge variant={row.original.isPublished ? "default" : "secondary"}>
						{row.original.isPublished ? "Published" : "Draft"}
					</Badge>
				),
				size: 15,
			},
			{
				id: "interestedEmployees",
				accessorKey: "_count.interestedEmployees",
				header: "Peminat",
				cell: ({ row }) => row.original._count.interestedEmployees,
				size: 15,
				meta: {
					sortable: true,
				},
			},
			{
				id: "actions",
				header: "Aksi",
				size: 15,
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						<Button
							onClick={() =>
								router.push(`/admin/job-vacancies/${row.original.id}`)
							}
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
					</div>
				),
			},
		],
		[canEdit, router]
	);

	const filterConfig: FilterConfigItem[] = [
		{
			key: "status",
			label: "Status",
			placeholder: "Pilih Status",
			options: [
				{ id: "published", name: "Published" },
				{ id: "draft", name: "Draft" },
			],
		},
	];

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
					sorting={sorting}
					setSorting={setSorting}
					filterContent={
						<FilterPopover
							masterData={{}}
							activeFilters={filters}
							onApplyFilters={setFilters}
							filterConfig={filterConfig}
						/>
					}
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
				<DialogContent className="sm:max-w-xl">
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
		</>
	);
}
