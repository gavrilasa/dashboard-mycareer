// File: /app/(main)/admin/career-path/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";

// Import komponen dialog yang sudah ada (akan direfaktor di langkah berikutnya)
import { CreateCareerPathDialog } from "@/components/admin/career-path/CreateCareerPathDialog";
import { EditCareerPathDialog } from "@/components/admin/career-path/EditCareerPathDialog";
import { DeleteCareerPathAlert } from "@/components/admin/career-path/DeleteCareerPathAlert";

// --- Type Definitions (Diperbarui) ---
interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
	positions: MasterDataItem[];
	jobRoles: MasterDataItem[];
}
interface CareerPath {
	id: string;
	fromJobRoleId: string;
	toJobRoleId: string;
	pathType: "ALIGN" | "CROSS";
	period: "SHORT_TERM" | "LONG_TERM"; // FIX: Properti 'period' ditambahkan
	fromJobRole: { name: string };
	toJobRole: { name: string };
}
interface PaginationInfo {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

// --- Component Utama ---
export default function CareerPathPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<CareerPath[]>([]);
	const [masterData, setMasterData] = useState<MasterData>({
		branches: [],
		departments: [],
		positions: [],
		jobRoles: [],
	});
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

	const [modalState, setModalState] = useState<{
		mode: "create" | "edit" | "closed";
		data: CareerPath | null;
	}>({ mode: "closed", data: null });
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [pathToDelete, setPathToDelete] = useState<CareerPath | null>(null);

	const { canCreate, canEdit, canDelete } = useMemo(() => {
		if (!session?.user?.role)
			return { canCreate: false, canEdit: false, canDelete: false };
		const permissions = PERMISSIONS[session.user.role]?.careerPath || [];
		return {
			canCreate: permissions.includes("create"),
			canEdit: permissions.includes("update"),
			canDelete: permissions.includes("delete"),
		};
	}, [session]);

	const fetchCareerPaths = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(
				`/api/admin/career-path?${params.toString()}`
			);
			if (!response.ok) throw new Error("Gagal memuat jenjang karier");
			const result = await response.json();
			setData(result.data || []);
			setPagination(
				result.pagination || { totalRecords: 0, totalPages: 0, currentPage: 1 }
			);
		} catch (error) {
			toast.error("Error Memuat Data", {
				description: (error as Error).message,
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	const fetchMasterData = useCallback(async () => {
		try {
			const response = await fetch("/api/admin/master-data");
			if (!response.ok) throw new Error("Gagal memuat data master");
			setMasterData(await response.json());
		} catch (error) {
			toast.error("Error Memuat Master Data", {
				description: (error as Error).message,
			});
		}
	}, []);

	useEffect(() => {
		fetchCareerPaths();
		fetchMasterData();
	}, [fetchCareerPaths, fetchMasterData]);

	const handleOpenModal = useCallback(
		(path: CareerPath | null = null) => {
			if (path && canEdit) {
				setModalState({ mode: "edit", data: path });
			} else if (!path && canCreate) {
				setModalState({ mode: "create", data: null });
			}
		},
		[canCreate, canEdit]
	);

	const handleCloseModal = () => setModalState({ mode: "closed", data: null });

	const handleDeleteConfirm = useCallback((path: CareerPath) => {
		setPathToDelete(path);
		setIsDeleteAlertOpen(true);
	}, []);

	const columns = useMemo<ColumnDef<CareerPath>[]>(
		() => [
			{
				accessorKey: "pathType",
				header: "Tipe",
				size: 15,
				meta: {
					width: "15%",
				},
			},
			{
				accessorKey: "fromJobRole.name",
				header: "Karir Asal",
				size: 35,
				meta: {
					width: "35%",
				},
			},
			{
				accessorKey: "toJobRole.name",
				header: "Karir Tujuan",
				size: 40,
				meta: {
					width: "40%",
				},
			},
			{
				id: "actions",
				header: "Aksi",
				size: 10,
				meta: {
					align: "center",
					width: "10%",
				},
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						{canEdit && (
							<Button
								onClick={() => handleOpenModal(row.original)}
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-gray-500 cursor-pointer hover:text-primary"
							>
								<Edit size={16} />
							</Button>
						)}
						{canDelete && (
							<Button
								onClick={() => handleDeleteConfirm(row.original)}
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-gray-500 cursor-pointer hover:text-red-600"
							>
								<Trash2 size={16} />
							</Button>
						)}
					</div>
				),
			},
		],
		[canEdit, canDelete, handleOpenModal, handleDeleteConfirm]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container py-10 mx-auto">
				<h1 className="mb-4 text-2xl font-bold">Manajemen Jenjang Karier</h1>
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
					createButton={
						canCreate ? (
							<Button
								onClick={() => handleOpenModal()}
								className="cursor-pointer"
							>
								<Plus className="w-4 h-4 mr-2" /> Buat Jenjang Karier
							</Button>
						) : null
					}
				/>
			</div>

			<CreateCareerPathDialog
				open={modalState.mode === "create"}
				onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
				masterData={masterData}
				onSuccess={() => {
					handleCloseModal();
					fetchCareerPaths();
				}}
			/>

			<EditCareerPathDialog
				open={modalState.mode === "edit"}
				onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
				editingPath={modalState.data}
				masterData={masterData}
				onSuccess={() => {
					handleCloseModal();
					fetchCareerPaths();
				}}
			/>

			<DeleteCareerPathAlert
				open={isDeleteAlertOpen}
				onOpenChange={setIsDeleteAlertOpen}
				pathToDelete={pathToDelete}
				onSuccess={() => {
					setIsDeleteAlertOpen(false);
					fetchCareerPaths();
				}}
			/>
		</>
	);
}
