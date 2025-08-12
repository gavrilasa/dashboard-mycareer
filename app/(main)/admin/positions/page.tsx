"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PERMISSIONS } from "@/lib/permissions";

interface Position {
	id: string;
	name: string;
	branchId: string;
	departmentId: string;
	levelId: string;
	branch: { name: string } | null;
	department: { name: string } | null;
	level: { name: string } | null;
}

interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
}

interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
	levels: MasterDataItem[];
}

interface PaginationInfo {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

const formSchema = z.object({
	name: z.string().min(1, "Nama posisi wajib diisi."),
	branchId: z.string().min(1, "Cabang wajib dipilih."),
	departmentId: z.string().min(1, "Departemen wajib dipilih."),
	levelId: z.string().min(1, "Level wajib dipilih."),
});

type PositionFormValues = z.infer<typeof formSchema>;

export default function PositionsPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<Position[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalRecords: 0,
		totalPages: 0,
		currentPage: 1,
	});
	const [masterData, setMasterData] = useState<MasterData>({
		branches: [],
		departments: [],
		levels: [],
	});
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPosition, setEditingPosition] = useState<Position | null>(null);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [positionToDelete, setPositionToDelete] = useState<Position | null>(
		null
	);

	const { canCreate, canEdit, canDelete } = useMemo(() => {
		if (!session?.user?.role)
			return { canCreate: false, canEdit: false, canDelete: false };
		const permissions = PERMISSIONS[session.user.role]?.position || [];
		return {
			canCreate: permissions.includes("create"),
			canEdit: permissions.includes("update"),
			canDelete: permissions.includes("delete"),
		};
	}, [session]);

	const form = useForm<PositionFormValues>({
		resolver: zodResolver(formSchema),
	});

	const fetchPositions = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/positions?${params.toString()}`);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memuat posisi");
			}
			const result = await response.json();
			setData(result.data || []);
			setPagination({
				totalRecords: result.pagination?.totalItems || 0,
				totalPages: result.pagination?.totalPages || 0,
				currentPage: result.pagination?.currentPage || 1,
			});
		} catch (error) {
			toast.error("Error Memuat Posisi", {
				description:
					error instanceof Error ? error.message : "Tidak dapat memuat data.",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	const fetchMasterData = useCallback(async () => {
		try {
			const response = await fetch("/api/admin/master-data");
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Gagal memuat data form");
			}
			const data = await response.json();
			setMasterData(data);
		} catch (error) {
			toast.error("Error Memuat Master Data", {
				description:
					error instanceof Error
						? error.message
						: "Tidak dapat memuat data master untuk form.",
			});
		}
	}, []);

	useEffect(() => {
		fetchPositions();
	}, [fetchPositions]);

	useEffect(() => {
		fetchMasterData();
	}, [fetchMasterData]);

	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleOpenModal = useCallback(
		(position: Position | null = null) => {
			setEditingPosition(position);
			if (position) {
				form.reset({
					name: position.name,
					branchId: position.branchId,
					departmentId: position.departmentId,
					levelId: position.levelId,
				});
			} else {
				form.reset({ name: "", branchId: "", departmentId: "", levelId: "" });
			}
			setIsModalOpen(true);
		},
		[form]
	);

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingPosition(null);
	};

	const handleDeleteConfirm = useCallback((position: Position) => {
		setPositionToDelete(position);
		setIsDeleteAlertOpen(true);
	}, []);

	const onSubmit = async (values: PositionFormValues) => {
		const url = editingPosition
			? `/api/admin/positions/${editingPosition.id}`
			: "/api/admin/positions";
		const method = editingPosition ? "PUT" : "POST";
		const promise = fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		}).then(async (res) => {
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Gagal menyimpan posisi.");
			}
			return res.json();
		});
		toast.promise(promise, {
			loading: "Menyimpan posisi...",
			success: (data) => {
				handleCloseModal();
				fetchPositions();
				return `Posisi "${data.name}" telah disimpan.`;
			},
			error: (err) => err.message,
		});
	};

	const handleDelete = async () => {
		if (!positionToDelete) return;
		const promise = fetch(`/api/admin/positions/${positionToDelete.id}`, {
			method: "DELETE",
		}).then(async (res) => {
			if (!res.ok && res.status !== 204) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Gagal menghapus posisi.");
			}
		});
		toast.promise(promise, {
			loading: "Menghapus posisi...",
			success: () => {
				setIsDeleteAlertOpen(false);
				fetchPositions();
				return "Posisi berhasil dihapus.";
			},
			error: (err) => err.message,
		});
	};

	const columns = useMemo<ColumnDef<Position>[]>(() => {
		const baseCols: ColumnDef<Position>[] = [
			{
				accessorKey: "name",
				header: "Nama Posisi",
				size: 35,
				meta: { width: "35%", truncate: true },
			},
			{
				accessorKey: "level.name",
				header: "Level",
				cell: ({ row }) => row.original.level?.name || "-",
				size: 10,
				meta: { width: "10%", truncate: false },
			},
			{
				accessorKey: "department.name",
				header: "Departemen",
				cell: ({ row }) => row.original.department?.name || "-",
				size: 20,
				meta: { width: "20%", truncate: true },
			},
			{
				accessorKey: "branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.branch?.name || "-",
				size: 25,
				meta: { width: "25%", truncate: true },
			},
		];
		if (canEdit || canDelete) {
			baseCols.push({
				id: "actions",
				header: "Aksi",
				size: 10,
				meta: {
					width: "10%",
					truncate: false,
					align: "center",
				},
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
			});
		}
		return baseCols;
	}, [canEdit, canDelete, handleOpenModal, handleDeleteConfirm]);

	const selectedBranchId = form.watch("branchId");
	const filteredDepartments = useMemo(
		() => masterData.departments.filter((d) => d.branchId === selectedBranchId),
		[selectedBranchId, masterData.departments]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Data Posisi</h1>
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
					// FIX: Use a ternary operator to pass null instead of false
					createButton={
						canCreate ? (
							<Button onClick={() => handleOpenModal()}>
								<Plus className="mr-2 h-4 w-4" /> Buat Posisi
							</Button>
						) : null
					}
				/>
			</div>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>
							{editingPosition ? "Edit Posisi" : "Buat Posisi Baru"}
						</DialogTitle>
						<DialogDescription>Isi detail untuk posisi.</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama Posisi</FormLabel>
										<FormControl>
											<Input
												placeholder="Contoh: Staff HR"
												{...field}
												className="w-full"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="levelId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Level</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Pilih level" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{masterData.levels.map((level) => (
													<SelectItem key={level.id} value={level.id}>
														{level.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="branchId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cabang</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												form.setValue("departmentId", "");
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Pilih cabang" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{masterData.branches.map((branch) => (
													<SelectItem key={branch.id} value={branch.id}>
														{branch.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="departmentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Departemen</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={!selectedBranchId}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue
														placeholder={
															selectedBranchId
																? "Pilih departemen"
																: "Pilih cabang dulu"
														}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{filteredDepartments.map((dept) => (
													<SelectItem key={dept.id} value={dept.id}>
														{dept.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="md:col-span-2 pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleCloseModal}
								>
									Batal
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
						<AlertDialogDescription>
							Tindakan ini tidak dapat dibatalkan. Ini akan menghapus posisi
							secara permanen:{" "}
							<span className="font-semibold">{positionToDelete?.name}</span>.
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
		</>
	);
}
