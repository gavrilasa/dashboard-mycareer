"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

// Tipe data untuk Department
interface Department {
	id: string;
	name: string;
	branch: { name: string } | null;
}

// Tipe untuk informasi paginasi dari API
interface PaginationInfo {
	totalItems: number;
	totalPages: number;
}

// Tipe untuk respons API yang dipaginasi
interface PaginatedApiResponse {
	data: Department[];
	pagination: PaginationInfo;
}

export default function DepartmentsPage() {
	const [data, setData] = useState<Department[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalItems: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const fetchDepartments = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				q: debouncedSearchTerm,
			});
			const response = await fetch(
				`/api/admin/departments?${params.toString()}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch departments");
			}
			const result: PaginatedApiResponse = await response.json();

			setData(result.data || []);
			setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			toast.error("Error fetching departments", { description: errorMessage });
			setData([]);
			setPagination({ totalItems: 0, totalPages: 0 });
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	// Atur ulang halaman ke 1 saat pencarian atau batas entri berubah
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	// Definisi kolom untuk TanStack Table
	const columns: ColumnDef<Department>[] = [
		{
			accessorKey: "name",
			header: "Department Name",
		},
		{
			accessorKey: "branch.name",
			header: "Branch",
			cell: ({ row }) => row.original.branch?.name || "-",
		},
	];

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">Departments</h1>

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
