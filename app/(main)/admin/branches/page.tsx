"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";

// --- Type Definitions ---
interface Branch {
	id: string;
	name: string;
	location: string | null;
}

interface PaginationState {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

export default function BranchesPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<Branch[]>([]);
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
	// This page is only visible if the user has 'read' permission for the 'branch' resource.
	const canReadBranches = useMemo(() => {
		if (!session?.user?.role) return false;
		return PERMISSIONS[session.user.role]?.branch?.includes("read") ?? false;
	}, [session]);

	const fetchBranches = useCallback(async () => {
		if (!canReadBranches) {
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
			const response = await fetch(`/api/admin/branches?${params.toString()}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memuat data cabang");
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
	}, [page, limit, debouncedSearchTerm, canReadBranches]);

	useEffect(() => {
		fetchBranches();
	}, [fetchBranches]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	// --- Table Column Definitions (Read-Only) ---
	const columns = useMemo<ColumnDef<Branch>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID Cabang",
				size: 10,
				meta: { width: "10%", truncate: false },
			},
			{
				accessorKey: "name",
				header: "Nama Cabang",
				size: 25,
				meta: { width: "25%", truncate: false },
			},
			{
				accessorKey: "location",
				header: "Lokasi",
				cell: ({ row }) => row.original.location || "-",
				size: 65,
				meta: { width: "65%", truncate: true },
			},
		],
		[]
	);

	// --- Conditional Rendering based on permissions ---
	// If the user does not have permission, the entire page component renders nothing.
	if (!canReadBranches) {
		return null;
	}

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Manajemen Cabang</h1>
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
					// No createButton is passed, ensuring the table is strictly read-only.
					createButton={null}
				/>
			</div>
		</>
	);
}
