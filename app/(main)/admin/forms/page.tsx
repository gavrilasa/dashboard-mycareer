// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/app/(main)/admin/forms/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { FormViewerDialog } from "@/components/admin/FormViewerDialog";
import {
	GkmRole,
	ProjectRole,
	CareerHistory,
	OrganizationHistory,
	CommitteeHistory,
	ProjectHistory,
} from "@prisma/client";

// --- Definisi Tipe ---
interface FormSubmission {
	id: string;
	employeeId: string;
	fullName: string;
	submissionStatus: "Submitted" | "Not Submitted";
	branch: { name: string } | null;
	department: { name: string } | null;
	position: { name: string } | null;
}

interface PaginationState {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

interface FullFormData {
	careerHistories: CareerHistory[];
	organizationHistories: OrganizationHistory[];
	committeeHistories: CommitteeHistory[];
	projectHistories: ProjectHistory[];
	gkmHistory: { participationCount: number; highestRole: GkmRole } | null;
	bestEmployeeScore: { count: number } | null;
	careerPreference: {
		preferredMentor: string | null;
		preferredTraining: string | null;
	} | null;
}

export default function AdminFormsPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<FormSubmission[]>([]);
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

	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [selectedFormData, setSelectedFormData] = useState<FullFormData | null>(
		null
	);
	const [isModalLoading, setIsModalLoading] = useState(false);

	const { canRead } = useMemo(() => {
		if (!session?.user?.role) return { canRead: false };
		const perms = PERMISSIONS[session.user.role]?.form || [];
		return {
			canRead: perms.includes("read"),
		};
	}, [session]);

	const fetchForms = useCallback(async () => {
		if (!canRead) {
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
			const response = await fetch(`/api/admin/forms?${params.toString()}`);
			if (!response.ok)
				throw new Error(
					(await response.json()).message || "Gagal memuat data formulir"
				);
			const result = await response.json();
			const formattedData = result.data.map(
				(item: Omit<FormSubmission, "id">) => ({ ...item, id: item.employeeId })
			);
			setData(formattedData || []);
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
	}, [page, limit, debouncedSearchTerm, canRead]);

	useEffect(() => {
		fetchForms();
	}, [fetchForms]);
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleOpenViewModal = async (employee: FormSubmission) => {
		setSelectedEmployee({ id: employee.employeeId, name: employee.fullName });
		setIsViewModalOpen(true);
		setIsModalLoading(true);
		try {
			const response = await fetch(`/api/admin/forms/${employee.employeeId}`);
			if (!response.ok) throw new Error("Gagal mengambil detail formulir.");
			const formData = await response.json();
			setSelectedFormData(formData);
		} catch (error) {
			toast.error("Gagal Memuat Detail", {
				description: (error as Error).message,
			});
			setIsViewModalOpen(false);
		} finally {
			setIsModalLoading(false);
		}
	};

	const handleCloseModal = () => {
		setIsViewModalOpen(false);
		setSelectedEmployee(null);
		setSelectedFormData(null);
	};

	const columns = useMemo<ColumnDef<FormSubmission>[]>(() => {
		return [
			{ accessorKey: "employeeId", header: "ID Karyawan" },
			{ accessorKey: "fullName", header: "Nama Lengkap" },
			{
				accessorKey: "branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
			},
			{
				accessorKey: "department.name",
				header: "Departemen",
				cell: ({ row }) => row.original.department?.name || "-",
			},
			{
				accessorKey: "submissionStatus",
				header: "Status",
				cell: ({ row }) => (
					<Badge
						variant={
							row.original.submissionStatus === "Submitted"
								? "default"
								: "secondary"
						}
					>
						{row.original.submissionStatus}
					</Badge>
				),
			},
			{
				id: "actions",
				header: "Aksi",
				size: 100,
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						<Button
							onClick={() => handleOpenViewModal(row.original)}
							variant="ghost"
							size="icon"
							className="h-8 w-8"
						>
							<Eye size={16} />
						</Button>
					</div>
				),
			},
		];
	}, []);

	if (!canRead)
		return (
			<div className="container mx-auto py-10">
				<h1 className="text-xl text-red-600">
					Akses Ditolak: Anda tidak memiliki izin untuk melihat halaman ini.
				</h1>
			</div>
		);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Manajemen Formulir Karyawan</h1>
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
					createButton={null}
				/>
			</div>

			<FormViewerDialog
				isOpen={isViewModalOpen}
				onClose={handleCloseModal}
				isLoading={isModalLoading}
				formData={selectedFormData}
				employeeInfo={selectedEmployee}
			/>
		</>
	);
}
