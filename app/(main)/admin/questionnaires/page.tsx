// app/(main)/admin/questionnaires/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { CrudTable } from "@/components/common/CrudTable";
import {
	FilterPopover,
	ActiveFilters,
	FilterConfigItem,
} from "@/components/common/FilterPopover";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// --- Type Definitions ---
interface SummaryResult {
	id: string;
	employeeId: string;
	fullName: string;
	positionName: string;
	departmentName: string;
	branchName: string;
	overallAverageScore: number;
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

interface ApiResponse {
	data: Omit<SummaryResult, "id">[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export default function QuestionnaireResultsPage() {
	const router = useRouter();
	const [data, setData] = useState<SummaryResult[]>([]);
	const [masterData, setMasterData] = useState<MasterData>({
		branches: [],
		departments: [],
		positions: [],
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalRecords: 0,
	});
	const [filters, setFilters] = useState<ActiveFilters>({
		branchId: "",
		departmentId: "",
		positionId: "",
	});
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "fullName", desc: false },
	]);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const fetchMasterData = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/master-data");
			if (!res.ok) throw new Error("Gagal memuat data master untuk filter.");
			const data = await res.json();
			setMasterData(data);
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Gagal Memuat Filter", { description: error.message });
			}
		}
	}, []);

	const fetchResults = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
				branchId: filters.branchId || "",
				departmentId: filters.departmentId || "",
				positionId: filters.positionId || "",
			});

			if (sorting.length > 0) {
				params.append("sortBy", sorting[0].id);
				params.append("sortOrder", sorting[0].desc ? "desc" : "asc");
			}

			const response = await fetch(
				`/api/admin/competency-results?${params.toString()}`
			);

			if (!response.ok) {
				throw new Error(
					(await response.json()).message || "Gagal memuat hasil."
				);
			}

			const result: ApiResponse = await response.json();
			const formattedData = result.data.map((item) => ({
				...item,
				id: item.employeeId,
			}));
			setData(formattedData);
			setPagination({
				currentPage: result.meta.page,
				totalPages: result.meta.totalPages,
				totalRecords: result.meta.total,
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Gagal Memuat Data", { description: error.message });
			}
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm, filters, sorting]);

	useEffect(() => {
		fetchMasterData();
	}, [fetchMasterData]);

	useEffect(() => {
		fetchResults();
	}, [fetchResults]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm, filters, sorting]);

	const columns = useMemo<ColumnDef<SummaryResult>[]>(
		() => [
			{
				accessorKey: "fullName",
				header: "Nama",
				size: 20,
				meta: {
					width: "20%",
					truncate: true,
					sortable: true,
				},
			},
			{
				accessorKey: "positionName",
				header: "Jabatan",
				size: 20,
				meta: {
					width: "20%",
					truncate: true,
				},
			},
			{
				accessorKey: "branchName",
				header: "Cabang",
				size: 25,
				meta: {
					width: "25%",
					truncate: true,
				},
			},
			{
				accessorKey: "departmentName",
				header: "Departemen",
				size: 15,
				meta: {
					width: "15%",
					truncate: true,
				},
			},
			{
				accessorKey: "overallAverageScore",
				header: "Nilai",
				size: 10,
				meta: {
					width: "10%",
					truncate: false,
					align: "center",
				},
				cell: ({ row }) => row.original.overallAverageScore.toFixed(2),
			},
			{
				id: "actions",
				header: "Aksi",
				size: 10,
				meta: {
					width: "10%",
					truncate: false,
					align: "center",
				},
				cell: ({ row }) => (
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							router.push(`/admin/questionnaires/${row.original.employeeId}`)
						}
						className="text-gray-500 hover:text-primary cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</Button>
				),
			},
		],
		[router]
	);

	const filterConfig: FilterConfigItem[] = [
		{
			key: "branchId",
			label: "Cabang",
			placeholder: "Pilih Cabang",
			options: masterData.branches,
		},
		{
			key: "departmentId",
			label: "Departemen",
			placeholder: "Pilih Departemen",
			options: masterData.departments,
			dependsOn: "branchId",
			dependencyMapKey: "branchId",
		},
		{
			key: "positionId",
			label: "Jabatan",
			placeholder: "Pilih Jabatan",
			options: masterData.positions,
			dependsOn: "departmentId",
			dependencyMapKey: "departmentId",
		},
	];

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Hasil Kuesioner Kompetensi</h1>
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
							masterData={masterData}
							activeFilters={filters}
							onApplyFilters={setFilters}
							filterConfig={filterConfig}
						/>
					}
				/>
			</div>
		</>
	);
}
