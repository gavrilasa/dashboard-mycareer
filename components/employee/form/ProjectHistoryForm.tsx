"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
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
import { Textarea } from "@/components/ui/textarea";
import { ProjectRole } from "@prisma/client";

const Asterisk = () => <span className="text-red-500 -ml-1">*</span>;

// Menambahkan prop onSkip ke interface
interface ProjectHistoryFormProps {
	onSkip: () => void;
}

export function ProjectHistoryForm({ onSkip }: ProjectHistoryFormProps) {
	const { control, getValues } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "projectHistories",
	});

	const [hasExperience, setHasExperience] = useState<boolean | null>(
		getValues("projectHistories")?.length > 0 ? true : null
	);

	useEffect(() => {
		const hasData = getValues("projectHistories")?.length > 0;
		if (hasData) {
			setHasExperience(true);
		}
	}, [fields, getValues]);

	const handleExperienceChoice = (choice: boolean) => {
		setHasExperience(choice);
		if (choice && fields.length === 0) {
			// Jika memilih "Ya" dan belum ada isian, tambahkan satu form kosong
			append({
				projectName: "",
				role: ProjectRole.ANGGOTA,
				year: new Date().getFullYear(),
				description: "",
			});
		} else if (!choice) {
			// Jika memilih "Tidak", hapus semua isian dan lewati ke langkah berikutnya
			remove();
			onSkip();
		}
	};

	return (
		<Card className="border-none shadow-none bg-white gap-3 py-8">
			<CardHeader className="gap-0">
				<CardTitle>Riwayat Proyek</CardTitle>
				<CardDescription className="mt-2">
					Catat proyek-proyek penting yang pernah Anda ikuti di perusahaan.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-3 mt-2">
					<FormLabel>Apakah Anda memiliki riwayat proyek?</FormLabel>
					<div className="grid grid-cols-2 gap-2 lg:max-w-1/4">
						<Button
							type="button"
							size="sm"
							variant={hasExperience === true ? "default" : "outline"}
							onClick={() => handleExperienceChoice(true)}
						>
							Ya
						</Button>
						<Button
							type="button"
							size="sm"
							variant={hasExperience === false ? "destructive" : "outline"}
							onClick={() => handleExperienceChoice(false)}
						>
							Tidak
						</Button>
					</div>
				</div>

				{hasExperience === true && (
					<div className="mt-6 pt-6 border-t">
						<div className="flex justify-end mb-4">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									append({
										projectName: "",
										role: ProjectRole.ANGGOTA,
										year: new Date().getFullYear(),
										description: "",
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								Tambah Proyek
							</Button>
						</div>
						<div className="space-y-6">
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="p-6 border rounded-lg relative bg-white space-y-4 shadow-sm"
								>
									<div className="flex justify-between items-center">
										<h4 className="font-semibold text-slate-800">
											Proyek #{index + 1}
										</h4>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-red-500 hover:text-red-700"
											onClick={() => remove(index)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>

									<FormField
										control={control}
										name={`projectHistories.${index}.projectName`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Nama Proyek <Asterisk />
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Contoh: Implementasi Sistem ERP"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={control}
											name={`projectHistories.${index}.year`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Tahun <Asterisk />
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="Contoh: 2024"
															{...field}
															onChange={(e) =>
																field.onChange(
																	parseInt(e.target.value, 10) ||
																		new Date().getFullYear()
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={control}
											name={`projectHistories.${index}.role`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Peran dalam Proyek <Asterisk />
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Pilih peran Anda" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Object.values(ProjectRole).map((role) => (
																<SelectItem key={role} value={role}>
																	{role}
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
										control={control}
										name={`projectHistories.${index}.description`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Deskripsi Proyek & Tugas Anda</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Jelaskan secara singkat tentang proyek ini dan kontribusi Anda di dalamnya."
														className="min-h-[120px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
