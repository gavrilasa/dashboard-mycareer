"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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

// --- Type Definitions ---
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
	totalItems: number;
	totalPages: number;
}

// --- Zod Schema for Form Validation ---
const formSchema = z.object({
	name: z.string().min(1, "Position name is required."),
	branchId: z.string().min(1, "Branch is required."),
	departmentId: z.string().min(1, "Department is required."),
	levelId: z.string().min(1, "Level is required."),
});

type PositionFormValues = z.infer<typeof formSchema>;

export default function PositionsPage() {
	const [data, setData] = useState<Position[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		totalItems: 0,
		totalPages: 0,
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

	const form = useForm<PositionFormValues>({
		resolver: zodResolver(formSchema),
	});

	const fetchPositions = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				q: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/positions?${params.toString()}`);
			if (!response.ok) throw new Error("Failed to fetch positions");
			const result = await response.json();
			setData(result.data || []);
			setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Could not fetch data.",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	const fetchMasterData = useCallback(async () => {
		try {
			const [branchesRes, departmentsRes, levelsRes] = await Promise.all([
				fetch("/api/admin/branches?limit=1000"),
				fetch("/api/admin/departments?limit=4000"),
				fetch("/api/admin/levels"),
			]);

			const branchesJson = await branchesRes.json();
			const departmentsJson = await departmentsRes.json();
			const levelsJson = await levelsRes.json(); // This returns an array directly

			// ## FIX: Handle the direct array response from the levels API ##
			setMasterData({
				branches: branchesJson.data || [],
				departments: departmentsJson.data || [],
				levels: levelsJson || [], // Use the direct array
			});
		} catch (error) {
			toast.error("Error", {
				description: "Could not fetch master data for the form.",
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

	const handleOpenModal = (position: Position | null = null) => {
		setEditingPosition(position);
		if (position) {
			form.reset({
				name: position.name,
				branchId: position.branchId,
				departmentId: position.departmentId,
				levelId: position.levelId,
			});
		} else {
			form.reset({
				name: "",
				branchId: "",
				departmentId: "",
				levelId: "",
			});
		}
		setIsModalOpen(true);
	};

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
				const error = await res.json();
				throw new Error(error.message || `Failed to save position.`);
			}
			return res.json();
		});

		toast.promise(promise, {
			loading: "Saving position...",
			success: () => {
				setIsModalOpen(false);
				fetchPositions();
				return `Position successfully ${
					editingPosition ? "updated" : "created"
				}.`;
			},
			error: (err) => err.message,
		});
	};

	const handleDeleteConfirm = (position: Position) => {
		setPositionToDelete(position);
		setIsDeleteAlertOpen(true);
	};

	const handleDelete = async () => {
		if (!positionToDelete) return;

		const promise = fetch(`/api/admin/positions/${positionToDelete.id}`, {
			method: "DELETE",
		}).then(async (res) => {
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Failed to delete position.");
			}
			return res.json();
		});

		toast.promise(promise, {
			loading: "Deleting position...",
			success: () => {
				setIsDeleteAlertOpen(false);
				fetchPositions();
				return "Position successfully deleted.";
			},
			error: (err) => err.message,
		});
	};

	const columns: ColumnDef<Position>[] = [
		{ accessorKey: "name", header: "Position Name" },
		{
			accessorKey: "level.name",
			header: "Level",
			cell: ({ row }) => row.original.level?.name || "-",
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
			header: "Actions",
			size: 100,
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-2">
					<Button
						onClick={() => handleOpenModal(row.original)}
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-500 hover:text-blue-600"
					>
						<Edit size={16} />
					</Button>
					<Button
						onClick={() => handleDeleteConfirm(row.original)}
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

	const selectedBranchId = form.watch("branchId");
	const filteredDepartments = useMemo(
		() => masterData.departments.filter((d) => d.branchId === selectedBranchId),
		[selectedBranchId, masterData.departments]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">Positions</h1>

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
					createButton={
						<Button onClick={() => handleOpenModal()}>
							<PlusCircle className="mr-2 h-4 w-4" />
							Create Position
						</Button>
					}
				/>
			</div>

			{/* Create/Edit Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingPosition ? "Edit Position" : "Create New Position"}
						</DialogTitle>
						<DialogDescription>
							Fill in the details for the position.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Position Name</FormLabel>
										<FormControl>
											<Input placeholder="e.g., HR Staff" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="branchId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Branch</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												form.resetField("departmentId");
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a branch" />
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
										<FormLabel>Department</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={!selectedBranchId}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a department" />
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
							<FormField
								control={form.control}
								name="levelId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Level</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a level" />
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
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? "Saving..." : "Save"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							position:{" "}
							<span className="font-semibold">{positionToDelete?.name}</span>.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
