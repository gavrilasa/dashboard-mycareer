"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2 } from "lucide-react";
import { ProjectRole } from "@prisma/client";

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function ProjectHistorySection() {
	const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "projectHistories",
	});

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Riwayat Proyek" />
			<div className="space-y-6">
				{fields.map((field, index) => {
					return (
						<div key={field.id}>
							<div className="flex justify-between items-center mb-4">
								<h4 className="font-semibold text-gray-700">
									Proyek #{index + 1}
								</h4>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="text-red-500 hover:text-red-700"
									onClick={() => remove(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
							<div className="grid grid-cols-1 gap-6">
								<FormField
									control={control}
									name={`projectHistories.${index}.projectName`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nama Proyek
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Contoh: Implementasi Sistem ERP"
													{...field}
													className="w-full"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<FormField
										control={control}
										name={`projectHistories.${index}.year`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Tahun
													<RequiredAsterisk />
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="Contoh: 2024"
														{...field}
														className="w-full"
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
													Peran
													<RequiredAsterisk />
												</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Pilih peran" />
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
											<FormLabel>Deskripsi</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Jelaskan kontribusi Anda dalam proyek ini..."
													{...field}
													value={field.value ?? ""}
													className="w-full"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					);
				})}
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
					<Plus className="mr-2 h-4 w-4" /> Tambah Riwayat Proyek
				</Button>
			</div>
		</section>
	);
}
