"use client";

import { useEffect } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

interface UserProfile {
	branchId: string;
	departmentId: string;
	positionId: string;
}

interface CareerHistoryFormProps {
	masterData: MasterData;
	currentUserPosition: UserProfile | null;
}

const Asterisk = () => <span className="text-red-500 -ml-1">*</span>;

export function CareerHistoryForm({
	masterData,
	currentUserPosition,
}: CareerHistoryFormProps) {
	const { control, watch, setValue, getValues } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "careerHistories",
	});

	// Efek untuk mengisi posisi saat ini secara otomatis saat komponen dimuat
	useEffect(() => {
		const careerHistories = getValues("careerHistories");
		if (currentUserPosition && careerHistories.length === 0) {
			append(
				{
					branchId: currentUserPosition.branchId,
					departmentId: currentUserPosition.departmentId,
					positionId: currentUserPosition.positionId,
					startDate: new Date(), // Anda bisa ganti dengan hireDate jika ada
					endDate: null,
				},
				{ shouldFocus: false }
			);
		}
	}, [currentUserPosition, append, getValues]);

	const watchedCareerHistories = watch("careerHistories");

	return (
		<Card className="border-none shadow-sm bg-white gap-3 py-8">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div>
						<CardTitle>Riwayat Karier Internal</CardTitle>
						<CardDescription className="mt-2">
							Posisi saat ini terisi otomatis. Anda dapat menambahkan riwayat
							posisi sebelumnya.
						</CardDescription>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							append({
								branchId: "",
								departmentId: "",
								positionId: "",
								startDate: undefined,
								endDate: null,
							})
						}
					>
						<Plus className="mr-2 h-4 w-4" />
						Tambah Riwayat
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.map((field, index) => {
					const isCurrentPosition = index === 0;
					const currentBranchId = watchedCareerHistories[index]?.branchId;
					const currentDepartmentId =
						watchedCareerHistories[index]?.departmentId;

					return (
						<div
							key={field.id}
							className="p-6 border rounded-lg relative bg-white space-y-4"
						>
							<div className="flex justify-between items-center">
								<h4 className="font-semibold text-slate-800">
									{isCurrentPosition
										? "Posisi Saat Ini"
										: `Riwayat Posisi #${index}`}
								</h4>
								{!isCurrentPosition && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-red-500 hover:text-red-700"
										onClick={() => remove(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								)}
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<FormField
									control={control}
									name={`careerHistories.${index}.branchId`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Cabang
												<Asterisk />
											</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setValue(`careerHistories.${index}.departmentId`, "");
													setValue(`careerHistories.${index}.positionId`, "");
												}}
												value={field.value}
												disabled={isCurrentPosition}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Pilih Cabang" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.branches.map((b) => (
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
												Departemen <Asterisk />
											</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setValue(`careerHistories.${index}.positionId`, "");
												}}
												value={field.value}
												disabled={isCurrentPosition || !currentBranchId}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Pilih Departemen" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.departments
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
												Posisi <Asterisk />
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={isCurrentPosition || !currentDepartmentId}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Pilih Posisi" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{masterData.positions
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
												Tanggal Mulai <Asterisk />
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value instanceof Date
															? field.value.toISOString().split("T")[0]
															: ""
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
											<FormLabel>
												Tanggal Berakhir {!isCurrentPosition && <Asterisk />}
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													value={
														field.value instanceof Date
															? field.value.toISOString().split("T")[0]
															: ""
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
			</CardContent>
		</Card>
	);
}
