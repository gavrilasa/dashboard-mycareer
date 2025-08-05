"use client";

import { useFormContext } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

export function CareerPreferenceForm() {
	const { control } = useFormContext();

	return (
		<Card className="border-none shadow-none bg-white gap-3 py-8">
			<CardHeader>
				<CardTitle>Preferensi Pengembangan Karier</CardTitle>
				<CardDescription className="mt-2">
					Bantu kami memahami aspirasi Anda untuk masa depan.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="p-6 border rounded-lg bg-white space-y-6 shadow-sm">
					<FormField
						control={control}
						name="careerPreference.preferredMentor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Preferensi Mentor</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sebutkan nama atau kriteria mentor yang Anda harapkan untuk membimbing Anda."
										className="min-h-[100px]"
										// FIX: Ganti null/undefined dengan string kosong
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="careerPreference.preferredTraining"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Kebutuhan Pelatihan</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Sebutkan jenis pelatihan atau skill yang ingin Anda kembangkan untuk menunjang karier Anda."
										className="min-h-[100px]"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
