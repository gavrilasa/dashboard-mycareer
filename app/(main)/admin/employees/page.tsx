"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";
import { SyncModal } from "@/components/admin/SyncModal";
import { EmployeeForm } from "@/components/admin/EmployeeForm";

interface Employee {
	id: string;
	employeeId: string;
	fullName: string;
	position: { name: string } | null;
	department: { name: string } | null;
	branch: { name: string } | null;
}

interface PaginationInfo {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

interface PaginatedApiResponse {
	data: Omit<Employee, "id">[];
	pagination: {
		totalItems: number;
		totalPages: number;
		currentPage: number;
	};
}

export default function EmployeesPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<Employee[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalRecords: 0,
		totalPages: 0,
		currentPage: 1,
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);

	const { canCreate, canEdit, canDelete, canUpload } = useMemo(() => {
		if (!session?.user?.role)
			return {
				canCreate: false,
				canEdit: false,
				canDelete: false,
				canUpload: false,
			};
		const userPermissions = PERMISSIONS[session.user.role]?.employee || [];
		return {
			canCreate: userPermissions.includes("create"),
			canEdit: userPermissions.includes("update"),
			canDelete: userPermissions.includes("delete"),
			canUpload: userPermissions.includes("upload"),
		};
	}, [session]);

	const fetchEmployees = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/employees?${params.toString()}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memuat data");
			}
			const result: PaginatedApiResponse = await response.json();

			setData(result.data.map((emp) => ({ ...emp, id: emp.employeeId })));

			setPagination({
				totalRecords: result.pagination.totalItems || 0,
				totalPages: result.pagination.totalPages || 0,
				currentPage: result.pagination.currentPage || 1,
			});
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Gagal memuat data",
			});
			setData([]);
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleOpenEditModal = useCallback(async (employee: Employee) => {
		try {
			const response = await fetch(
				`/api/admin/employees/${employee.employeeId}`
			);
			if (!response.ok) throw new Error("Gagal memuat detail karyawan.");

			const fullEmployeeData = await response.json();
			setSelectedEmployee({
				...fullEmployeeData,
				id: fullEmployeeData.employeeId,
			});
			setIsModalOpen(true);
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Gagal memuat data.",
			});
		}
	}, []);

	const handleDeleteConfirm = useCallback((employee: Employee) => {
		setSelectedEmployee(employee);
		setIsDeleteConfirmOpen(true);
	}, []);

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedEmployee(null);
	};

	const handleDelete = async () => {
		if (!selectedEmployee) return;
		try {
			const response = await fetch(
				`/api/admin/employees/${selectedEmployee.employeeId}`,
				{ method: "DELETE" }
			);
			if (response.status !== 204) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal menghapus karyawan");
			}
			toast.success("Sukses", {
				description: "Karyawan berhasil dihapus.",
			});
			fetchEmployees(); // Refresh data
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Gagal menghapus karyawan",
			});
		} finally {
			setIsDeleteConfirmOpen(false);
			setSelectedEmployee(null);
		}
	};

	const columns = useMemo<ColumnDef<Employee>[]>(() => {
		const baseColumns: ColumnDef<Employee>[] = [
			{ accessorKey: "employeeId", header: "ID" },
			{ accessorKey: "fullName", header: "Nama" },
			{
				accessorKey: "position.name",
				header: "Posisi",
				cell: ({ row }) => row.original.position?.name || "-",
			},
			{
				accessorKey: "department.name",
				header: "Departemen",
				cell: ({ row }) => row.original.department?.name || "-",
			},
			{
				accessorKey: "branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
			},
		];

		if (canEdit || canDelete) {
			baseColumns.push({
				id: "actions",
				header: "Aksi",
				size: 100,
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						{canEdit && (
							<Button
								onClick={() => handleOpenEditModal(row.original)}
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-gray-500 hover:text-blue-600"
							>
								<Edit size={16} />
							</Button>
						)}
						{canDelete && (
							<Button
								onClick={() => handleDeleteConfirm(row.original)}
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-gray-500 hover:text-red-600"
							>
								<Trash2 size={16} />
							</Button>
						)}
					</div>
				),
			});
		}
		return baseColumns;
	}, [canEdit, canDelete, handleOpenEditModal, handleDeleteConfirm]);

	return (
		<>
			<Toaster position="top-center" richColors />

			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Data Karyawan</h1>
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
						currentPage: pagination.currentPage,
						totalPages: pagination.totalPages,
						totalRecords: pagination.totalRecords,
						onPageChange: setPage,
					}}
					createButton={
						<div className="flex gap-2">
							{canUpload && (
								<Button
									variant="outline"
									onClick={() => setIsSyncModalOpen(true)}
								>
									<RefreshCcw className="mr-2 h-4 w-4" />
									Sinkronisasi Data
								</Button>
							)}
							{canCreate && (
								<Button
									onClick={() => {
										setSelectedEmployee(null);
										setIsModalOpen(true);
									}}
								>
									<Plus className="mr-2 h-4 w-4" />
									Tambah Karyawan
								</Button>
							)}
						</div>
					}
				/>
			</div>

			{/* Add/Edit Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>
							{selectedEmployee ? "Edit Karyawan" : "Tambah Karyawan Baru"}
						</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<EmployeeForm
							initialData={selectedEmployee || {}}
							onSuccess={() => {
								handleCloseModal();
								fetchEmployees();
							}}
							onCancel={handleCloseModal}
						/>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={isDeleteConfirmOpen}
				onOpenChange={setIsDeleteConfirmOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
						<AlertDialogDescription>
							Tindakan ini akan menghapus karyawan:{" "}
							<span className="font-semibold">
								{selectedEmployee?.fullName}
							</span>
							.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<SyncModal
				isOpen={isSyncModalOpen}
				onClose={() => setIsSyncModalOpen(false)}
				onSuccess={() => {
					fetchEmployees();
					setIsSyncModalOpen(false);
				}}
			/>
		</>
	);
}
