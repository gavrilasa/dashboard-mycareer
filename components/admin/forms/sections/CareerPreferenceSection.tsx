// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/components/admin/forms/sections/CareerPreferenceSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function CareerPreferenceSection() {
	const { control } = useFormContext();

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Preferensi Pengembangan Karier" />
			<div className="space-y-6">
				<FormField
					control={control}
					name="careerPreference.preferredMentor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Preferensi Mentor</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Sebutkan nama atau kriteria mentor yang diharapkan..."
									{...field}
									value={field.value ?? ""}
									className="w-full min-h-[100px]"
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
									placeholder="Sebutkan jenis pelatihan atau skill yang ingin dikembangkan..."
									{...field}
									value={field.value ?? ""}
									className="w-full min-h-[100px]"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</section>
	);
}
