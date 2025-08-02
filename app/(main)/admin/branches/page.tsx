"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

// Tipe data untuk Branch
interface Branch {
	id: string;
	name: string;
	location: string | null;
}

// Tipe untuk informasi paginasi dari API
interface PaginationInfo {
	totalItems: number;
	totalPages: number;
}

// Tipe untuk respons API yang dipaginasi
interface PaginatedApiResponse {
	data: Branch[];
	pagination: PaginationInfo;
}

export default function BranchesPage() {
	const [data, setData] = useState<Branch[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalItems: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const fetchBranches = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				q: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/branches?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch branches");
			}
			const result: PaginatedApiResponse = await response.json();

			setData(result.data || []);
			setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			toast.error("Error fetching branches", { description: errorMessage });
			setData([]);
			setPagination({ totalItems: 0, totalPages: 0 });
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchBranches();
	}, [fetchBranches]);

	// Atur ulang halaman ke 1 saat pencarian atau batas entri berubah
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const columns: ColumnDef<Branch>[] = [
		{
			accessorKey: "id",
			header: "Branch ID",
			meta: {
				width: "10%",
			},
		},
		{
			accessorKey: "name",
			header: "Branch Name",
			meta: {
				width: "30%",
			},
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) => row.original.location || "-",
			meta: {
				width: "60%",
			},
		},
	];

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">Branches</h1>

				<CrudTable
					columns={columns}
					data={data}
					loading={loading}
					limit={limit}
					onLimitChange={setLimit}
					search={searchTerm}
					onSearchChange={setSearchTerm}
					pagination={{
						currentPage: page,
						totalPages: pagination.totalPages,
						totalRecords: pagination.totalItems,
						onPageChange: setPage,
					}}
				/>
			</div>
		</>
	);
}
