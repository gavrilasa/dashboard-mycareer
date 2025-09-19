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

const Asterisk = () => <span className="-ml-1 text-red-500">*</span>;

interface AccomplishmentsFormProps {
	onSkip: () => void;
}

export function AccomplishmentsForm({ onSkip }: AccomplishmentsFormProps) {
	const { control, watch, setValue } = useFormContext();

	// Tonton nilai 'count' secara reaktif dari form
	const count = watch("bestEmployeeScore.count");

	const [hasAccomplishments, setHasAccomplishments] = useState<boolean | null>(
		typeof count === "number" && count > 0 ? true : null
	);

	// Efek ini akan berjalan setiap kali 'count' berubah, memastikan UI selalu sinkron
	useEffect(() => {
		const hasData = typeof count === "number" && count > 0;
		setHasAccomplishments(hasData);
	}, [count]);

	const handleExperienceChoice = (choice: boolean) => {
		setHasAccomplishments(choice);
		if (!choice) {
			// Jika memilih "Tidak", reset nilai ke 0 dan lewati ke langkah berikutnya
			setValue("bestEmployeeScore.count", 0);
			onSkip();
		}
	};

	return (
		<Card className="gap-3 py-8 bg-white border-none shadow-none">
			<CardHeader className="gap-0">
				<CardTitle>Prestasi Karyawan Teladan</CardTitle>
				<CardDescription className="mt-2">
					Isi berapa kali Anda pernah menerima penghargaan sebagai karyawan
					teladan.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mt-2 space-y-3">
					<FormLabel className="leading-normal">
						Apakah Anda pernah menerima penghargaan Karyawan Teladan?
					</FormLabel>
					<div className="grid grid-cols-2 gap-2 max-w-[200px]">
						<Button
							type="button"
							size="sm"
							variant={hasAccomplishments === true ? "default" : "outline"}
							onClick={() => handleExperienceChoice(true)}
						>
							Ya
						</Button>
						{/* FIX: Logika variant disederhanakan agar tidak aktif secara default */}
						<Button
							type="button"
							size="sm"
							variant={hasAccomplishments === false ? "outline" : "outline"}
							onClick={() => handleExperienceChoice(false)}
						>
							Tidak
						</Button>
					</div>
				</div>

				{hasAccomplishments === true && (
					<div className="pt-6 mt-6 border-t">
						<div className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
							<FormField
								control={control}
								name="bestEmployeeScore.count"
								render={({ field }) => (
									<FormItem className="max-w-xs">
										<FormLabel>
											Jumlah Penghargaan <Asterisk />
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Isi dengan angka, cth: 1"
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
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
