"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { PERMISSIONS } from "@/lib/permissions";
import { Role, User } from "@prisma/client";

// --- Definisi Tipe ---
// FIX: Memperbarui tipe untuk menyertakan data cabang
interface UserWithEmployee extends User {
	employee: {
		fullName: string;
		level: {
			name: string;
		} | null;
		branch: {
			// <-- Tambahkan ini
			name: string;
		} | null;
	} | null;
}

interface PaginationState {
	totalRecords: number;
	totalPages: number;
	currentPage: number;
}

const formSchema = z.object({
	role: z.enum(Object.values(Role) as [string, ...string[]]),
});
type UserFormValues = z.infer<typeof formSchema>;

export default function UsersPage() {
	const { data: session } = useSession();
	const [data, setData] = useState<UserWithEmployee[]>([]);
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

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<UserWithEmployee | null>(null);

	const { canRead, canEdit } = useMemo(() => {
		if (!session?.user?.role)
			return {
				canRead: false,
				canEdit: false,
			};
		const perms = PERMISSIONS[session.user.role]?.userManagement || [];
		return {
			canRead: perms.includes("read"),
			canEdit: perms.includes("update"),
		};
	}, [session]);

	const form = useForm<UserFormValues>({ resolver: zodResolver(formSchema) });

	const fetchUsers = useCallback(async () => {
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
			const response = await fetch(`/api/admin/users?${params.toString()}`);
			if (!response.ok)
				throw new Error(
					(await response.json()).message || "Failed to fetch users"
				);
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
					error instanceof Error ? error.message : "Could not fetch data.",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm, canRead]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleOpenModal = useCallback(
		(user: UserWithEmployee | null = null) => {
			setEditingUser(user);
			form.reset({ role: user?.role || Role.EMPLOYEE });
			setIsModalOpen(true);
		},
		[form]
	);

	const handleCloseModal = () => setIsModalOpen(false);

	const onSubmit = async (values: UserFormValues) => {
		if (!editingUser) return;
		const promise = fetch(`/api/admin/users/${editingUser.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Failed to update user.");
			return res.json();
		});
		toast.promise(promise, {
			loading: "Updating user role...",
			success: (data) => {
				handleCloseModal();
				fetchUsers();
				return `User ${data.employeeId} role updated.`;
			},
			error: (err) => err.message,
		});
	};

	const columns = useMemo<ColumnDef<UserWithEmployee>[]>(() => {
		const baseCols: ColumnDef<UserWithEmployee>[] = [
			{
				accessorKey: "employeeId",
				header: "ID Karyawan",
				size: 15,
				meta: {
					width: "15%",
					truncate: false,
				},
			},
			{
				accessorKey: "employee.fullName",
				header: "Nama",
				cell: ({ row }) => row.original.employee?.fullName || "-",
				size: 20,
				meta: {
					width: "20%",
					truncate: true,
				},
			},
			{
				accessorKey: "role",
				header: "Peran",
				size: 15,
				meta: {
					width: "15%",
					truncate: true,
				},
			},
			{
				accessorKey: "employee.level.name",
				header: "Level",
				cell: ({ row }) => row.original.employee?.level?.name || "-",
				size: 15,
				meta: {
					width: "15%",
					truncate: true,
				},
			},
			{
				accessorKey: "employee.branch.name",
				header: "Cabang",
				cell: ({ row }) => row.original.employee?.branch?.name || "-",
				size: 25,
				meta: {
					width: "25%",
					truncate: true,
				},
			},
		];
		if (canEdit) {
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
					<div className="flex gap-2">
						{canEdit && (
							<Button
								onClick={() => handleOpenModal(row.original)}
								variant="ghost"
								size="icon"
								className="hover:text-primary cursor-pointer"
							>
								<Edit size={16} />
							</Button>
						)}
					</div>
				),
			});
		}
		return baseCols;
	}, [canEdit, handleOpenModal]);

	if (!canRead) return null;

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
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

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Edit Peran Pengguna untuk{" "}
							{editingUser?.employee?.fullName || editingUser?.employeeId}
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 pt-4"
						>
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Peran Sistem</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(Role).map((r) => (
													<SelectItem key={r} value={r}>
														{r}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={handleCloseModal}
								>
									Batal
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									Simpan
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
