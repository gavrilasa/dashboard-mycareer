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

// Import komponen dialog yang baru
import { CreateCareerPathDialog } from "@/components/admin/career-path/CreateCareerPathDialog";
import { EditCareerPathDialog } from "@/components/admin/career-path/EditCareerPathDialog";
import { DeleteCareerPathAlert } from "@/components/admin/career-path/DeleteCareerPathAlert";

// --- Type Definitions ---
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
interface CareerPath {
	id: string;
	fromPositionId: string;
	toPositionId: string;
	pathType: "ALIGN" | "CROSS";
	fromPosition: { name: string };
	toPosition: { name: string };
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
				meta: { width: "15%", truncate: false },
			},
			{
				accessorKey: "fromPosition.name",
				header: "Posisi Asal",
				size: 35,
				meta: { width: "35%", truncate: true },
			},
			{
				accessorKey: "toPosition.name",
				header: "Posisi Tujuan",
				size: 40,
				meta: { width: "40%", truncate: true },
			},
			{
				id: "actions",
				header: "Aksi",
				size: 10,
				meta: { width: "10%", truncate: false, align: "center" },
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2">
						{canEdit && (
							<Button
								onClick={() => handleOpenModal(row.original)}
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-gray-500 hover:text-primary"
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
			},
		],
		[canEdit, canDelete, handleOpenModal, handleDeleteConfirm]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold mb-4">Manajemen Jenjang Karier</h1>
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
							<Button onClick={() => handleOpenModal()}>
								<Plus className="mr-2 h-4 w-4" /> Buat Jenjang Karier
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
