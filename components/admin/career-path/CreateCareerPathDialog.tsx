"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
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
import { Plus, X } from "lucide-react";

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

interface CreateCareerPathDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	masterData: MasterData;
	onSuccess: () => void;
}

const createFormSchema = z.object({
	fromBranchId: z.string().min(1, "Cabang asal wajib dipilih."),
	fromDepartmentId: z.string().min(1, "Departemen asal wajib dipilih."),
	fromPositionId: z.string().min(1, "Posisi asal wajib dipilih."),
	toPositions: z
		.array(
			z.object({
				branchId: z.string().min(1, "Cabang tujuan wajib dipilih."),
				departmentId: z.string().min(1, "Departemen tujuan wajib dipilih."),
				toPositionId: z.string().min(1, "Posisi tujuan wajib dipilih."),
				pathType: z.enum(["ALIGN", "CROSS"]),
			})
		)
		.min(1, "Minimal satu posisi tujuan harus ditambahkan."),
});
type CreateFormValues = z.infer<typeof createFormSchema>;

export function CreateCareerPathDialog({
	open,
	onOpenChange,
	masterData,
	onSuccess,
}: CreateCareerPathDialogProps) {
	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			fromBranchId: "",
			fromDepartmentId: "",
			fromPositionId: "",
			toPositions: [
				{ branchId: "", departmentId: "", toPositionId: "", pathType: "ALIGN" },
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "toPositions",
	});

	const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
		const payload = {
			fromPositionId: values.fromPositionId,
			toPositions: values.toPositions.map((p) => ({
				toPositionId: p.toPositionId,
				pathType: p.pathType,
			})),
		};
		const promise = fetch("/api/admin/career-path", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Gagal menyimpan data.");
			return res.json();
		});

		toast.promise(promise, {
			loading: "Menyimpan...",
			success: (data) => {
				onSuccess();
				return data.message || "Jenjang karier berhasil disimpan.";
			},
			error: (err) => err.message,
		});
	};

	const fromBranchId = form.watch("fromBranchId");
	const fromDepartmentId = form.watch("fromDepartmentId");
	const toPositionsWatched = form.watch("toPositions");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Buat Jenjang Karier Baru
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="p-4 space-y-4 bg-transparent border shadow-sm rounded-xl border-slate-200 md:p-6">
							<h3 className="text-lg font-semibold">Dari Posisi</h3>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
													<SelectTrigger className="w-full">
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
													<SelectTrigger className="w-full">
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
												<SelectTrigger className="w-full">
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

						{/* TO POSITIONS */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Ke Posisi</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										append({
											branchId: "",
											departmentId: "",
											toPositionId: "",
											pathType: "ALIGN",
										})
									}
								>
									<Plus className="w-4 h-4 mr-2" /> Tambah Tujuan
								</Button>
							</div>
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="relative p-4 space-y-4 bg-transparent border shadow-sm rounded-xl border-slate-200 md:p-6"
								>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
										onClick={() => remove(index)}
									>
										<X className="w-4 h-4" />
									</Button>

									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<FormField
											name={`toPositions.${index}.branchId`}
											control={form.control}
											render={({ field: f }) => (
												<FormItem>
													<FormLabel>Cabang Tujuan</FormLabel>
													<Select
														onValueChange={(v) => {
															f.onChange(v);
															form.setValue(
																`toPositions.${index}.departmentId`,
																""
															);
															form.setValue(
																`toPositions.${index}.toPositionId`,
																""
															);
														}}
														value={f.value}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Pilih Cabang" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{masterData.branches.map((b) => (
																<SelectItem key={b.id} value={b.id}>
																	<span className="block truncate">
																		{b.name}
																	</span>
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name={`toPositions.${index}.departmentId`}
											control={form.control}
											render={({ field: f }) => (
												<FormItem>
													<FormLabel>Departemen Tujuan</FormLabel>
													<Select
														onValueChange={(v) => {
															f.onChange(v);
															form.setValue(
																`toPositions.${index}.toPositionId`,
																""
															);
														}}
														value={f.value}
														disabled={!toPositionsWatched?.[index]?.branchId}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Pilih Departemen" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{masterData.departments
																.filter(
																	(d) =>
																		d.branchId ===
																		toPositionsWatched?.[index]?.branchId
																)
																.map((d) => (
																	<SelectItem key={d.id} value={d.id}>
																		<span className="block truncate">
																			{d.name}
																		</span>
																	</SelectItem>
																))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<FormField
											name={`toPositions.${index}.toPositionId`}
											control={form.control}
											render={({ field: f }) => (
												<FormItem>
													<FormLabel>Posisi Tujuan</FormLabel>
													<Select
														onValueChange={f.onChange}
														value={f.value}
														disabled={
															!toPositionsWatched?.[index]?.departmentId
														}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Pilih Posisi" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{masterData.positions
																.filter(
																	(p) =>
																		p.departmentId ===
																		toPositionsWatched?.[index]?.departmentId
																)
																.map((p) => (
																	<SelectItem key={p.id} value={p.id}>
																		<span className="block truncate">
																			{p.name}
																		</span>
																	</SelectItem>
																))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											name={`toPositions.${index}.pathType`}
											control={form.control}
											render={({ field: f }) => (
												<FormItem>
													<FormLabel>Jenis Path</FormLabel>
													<Select onValueChange={f.onChange} value={f.value}>
														<FormControl>
															<SelectTrigger className="w-full">
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
							))}
						</div>

						<DialogFooter className="gap-2 pt-4 mt-6 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
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
	);
}
