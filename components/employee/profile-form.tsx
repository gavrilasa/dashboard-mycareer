"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationDegree } from "@prisma/client";
import { useState } from "react";

const educationEnumValues = [
	"SMP",
	"SMA",
	"SMK",
	"D1",
	"D2",
	"D3",
	"D4",
	"S1",
	"S2",
	"S3",
] as const;

// Skema validasi menggunakan Zod (diperbaiki)
const formSchema = z.object({
	schoolName: z.string().min(1, { message: "Nama sekolah wajib diisi." }),
	majorName: z.string().min(1, { message: "Jurusan wajib diisi." }),
	educationDegree: z.enum(educationEnumValues, {
		// hanya "message" yang valid di sini
		message: "Tingkat pendidikan wajib dipilih.",
	}),
});

interface ProfileFormProps {
	employeeId: string;
	initialData: {
		schoolName: string | null;
		majorName: string | null;
		educationDegree: EducationDegree | null;
	};
	onSuccess: () => void; // Callback untuk memberitahu parent bahwa update berhasil
}

export function ProfileForm({
	employeeId,
	initialData,
	onSuccess,
}: ProfileFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			schoolName: initialData.schoolName ?? "",
			majorName: initialData.majorName ?? "",
			educationDegree: initialData.educationDegree ?? undefined,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/employee/${employeeId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Gagal memperbarui profil.");
			}

			toast.success("Berhasil", {
				description: "Profil Anda telah berhasil diperbarui.",
			});
			onSuccess(); // Panggil callback setelah berhasil
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Terjadi kesalahan tidak diketahui.";
			toast.error("Terjadi Kesalahan", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Edit Informasi Pendidikan</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="educationDegree"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tingkat Pendidikan Terakhir</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isLoading}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Pilih tingkat pendidikan..." />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(EducationDegree).map((degree) => (
												<SelectItem key={degree} value={degree}>
													{degree}
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
							name="schoolName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama Institusi/Sekolah</FormLabel>
									<FormControl>
										<Input
											placeholder="Contoh: Universitas Teknologi"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="majorName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Jurusan</FormLabel>
									<FormControl>
										<Input
											placeholder="Contoh: Teknik Informatika"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Menyimpan..." : "Simpan Perubahan"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
