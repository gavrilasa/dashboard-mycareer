// app/(main)/admin/departments/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";
import {
	FilterPopover,
	ActiveFilters,
	FilterConfigItem,
} from "@/components/common/FilterPopover";

// --- Type Definitions ---
interface Department {
	id: string;
	name: string;
	branch: { name: string } | null;
}

interface PaginationState {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	branches: MasterDataItem[];
}

export default function DepartmentsPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<Department[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		totalRecords: 0,
		totalPages: 0,
		currentPage: 1,
	});
	const [masterData, setMasterData] = useState<MasterData>({
		branches: [],
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [filters, setFilters] = useState<ActiveFilters>({ branchId: "" });
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "name", desc: false },
	]);

	const canReadDepartments = useMemo(() => {
		if (!session?.user?.role) return false;
		return (
			PERMISSIONS[session.user.role]?.department?.includes("read") ?? false
		);
	}, [session]);

	const fetchDepartments = useCallback(async () => {
		if (!canReadDepartments) {
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
				branchId: filters.branchId || "",
			});

			if (sorting.length > 0) {
				params.append("sortBy", sorting[0].id);
				params.append("sortOrder", sorting[0].desc ? "desc" : "asc");
			}

			const response = await fetch(
				`/api/admin/departments?${params.toString()}`
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memuat departemen");
			}
			const result = await response.json();
			setData(result.data || []);
			setPagination({
				totalRecords: result.pagination.totalItems || 0,
				totalPages: result.pagination.totalPages || 0,
				currentPage: result.pagination.currentPage || 1,
			});
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Tidak dapat memuat data.",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm, canReadDepartments, filters, sorting]);

	const fetchMasterData = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/master-data");
			if (!res.ok) throw new Error("Gagal memuat data master untuk filter.");
			const data = await res.json();
			setMasterData({
				branches: data.branches,
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Gagal Memuat Filter", { description: error.message });
			}
		}
	}, []);

	useEffect(() => {
		fetchMasterData();
	}, [fetchMasterData]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm, filters, sorting]);

	const columns = useMemo<ColumnDef<Department>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Nama Departemen",
				meta: { sortable: true },
			},
			{
				accessorKey: "branch.name",
				id: "branch",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
				meta: { sortable: true },
			},
		],
		[]
	);

	const filterConfig: FilterConfigItem[] = [
		{
			key: "branchId",
			label: "Cabang",
			placeholder: "Pilih Cabang",
			options: masterData.branches,
		},
	];

	if (!canReadDepartments) {
		return null;
	}

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Data Departemen</h1>
				</div>
				<CrudTable
					columns={columns}
					data={data}
					loading={loading}
					search={searchTerm}
					onSearchChange={setSearchTerm}
					pagination={{
						currentPage: pagination.currentPage,
						totalPages: pagination.totalPages,
						totalRecords: pagination.totalRecords,
						onPageChange: setPage,
					}}
					limit={limit}
					onLimitChange={setLimit}
					sorting={sorting}
					setSorting={setSorting}
					filterContent={
						<FilterPopover
							masterData={{
								branches: masterData.branches,
							}}
							activeFilters={filters}
							onApplyFilters={setFilters}
							filterConfig={filterConfig}
						/>
					}
					createButton={null}
				/>
			</div>
		</>
	);
}
