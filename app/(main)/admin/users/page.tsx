"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Gender, Role, EducationDegree } from "@prisma/client";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { CrudTable } from "@/components/common/CrudTable";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { useDebounce } from "@/hooks/useDebounce";

// --- Type Definitions ---
interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
}

interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
	positions: MasterDataItem[];
	levels: MasterDataItem[];
}

interface User {
	id: string;
	employeeId: string;
	role: Role;
	createdAt: string;
	employee: {
		fullName: string;
		position: {
			name: string;
		};
	};
}

// --- Zod Schemas ---
const formSchema = z.object({
	employeeId: z.string().min(1, "Employee ID is required."),
	fullName: z.string().min(1, "Full Name is required."),
	dateOfBirth: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
		message: "A valid date of birth is required.",
	}),
	hireDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
		message: "A valid hire date is required.",
	}),
	gender: z.enum([Gender.MALE, Gender.FEMALE]),
	role: z.enum([Role.ADMIN, Role.EMPLOYEE, Role.HD, Role.HR_BRANCH]),
	branchId: z.string().min(1, "Branch is required."),
	departmentId: z.string().min(1, "Department is required."),
	positionId: z.string().min(1, "Position is required."),
	levelId: z.string().min(1, "Level is required."),
	lastEducationDegree: z.enum(
		Object.values(EducationDegree) as [string, ...string[]]
	),
	lastEducationSchool: z.string().min(1, "School name is required."),
	lastEducationMajor: z.string().min(1, "Major is required."),
});

const updateUserSchema = z.object({
	role: z.enum([Role.ADMIN, Role.EMPLOYEE, Role.HD, Role.HR_BRANCH]),
});

type UserFormValues = z.infer<typeof formSchema>;

