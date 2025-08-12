"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Role, Gender, EducationDegree } from "@prisma/client";
import { format } from "date-fns";

// FIX: Replaced incorrect Zod enum syntax with the correct modern equivalent
const formSchema = z.object({
	id: z.string().optional(),
	fullName: z.string().min(3, "Nama lengkap minimal 3 karakter."),
	employeeId: z.string().min(1, "ID Karyawan tidak boleh kosong."),
	gender: z.enum(Gender),
	dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi."),
	hireDate: z.string().min(1, "Tanggal masuk wajib diisi."),
	lastEducationDegree: z.enum(EducationDegree),
	lastEducationSchool: z
		.string()
		.min(1, "Nama sekolah/universitas wajib diisi."),
	lastEducationMajor: z.string().min(1, "Jurusan wajib diisi."),
	branchId: z.string().min(1, "Cabang wajib dipilih."),
	departmentId: z.string().min(1, "Departemen wajib dipilih."),
	positionId: z.string().min(1, "Posisi wajib dipilih."),
	levelId: z.string().min(1, "Level wajib dipilih."),
	role: z.enum(Role),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

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
	levels: MasterDataItem[];
}

interface EmployeeFormProps {
	initialData?: Partial<EmployeeFormValues>;
	onSuccess: () => void;
	onCancel: () => void;
}

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;

export function EmployeeForm({
	initialData,
	onSuccess,
	onCancel,
}: EmployeeFormProps) {
	const [masterData, setMasterData] = useState<MasterData | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isEditing = !!initialData?.id;

	const form = useForm<EmployeeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: initialData?.fullName || "",
			employeeId: initialData?.employeeId || "",
			gender: initialData?.gender,
			dateOfBirth: initialData?.dateOfBirth
				? format(new Date(initialData.dateOfBirth), "yyyy-MM-dd")
				: "",
			hireDate: initialData?.hireDate
				? format(new Date(initialData.hireDate), "yyyy-MM-dd")
				: "",
			lastEducationDegree: initialData?.lastEducationDegree,
			lastEducationSchool: initialData?.lastEducationSchool || "",
			lastEducationMajor: initialData?.lastEducationMajor || "",
			branchId: initialData?.branchId || "",
			departmentId: initialData?.departmentId || "",
			positionId: initialData?.positionId || "",
			levelId: initialData?.levelId || "",
			role: initialData?.role || Role.EMPLOYEE, // Default ke EMPLOYEE
		},
	});

	const watchedBranchId = form.watch("branchId");
	const watchedDepartmentId = form.watch("departmentId");

	useEffect(() => {
		async function fetchMasterData() {
			try {
				const response = await fetch("/api/admin/master-data");
				if (!response.ok) throw new Error("Gagal memuat data master");
				setMasterData(await response.json());
			} catch (err) {
				console.log(err);
				toast.error("Error", { description: "Gagal memuat data untuk form." });
			}
		}
		fetchMasterData();
	}, []);

	// Set role to EMPLOYEE automatically
	useEffect(() => {
		form.setValue("role", Role.EMPLOYEE);
	}, [form]);

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

	const onSubmit = async (values: EmployeeFormValues) => {
		setIsSubmitting(true);
		const url = isEditing
			? `/api/admin/employees/${initialData?.employeeId}`
			: "/api/admin/employees";
		const method = isEditing ? "PUT" : "POST";

		try {
			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			if (!response.ok)
				throw new Error((await response.json()).message || "Operasi gagal");
			toast.success("Sukses", {
				description: `Karyawan berhasil ${
					isEditing ? "diperbarui" : "dibuat"
				}.`,
			});
			onSuccess();
		} catch (error) {
			toast.error("Error", {
				description:
					error instanceof Error ? error.message : "Terjadi kesalahan",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!masterData) return <div>Memuat data form...</div>;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				{/* Personal Info */}
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Nama Lengkap
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input {...field} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="employeeId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								ID Karyawan
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input {...field} disabled={isEditing} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Jenis Kelamin
								<RequiredAsterisk />
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih jenis kelamin" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(Gender).map((g) => (
										<SelectItem key={g} value={g}>
											{g}
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
					name="dateOfBirth"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Tanggal Lahir
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input type="date" {...field} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="hireDate"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Tanggal Masuk
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input type="date" {...field} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Education Info */}
				<FormField
					control={form.control}
					name="lastEducationDegree"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Pendidikan Terakhir
								<RequiredAsterisk />
							</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih tingkat pendidikan" />
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
					control={form.control}
					name="lastEducationSchool"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Sekolah/Universitas
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input {...field} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastEducationMajor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Jurusan
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input {...field} className="w-full" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Organizational Info */}
				<FormField
					control={form.control}
					name="branchId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Cabang
								<RequiredAsterisk />
							</FormLabel>
							<Select
								onValueChange={(v) => {
									field.onChange(v);
									form.setValue("departmentId", "");
									form.setValue("positionId", "");
								}}
								value={field.value}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih cabang" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{masterData.branches.map((i) => (
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
							<FormLabel>
								Departemen
								<RequiredAsterisk />
							</FormLabel>
							<Select
								onValueChange={(v) => {
									field.onChange(v);
									form.setValue("positionId", "");
								}}
								value={field.value}
								disabled={!watchedBranchId}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												!watchedBranchId
													? "Pilih cabang dulu"
													: "Pilih departemen"
											}
										/>
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
							<FormLabel>
								Posisi
								<RequiredAsterisk />
							</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value}
								disabled={!watchedDepartmentId}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												!watchedDepartmentId
													? "Pilih departemen dulu"
													: "Pilih posisi"
											}
										/>
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
					name="levelId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Level
								<RequiredAsterisk />
							</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih level" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{masterData.levels.map((i) => (
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

				{/* Role Field - Hidden but functional */}
				<input type="hidden" {...form.register("role")} value={Role.EMPLOYEE} />

				<div className="md:col-span-2 flex justify-end gap-2 pt-6">
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
