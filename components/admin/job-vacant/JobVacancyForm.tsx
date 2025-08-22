"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// [!code focus:start]
// 'useEffect' was imported but never used.
import { useMemo, useState } from "react";
// [!code focus:end]
import { toast } from "sonner";
import { VacancyPeriod } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// [!code focus:start]
// FIX: Changed `isPublished` to be optional in the schema.
// The .default() was creating a type mismatch with the optional initialData.
const vacancySchema = z.object({
	title: z.string().min(3, "Judul minimal 3 karakter."),
	description: z.string().optional(),
	requirements: z.string().optional(),
	period: z.nativeEnum(VacancyPeriod),
	branchId: z.string().min(1, "Cabang wajib dipilih."),
	departmentId: z.string().min(1, "Departemen wajib dipilih."),
	positionId: z.string().min(1, "Posisi wajib dipilih."),
	isPublished: z.boolean().optional(),
});
// [!code focus:end]

type VacancyFormValues = z.infer<typeof vacancySchema>;

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
			title: initialData?.title || "",
			description: initialData?.description || "",
			requirements: initialData?.requirements || "",
			period: initialData?.period || VacancyPeriod.SHORT_TERM,
			branchId: initialData?.branchId || "",
			departmentId: initialData?.departmentId || "",
			positionId: initialData?.positionId || "",
			isPublished: initialData?.isPublished || false,
		},
	});

	const watchedBranchId = form.watch("branchId");
	const watchedDepartmentId = form.watch("departmentId");

	const filteredDepartments = useMemo(
		() =>
			masterData?.departments.filter((d) => d.branchId === watchedBranchId) ||
			[],
		[masterData, watchedBranchId]
	);

	const filteredPositions = useMemo(
		() =>
			masterData?.positions.filter(
				(p) => p.departmentId === watchedDepartmentId
			) || [],
		[masterData, watchedDepartmentId]
	);

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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Judul Lowongan</FormLabel>
								<FormControl>
									<Input
										placeholder="Contoh: Senior Staff Marketing"
										{...field}
									/>
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
								<FormLabel>Cabang</FormLabel>
								<Select
									onValueChange={(v) => {
										field.onChange(v);
										form.setValue("departmentId", "");
										form.setValue("positionId", "");
									}}
									value={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Pilih cabang" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{masterData?.branches.map((i) => (
											<SelectItem key={i.id} value={i.id}>
												{i.name}
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
									onValueChange={(v) => {
										field.onChange(v);
										form.setValue("positionId", "");
									}}
									value={field.value}
									disabled={!watchedBranchId}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Pilih departemen" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{filteredDepartments.map((i) => (
											<SelectItem key={i.id} value={i.id}>
												{i.name}
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
						name="positionId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Posisi</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={!watchedDepartmentId}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Pilih posisi" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{filteredPositions.map((i) => (
											<SelectItem key={i.id} value={i.id}>
												{i.name}
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
						name="period"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Periode</FormLabel>
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
										<SelectItem value={VacancyPeriod.SHORT_TERM}>
											1-3 Tahun (Short Term)
										</SelectItem>
										<SelectItem value={VacancyPeriod.LONG_TERM}>
											{">"}3 Tahun (Long Term)
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Deskripsi (Opsional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Jelaskan tentang posisi ini..."
										{...field}
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
							<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm md:col-span-2">
								<div className="space-y-0.5">
									<FormLabel>Publikasikan Lowongan</FormLabel>
									<FormMessage />
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
