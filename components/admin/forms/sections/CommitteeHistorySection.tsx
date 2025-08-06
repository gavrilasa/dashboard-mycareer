// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/components/admin/forms/sections/CommitteeHistorySection.tsx
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

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function CommitteeHistorySection() {
	const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "committeeHistories",
	});

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Riwayat Kepanitiaan" />
			<div className="space-y-6">
				{fields.map((field, index) => {
					return (
						<div key={field.id}>
							<div className="flex justify-between items-center mb-4">
								<h4 className="font-semibold text-gray-700">
									Kepanitiaan #{index + 1}
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
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<FormField
									control={control}
									name={`committeeHistories.${index}.eventName`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nama Acara
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Contoh: HUT Indofood 2024"
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
									name={`committeeHistories.${index}.role`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Jabatan
												<RequiredAsterisk />
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Contoh: Ketua Pelaksana"
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
									name={`committeeHistories.${index}.year`}
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
							eventName: "",
							role: "",
							year: new Date().getFullYear(),
						})
					}
				>
					<Plus className="mr-2 h-4 w-4" /> Tambah Riwayat Kepanitiaan
				</Button>
			</div>
		</section>
	);
}
