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

const Asterisk = () => <span className="text-red-500 -ml-1">*</span>;

interface OrganizationHistoryFormProps {
	onSkip: () => void;
}

export function OrganizationHistoryForm({
	onSkip,
}: OrganizationHistoryFormProps) {
	const { control, getValues } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: "organizationHistories",
	});

	const [hasExperience, setHasExperience] = useState<boolean | null>(
		getValues("organizationHistories")?.length > 0 ? true : null
	);

	useEffect(() => {
		const hasData = getValues("organizationHistories")?.length > 0;
		if (hasData) {
			setHasExperience(true);
		}
	}, [fields, getValues]);

	const handleExperienceChoice = (choice: boolean) => {
		setHasExperience(choice);
		if (choice && fields.length === 0) {
			append({
				organization: "",
				role: "",
				startDate: undefined,
				endDate: null,
			});
		} else if (!choice) {
			remove();
			onSkip();
		}
	};

	return (
		<Card className="border-none shadow-none bg-white gap-3 py-8">
			<CardHeader className="gap-0">
				<CardTitle>Riwayat Organisasi Internal</CardTitle>
				<CardDescription className="mt-2">
					Catat pengalaman Anda dalam kepengurusan organisasi di dalam
					perusahaan.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-3 mt-2">
					<FormLabel>
						Apakah Anda memiliki riwayat organisasi internal?
					</FormLabel>
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
										organization: "",
										role: "",
										startDate: undefined,
										endDate: null,
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								Tambah Organisasi
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
											Organisasi #{index + 1}
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

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={control}
											name={`organizationHistories.${index}.organization`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Nama Organisasi <Asterisk />
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Contoh: Koperasi Karyawan"
															{...field}
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
														Jabatan <Asterisk />
													</FormLabel>
													<FormControl>
														<Input placeholder="Contoh: Bendahara" {...field} />
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
											name={`organizationHistories.${index}.endDate`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Tanggal Berakhir</FormLabel>
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
																	e.target.value
																		? new Date(e.target.value)
																		: null
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
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
