"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

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

interface EditCareerPathDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingPath: CareerPath | null;
	masterData: MasterData;
	onSuccess: () => void;
}

const editSchema = z
	.object({
		fromBranchId: z.string().min(1, "Cabang asal wajib dipilih."),
		fromDepartmentId: z.string().min(1, "Departemen asal wajib dipilih."),
		fromPositionId: z.string().min(1, "Posisi asal wajib dipilih."),
		toBranchId: z.string().min(1, "Cabang tujuan wajib dipilih."),
		toDepartmentId: z.string().min(1, "Departemen tujuan wajib dipilih."),
		toPositionId: z.string().min(1, "Posisi tujuan wajib dipilih."),
		pathType: z.enum(["ALIGN", "CROSS"]),
	})
	.refine((data) => data.fromPositionId !== data.toPositionId, {
		message: "Posisi asal dan tujuan tidak boleh sama.",
		path: ["toPositionId"],
	});
type EditFormValues = z.infer<typeof editSchema>;

export function EditCareerPathDialog({
	open,
	onOpenChange,
	editingPath,
	masterData,
	onSuccess,
}: EditCareerPathDialogProps) {
	const form = useForm<EditFormValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			fromBranchId: "",
			fromDepartmentId: "",
			fromPositionId: "",
			toBranchId: "",
			toDepartmentId: "",
			toPositionId: "",
			pathType: "ALIGN",
		},
	});

	useEffect(() => {
		if (editingPath && masterData?.positions?.length > 0) {
			const fromPosition = masterData.positions.find(
				(p) => p.id === editingPath.fromPositionId
			);
			const toPosition = masterData.positions.find(
				(p) => p.id === editingPath.toPositionId
			);

			const fromDepartment = masterData.departments.find(
				(d) => d.id === fromPosition?.departmentId
			);
			const toDepartment = masterData.departments.find(
				(d) => d.id === toPosition?.departmentId
			);

			form.reset({
				fromBranchId: fromDepartment?.branchId || "",
				fromDepartmentId: fromPosition?.departmentId || "",
				fromPositionId: editingPath.fromPositionId,
				toBranchId: toDepartment?.branchId || "",
				toDepartmentId: toPosition?.departmentId || "",
				toPositionId: editingPath.toPositionId,
				pathType: editingPath.pathType,
			});
		}
	}, [editingPath, masterData, form]);

	const onSubmit: SubmitHandler<EditFormValues> = async (values) => {
		if (!editingPath) return;

		const payload = {
			fromPositionId: values.fromPositionId,
			toPositionId: values.toPositionId,
			pathType: values.pathType,
		};

		const promise = fetch(`/api/admin/career-path/${editingPath.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error((await res.json()).message || "Gagal menyimpan data.");
			}
			return res.json();
		});

		toast.promise(promise, {
			loading: "Memperbarui...",
			success: () => {
				onSuccess();
				return "Jenjang karier berhasil diperbarui.";
			},
			error: (err) => err.message,
		});
	};

	const fromBranchId = form.watch("fromBranchId");
	const fromDepartmentId = form.watch("fromDepartmentId");
	const toBranchId = form.watch("toBranchId");
	const toDepartmentId = form.watch("toDepartmentId");

	if (!masterData || !masterData.branches || masterData.branches.length === 0) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Edit Jenjang Karier
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* FROM POSITION */}
						<div className="space-y-4 rounded-xl border border-slate-200 bg-transparent p-4 md:p-6 shadow-sm">
							<h3 className="text-lg font-semibold">Dari Posisi</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									name="fromBranchId"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cabang Asal</FormLabel>
											<Select
												onValueChange={(v) => {
													field.onChange(v);
													form.setValue("fromDepartmentId", "");
													form.setValue("fromPositionId", "");
												}}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Cabang" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.branches.map((b) => (
														<SelectItem key={b.id} value={b.id}>
															<span className="block truncate">{b.name}</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="fromDepartmentId"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Departemen Asal</FormLabel>
											<Select
												onValueChange={(v) => {
													field.onChange(v);
													form.setValue("fromPositionId", "");
												}}
												value={field.value}
												disabled={!fromBranchId}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Departemen" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.departments
														.filter((d) => d.branchId === fromBranchId)
														.map((d) => (
															<SelectItem key={d.id} value={d.id}>
																<span className="block truncate">{d.name}</span>
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
								name="fromPositionId"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Posisi Asal</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={!fromDepartmentId}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih Posisi" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{masterData.positions
													.filter((p) => p.departmentId === fromDepartmentId)
													.map((p) => (
														<SelectItem key={p.id} value={p.id}>
															<span className="block truncate">{p.name}</span>
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* TO POSITION */}
						<div className="space-y-4 rounded-xl border border-slate-200 bg-transparent p-4 md:p-6 shadow-sm">
							<h3 className="text-lg font-semibold">Ke Posisi</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									name="toBranchId"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cabang Tujuan</FormLabel>
											<Select
												onValueChange={(v) => {
													field.onChange(v);
													form.setValue("toDepartmentId", "");
													form.setValue("toPositionId", "");
												}}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Cabang" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.branches.map((b) => (
														<SelectItem key={b.id} value={b.id}>
															<span className="block truncate">{b.name}</span>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="toDepartmentId"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Departemen Tujuan</FormLabel>
											<Select
												onValueChange={(v) => {
													field.onChange(v);
													form.setValue("toPositionId", "");
												}}
												value={field.value}
												disabled={!toBranchId}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Departemen" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.departments
														.filter((d) => d.branchId === toBranchId)
														.map((d) => (
															<SelectItem key={d.id} value={d.id}>
																<span className="block truncate">{d.name}</span>
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									name="toPositionId"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Posisi Tujuan</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!toDepartmentId}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Posisi" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.positions
														.filter((p) => p.departmentId === toDepartmentId)
														.map((p) => (
															<SelectItem key={p.id} value={p.id}>
																<span className="block truncate">{p.name}</span>
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="pathType"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Jenis Path</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih Jenis" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="ALIGN">Align</SelectItem>
													<SelectItem value="CROSS">Cross</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<DialogFooter className="mt-6 gap-2 border-t pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Batal
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting
									? "Memperbarui..."
									: "Simpan Perubahan"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
