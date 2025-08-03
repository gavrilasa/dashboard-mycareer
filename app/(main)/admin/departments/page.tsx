"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";

// --- Type Definitions ---
interface Department {
	id: string;
	name: string;
	branch: { name: string } | null;
}

// FIX: This interface is simplified as the full object is constructed directly in the component
interface PaginationState {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

export default function DepartmentsPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<Department[]>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		totalRecords: 0,
		totalPages: 0,
		currentPage: 1,
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// --- RBAC Permissions Check ---
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
			});
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
	}, [page, limit, debouncedSearchTerm, canReadDepartments]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	// --- Table Column Definitions (Read-Only) ---
	const columns = useMemo<ColumnDef<Department>[]>(
		() => [
			{ accessorKey: "name", header: "Nama Departemen" },
			{
				accessorKey: "branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
			},
		],
		[]
	);

	// --- Conditional Rendering ---
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
					createButton={null}
				/>
			</div>
		</>
	);
}
