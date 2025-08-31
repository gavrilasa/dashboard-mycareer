"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

// Skema Zod disederhanakan, menghapus 'period'
const vacancySchema = z.object({
	jobRoleId: z.string().min(1, "Job Role wajib dipilih."),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
});

type VacancyFormValues = z.infer<typeof vacancySchema>;

interface MasterDataItem {
	id: string;
	name: string;
}
interface MasterData {
	jobRolesForVacancy?: MasterDataItem[];
}

interface JobVacancyFormProps {
	initialData?: Partial<VacancyFormValues> & { id?: string };
	masterData: MasterData | null;
	onSuccess: () => void;
	onCancel: () => void;
}

export function JobVacancyForm({
	initialData,
	masterData,
	onSuccess,
	onCancel,
}: JobVacancyFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!initialData?.id;

	const form = useForm<VacancyFormValues>({
		resolver: zodResolver(vacancySchema),
		defaultValues: {
			jobRoleId: initialData?.jobRoleId || "",
			description: initialData?.description || "",
			isPublished: initialData?.isPublished || false,
		},
	});

	const onSubmit = async (values: VacancyFormValues) => {
		setIsSubmitting(true);
		const url = isEditing
			? `/api/admin/job-vacancies/${initialData.id}`
			: "/api/admin/job-vacancies";
		const method = isEditing ? "PUT" : "POST";

		const promise = fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Gagal menyimpan data.");
			return res.json();
		});

		toast.promise(promise, {
			loading: "Menyimpan lowongan...",
			success: () => {
				onSuccess();
				return `Lowongan berhasil ${isEditing ? "diperbarui" : "dibuat"}.`;
			},
			error: (err) => err.message,
			finally: () => setIsSubmitting(false),
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 gap-4">
					<FormField
						control={form.control}
						name="jobRoleId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Role</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Pilih Job Role..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{masterData?.jobRolesForVacancy?.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												{role.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Field untuk 'Periode' telah dihapus dari sini */}

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Deskripsi (Opsional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Jelaskan tentang posisi ini..."
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isPublished"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
								<div className="space-y-0.5">
									<FormLabel>Publikasikan Lowongan</FormLabel>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end gap-2 pt-4">
					<Button type="button" variant="ghost" onClick={onCancel}>
						Batal
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Menyimpan..." : "Simpan"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
