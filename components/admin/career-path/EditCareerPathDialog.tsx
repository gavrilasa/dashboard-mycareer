// File: /components/admin/career-path/EditCareerPathDialog.tsx

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

// --- Type Definitions (Diperbarui) ---
interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	jobRoles: MasterDataItem[];
}
interface CareerPath {
	id: string;
	fromJobRoleId: string;
	toJobRoleId: string;
	pathType: "ALIGN" | "CROSS";
	fromJobRole: { name: string };
	toJobRole: { name: string };
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
		fromJobRoleId: z.string().min(1, "Job Role asal wajib dipilih."),
		toJobRoleId: z.string().min(1, "Job Role tujuan wajib dipilih."),
		pathType: z.enum(["ALIGN", "CROSS"]),
	})
	.refine((data) => data.fromJobRoleId !== data.toJobRoleId, {
		message: "Job Role asal dan tujuan tidak boleh sama.",
		path: ["toJobRoleId"],
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
	});

	useEffect(() => {
		if (editingPath) {
			form.reset({
				fromJobRoleId: editingPath.fromJobRoleId,
				toJobRoleId: editingPath.toJobRoleId,
				pathType: editingPath.pathType,
			});
		}
	}, [editingPath, form]);

	const onSubmit: SubmitHandler<EditFormValues> = async (values) => {
		if (!editingPath) return;

		const payload = {
			fromJobRoleId: values.fromJobRoleId,
			toJobRoleId: values.toJobRoleId,
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Edit Jenjang Karier
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="pt-4 space-y-6"
					>
						<FormField
							name="fromJobRoleId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Karir Asal</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih Job Role Asal" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{masterData.jobRoles?.map((jr) => (
												<SelectItem key={jr.id} value={jr.id}>
													{jr.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="toJobRoleId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Karir Tujuan</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih Job Role Tujuan" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{masterData.jobRoles?.map((jr) => (
												<SelectItem key={jr.id} value={jr.id}>
													{jr.name}
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
									<FormLabel>Tipe</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih Tipe" />
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
