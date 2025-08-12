"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
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
import { GkmRole } from "@prisma/client";

const Asterisk = () => <span className="text-red-500 -ml-1">*</span>;

interface GkmHistoryFormProps {
	onSkip: () => void;
}

export function GkmHistoryForm({ onSkip }: GkmHistoryFormProps) {
	const { control, getValues, setValue } = useFormContext();

	const [hasExperience, setHasExperience] = useState<boolean | null>(() => {
		const count = getValues("gkmHistory.participationCount");
		// Inisialisasi state: true jika ada data, null jika tidak ada (belum dipilih)
		return typeof count === "number" && count > 0 ? true : null;
	});

	useEffect(() => {
		const count = getValues("gkmHistory.participationCount");
		if (typeof count === "number" && count > 0) {
			setHasExperience(true);
		}
	}, [getValues]);

	const handleExperienceChoice = (choice: boolean) => {
		setHasExperience(choice);
		if (!choice) {
			setValue("gkmHistory.participationCount", 0);
			setValue("gkmHistory.highestRole", GkmRole.TIDAK_PERNAH);
			onSkip();
		}
	};

	return (
		<Card className="border-none shadow-none bg-white gap-3 py-8">
			<CardHeader className="gap-0">
				<CardTitle>Riwayat GKM (Gugus Kendali Mutu)</CardTitle>
				<CardDescription className="mt-2">
					Isi informasi mengenai keikutsertaan Anda dalam GKM.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-3 mt-2">
					<FormLabel>Apakah Anda pernah mengikuti GKM?</FormLabel>
					<div className="grid grid-cols-2 gap-2 max-w-[200px]">
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
						<div className="p-6 border rounded-lg bg-white space-y-4 shadow-sm">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={control}
									name="gkmHistory.participationCount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Jumlah Keikutsertaan <Asterisk />
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Isi dengan angka, cth: 3"
													{...field}
													value={field.value || ""}
													onChange={(e) =>
														field.onChange(parseInt(e.target.value, 10) || 0)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="gkmHistory.highestRole"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Jabatan Tertinggi <Asterisk />
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Pilih jabatan tertinggi" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.values(GkmRole).map((role) => (
														<SelectItem key={role} value={role}>
															{role.replace(/_/g, " ")}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
