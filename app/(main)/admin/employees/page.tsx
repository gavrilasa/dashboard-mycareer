"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import { SyncModal } from "@/components/admin/SyncModal";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

// --- Type Definitions ---
// The data item must have an 'id' for the table row key
interface Employee {
	id: string;
	employeeId: string;
	fullName: string;
	position: { name: string } | null;
	department: { name: string } | null;
	branch: { name: string } | null;
}

interface PaginationInfo {
	totalItems: number;
	totalPages: number;
}

interface PaginatedApiResponse {
	data: Employee[];
	pagination: PaginationInfo;
}

export default function EmployeesPage() {
	const [data, setData] = useState<Employee[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalItems: 0,
		totalPages: 0,
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

	const fetchEmployees = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				q: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/employees?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const result: PaginatedApiResponse = await response.json();

			setData(result.data || []);
			setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred.";
			toast.error("Error fetching employees", { description: errorMessage });
			setData([]);
			setPagination({ totalItems: 0, totalPages: 0 });
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	// Reset page to 1 when search term or limit changes
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleEdit = (employee: Employee) =>
		toast.info(`Editing employee: ${employee.fullName}`);
	const handleDelete = (employee: Employee) =>
		toast.warning(`Deleting employee: ${employee.fullName}`);

	// Define columns using ColumnDef for TanStack Table
	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: "employeeId",
			header: "ID",
			size: 120, // Example of setting a width
		},
		{
			accessorKey: "fullName",
			header: "Name",
		},
		{
			accessorKey: "position.name",
			header: "Position",
			cell: ({ row }) => row.original.position?.name || "-",
		},
		{
			accessorKey: "department.name",
			header: "Department",
			cell: ({ row }) => row.original.department?.name || "-",
		},
		{
			accessorKey: "branch.name",
			header: "Branch",
			cell: ({ row }) => row.original.branch?.name || "-",
		},
		{
			id: "actions",
			header: "Action",
			size: 100,
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-2">
					<Button
						onClick={() => handleEdit(row.original)}
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-500 hover:text-blue-600"
					>
						<Edit size={16} />
					</Button>
					<Button
						onClick={() => handleDelete(row.original)}
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-500 hover:text-red-600"
					>
						<Trash2 size={16} />
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-800">Employees</h1>
					<Button variant="default" onClick={() => setIsSyncModalOpen(true)}>
						<RefreshCcw className="mr-2 h-4 w-4" />
						Synchronize Data
					</Button>
				</div>

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

				<SyncModal
					isOpen={isSyncModalOpen}
					onClose={() => setIsSyncModalOpen(false)}
					onSuccess={() => {
						fetchEmployees();
						setIsSyncModalOpen(false);
					}}
				/>
			</div>
		</>
	);
}
