"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

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

interface CareerHistorySectionProps {
	masterData: MasterData | null;
}

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function CareerHistorySection({
	masterData,
}: CareerHistorySectionProps) {
	const { control, setValue } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "careerHistories",
	});

	const watchedCareerHistories = useWatch({
		control,
		name: "careerHistories",
	});

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Riwayat Karier Internal" />
			<div className="space-y-6">
				{fields.map((field, index) => {
					const currentBranchId = watchedCareerHistories?.[index]?.branchId;
					const currentDepartmentId =
						watchedCareerHistories?.[index]?.departmentId;

					return (
						<div key={field.id}>
							<div className="flex justify-between items-center mb-4">
								<h4 className="font-semibold text-gray-700">
									Posisi #{index + 1}
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
									name={`careerHistories.${index}.branchId`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Cabang
												<RequiredAsterisk />
											</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setValue(`careerHistories.${index}.departmentId`, "");
													setValue(`careerHistories.${index}.positionId`, "");
												}}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Pilih Cabang" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData?.branches.map((b) => (
														<SelectItem key={b.id} value={b.id}>
															{b.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`careerHistories.${index}.departmentId`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Departemen
												<RequiredAsterisk />
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!currentBranchId}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Pilih Departemen" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData?.departments
														.filter((d) => d.branchId === currentBranchId)
														.map((d) => (
															<SelectItem key={d.id} value={d.id}>
																{d.name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`careerHistories.${index}.positionId`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Posisi
												<RequiredAsterisk />
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!currentDepartmentId}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Pilih Posisi" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData?.positions
														.filter(
															(p) => p.departmentId === currentDepartmentId
														)
														.map((p) => (
															<SelectItem key={p.id} value={p.id}>
																{p.name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`careerHistories.${index}.startDate`}
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
									name={`careerHistories.${index}.endDate`}
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
							branchId: "",
							departmentId: "",
							positionId: "",
							startDate: new Date(),
							endDate: null,
						})
					}
				>
					<Plus className="mr-2 h-4 w-4" /> Tambah Riwayat Karier
				</Button>
			</div>
		</section>
	);
}