export default function UsersPage() {
	const [data, setData] = useState<User[]>([]);
	const [masterData, setMasterData] = useState<MasterData>({
		branches: [],
		departments: [],
		positions: [],
		levels: [],
	});
	const [pagination, setPagination] = useState({
		totalItems: 0,
		totalPages: 0,
	});
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);
	const [loading, setLoading] = useState(true);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	const createForm = useForm<UserFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			employeeId: "",
			fullName: "",
			dateOfBirth: "",
			hireDate: "",
			branchId: "",
			departmentId: "",
			positionId: "",
			levelId: "",
			lastEducationSchool: "",
			lastEducationMajor: "",
			gender: Gender.MALE,
			role: Role.EMPLOYEE,
			lastEducationDegree: EducationDegree.SMA,
		},
	});

	const editForm = useForm<{ role: Role }>({
		resolver: zodResolver(updateUserSchema),
	});

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				q: debouncedSearch,
			});
			const response = await fetch(`/api/admin/users?${params.toString()}`);
			if (!response.ok) throw new Error("Failed to fetch users.");
			const result = await response.json();
			setData(result.data || []);
			setPagination(result.pagination || { totalItems: 0, totalPages: 0 });
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Could not fetch users.",
			});
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearch]);

	const fetchMasterData = useCallback(async () => {
		try {
			const [branchesRes, departmentsRes, positionsRes, levelsRes] =
				await Promise.all([
					fetch("/api/admin/branches?limit=1000"),
					fetch("/api/admin/departments?limit=4000"),
					fetch("/api/admin/positions?limit=4000"),
					fetch("/api/admin/levels"),
				]);
			const [branches, departments, positions, levels] = await Promise.all([
				branchesRes.json(),
				departmentsRes.json(),
				positionsRes.json(),
				levelsRes.json(),
			]);
			setMasterData({
				branches: branches.data || [],
				departments: departments.data || [],
				positions: positions.data || [],
				levels: levels || [],
			});
		} catch (error) {
			toast.error("Error", { description: "Could not fetch master data." });
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	useEffect(() => {
		fetchMasterData();
	}, [fetchMasterData]);

	const handleCreateSubmit = async (values: UserFormValues) => {
		const promise = fetch("/api/admin/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Failed to create user.");
			return res.json();
		});
		toast.promise(promise, {
			loading: "Creating user...",
			success: () => {
				setIsCreateModalOpen(false);
				createForm.reset();
				fetchUsers();
				return "User created successfully.";
			},
			error: (err) => err.message,
		});
	};

	const handleEditSubmit = async (values: { role: Role }) => {
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
			loading: "Updating user...",
			success: () => {
				setIsEditModalOpen(false);
				fetchUsers();
				return "User role updated successfully.";
			},
			error: (err) => err.message,
		});
	};

	const handleDelete = async () => {
		if (!userToDelete) return;
		const promise = fetch(`/api/admin/users/${userToDelete.id}`, {
			method: "DELETE",
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Failed to delete user.");
			return res.json();
		});
		toast.promise(promise, {
			loading: "Deleting user...",
			success: () => {
				setIsDeleteAlertOpen(false);
				fetchUsers();
				return "User deleted successfully.";
			},
			error: (err) => err.message,
		});
	};

	const columns: ColumnDef<User>[] = [
		{ accessorKey: "employeeId", header: "Employee ID", size: 120 },
		{ accessorKey: "employee.fullName", header: "Full Name" },
		{ accessorKey: "employee.position.name", header: "Position" },
		{ accessorKey: "role", header: "Role" },
		{
			accessorKey: "createdAt",
			header: "Created At",
			cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
		},
		{
			id: "actions",
			header: "Actions",
			size: 80,
			cell: ({ row }) => (
				<div className="flex justify-center">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									setEditingUser(row.original);
									editForm.setValue("role", row.original.role);
									setIsEditModalOpen(true);
								}}
							>
								<Edit className="mr-2 h-4 w-4" /> Edit Role
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-red-600"
								onClick={() => {
									setUserToDelete(row.original);
									setIsDeleteAlertOpen(true);
								}}
							>
								<Trash2 className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const selectedBranchId = createForm.watch("branchId");
	const filteredDepartments = useMemo(
		() => masterData.departments.filter((d) => d.branchId === selectedBranchId),
		[selectedBranchId, masterData.departments]
	);
	const filteredPositions = useMemo(
		() => masterData.positions.filter((p) => p.branchId === selectedBranchId),
		[selectedBranchId, masterData.positions]
	);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<h1 className="text-2xl font-bold mb-4 text-gray-800">
					User Management
				</h1>
				<CrudTable
					columns={columns}
					data={data}
					loading={loading}
					limit={limit}
					onLimitChange={setLimit}
					search={search}
					onSearchChange={setSearch}
					pagination={{
						currentPage: page,
						totalPages: pagination.totalPages,
						totalRecords: pagination.totalItems,
						onPageChange: setPage,
					}}
					createButton={
						<Button onClick={() => setIsCreateModalOpen(true)}>
							<PlusCircle className="mr-2 h-4 w-4" /> Create User
						</Button>
					}
				/>
			</div>

			{/* Create Modal */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Create New User</DialogTitle>
						<DialogDescription>
							Fill in the form to create a new user and employee record.
						</DialogDescription>
					</DialogHeader>
					<Form {...createForm}>
						<form
							onSubmit={createForm.handleSubmit(handleCreateSubmit)}
							className="space-y-4 max-h-[70vh] overflow-y-auto pr-4"
						>
							{/* ## FIX: ADDED ALL MISSING FORM FIELDS ## */}
							<FormField
								control={createForm.control}
								name="employeeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Employee ID</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createForm.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={createForm.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date of Birth</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={createForm.control}
									name="hireDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Hire Date</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={createForm.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value={Gender.MALE}>Male</SelectItem>
													<SelectItem value={Gender.FEMALE}>Female</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={createForm.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select role" />
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
							</div>
							<FormField
								control={createForm.control}
								name="branchId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Branch</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												createForm.resetField("departmentId");
												createForm.resetField("positionId");
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select branch" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{masterData.branches.map((b) => (
													<SelectItem key={b.id} value={b.id}>
														{b.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={createForm.control}
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
														<SelectValue placeholder="Select department" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{filteredDepartments.map((d) => (
														<SelectItem key={d.id} value={d.id}>
															{d.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={createForm.control}
									name="positionId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Position</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!selectedBranchId}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select position" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{filteredPositions.map((p) => (
														<SelectItem key={p.id} value={p.id}>
															{p.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={createForm.control}
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
												{masterData.levels.map((l) => (
													<SelectItem key={l.id} value={l.id}>
														{l.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createForm.control}
								name="lastEducationDegree"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Education</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select degree" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(EducationDegree).map((d) => (
													<SelectItem key={d} value={d}>
														{d}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createForm.control}
								name="lastEducationSchool"
								render={({ field }) => (
									<FormItem>
										<FormLabel>School/University</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={createForm.control}
								name="lastEducationMajor"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Major</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DialogFooter className="pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsCreateModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={createForm.formState.isSubmitting}
								>
									Save
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Edit Modal */}
			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User Role</DialogTitle>
						<DialogDescription>
							Change the role for {editingUser?.employee.fullName}.
						</DialogDescription>
					</DialogHeader>
					<Form {...editForm}>
						<form
							onSubmit={editForm.handleSubmit(handleEditSubmit)}
							className="space-y-4"
						>
							<FormField
								control={editForm.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
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
									onClick={() => setIsEditModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={editForm.formState.isSubmitting}
								>
									Update Role
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will permanently delete the user{" "}
							<span className="font-semibold">
								{userToDelete?.employee.fullName}
							</span>
							. This cannot be undone.
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
