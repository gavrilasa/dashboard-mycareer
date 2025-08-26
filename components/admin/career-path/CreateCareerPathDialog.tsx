// File: /components/admin/career-path/CreateCareerPathDialog.tsx

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

// --- Type Definitions (Diperbarui) ---
interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	jobRoles: MasterDataItem[];
}

interface CreateCareerPathDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	masterData: MasterData;
	onSuccess: () => void;
}

const createFormSchema = z.object({
	fromJobRoleId: z.string().min(1, "Job Role asal wajib dipilih."),
	toPositions: z
		.array(
			z.object({
				toJobRoleId: z.string().min(1, "Job Role tujuan wajib dipilih."),
				pathType: z.enum(["ALIGN", "CROSS"]),
			})
		)
		.min(1, "Minimal satu Job Role tujuan harus ditambahkan."),
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
			fromJobRoleId: "",
			toPositions: [{ toJobRoleId: "", pathType: "ALIGN" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "toPositions",
	});

	const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
		const payload = {
			fromJobRoleId: values.fromJobRoleId,
			toPositions: values.toPositions.map((p) => ({
				toJobRoleId: p.toJobRoleId,
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
				form.reset();
				return data.message || "Jenjang karier berhasil disimpan.";
			},
			error: (err) => err.message,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Buat Jenjang Karier Baru
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="p-4 space-y-4 bg-transparent border shadow-sm rounded-xl border-slate-200 md:p-6">
							<FormField
								name="fromJobRoleId"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Karir Asal</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Pilih Karir Asal" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{masterData.jobRoles?.map((jr) => (
													<SelectItem key={jr.id} value={jr.id}>
														<span className="block truncate">{jr.name}</span>
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
								<h3 className="text-lg font-semibold">Ke Karir Tujuan</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => append({ toJobRoleId: "", pathType: "ALIGN" })}
									className="cursor-pointer"
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
										className="absolute cursor-pointer top-2 right-2 text-muted-foreground hover:text-destructive"
										onClick={() => remove(index)}
									>
										<X className="w-4 h-4" />
									</Button>

									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<FormField
											name={`toPositions.${index}.toJobRoleId`}
											control={form.control}
											render={({ field: f }) => (
												<FormItem>
													<FormLabel>Karir Tujuan</FormLabel>
													<Select onValueChange={f.onChange} value={f.value}>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Pilih Karir Tujuan" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{masterData.jobRoles?.map((jr) => (
																<SelectItem key={jr.id} value={jr.id}>
																	<span className="block truncate">
																		{jr.name}
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
								className="cursor-pointer"
							>
								Batal
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting}
								className="cursor-pointer"
							>
								{form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
