// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/components/admin/forms/sections/OrganizationHistorySection.tsx
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
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function OrganizationHistorySection() {
	const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "organizationHistories",
	});

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Riwayat Organisasi Internal" />
			<div className="space-y-6">
				{fields.map((field, index) => {
					return (
						<div key={field.id}>
							<div className="flex justify-between items-center mb-4">
								<h4 className="font-semibold text-gray-700">
									Organisasi #{index + 1}
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
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<FormField
									control={control}
									name={`organizationHistories.${index}.organization`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nama Organisasi
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Contoh: Koperasi Karyawan"
													{...field}
													className="w-full"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`organizationHistories.${index}.role`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Jabatan
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Contoh: Bendahara"
													{...field}
													className="w-full"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`organizationHistories.${index}.startDate`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Tanggal Mulai
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													className="w-full"
													value={
														field.value ? format(field.value, "yyyy-MM-dd") : ""
													}
													onChange={(e) =>
														field.onChange(new Date(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`organizationHistories.${index}.endDate`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tanggal Berakhir</FormLabel>
											<FormControl>
												<Input
													type="date"
													className="w-full"
													value={
														field.value ? format(field.value, "yyyy-MM-dd") : ""
													}
													onChange={(e) =>
														field.onChange(
															e.target.value ? new Date(e.target.value) : null
														)
													}
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
							organization: "",
							role: "",
							startDate: new Date(),
							endDate: null,
						})
					}
				>
					<Plus className="mr-2 h-4 w-4" /> Tambah Riwayat Organisasi
				</Button>
			</div>
		</section>
	);
}
