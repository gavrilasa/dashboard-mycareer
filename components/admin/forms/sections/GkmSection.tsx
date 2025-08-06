// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/components/admin/forms/sections/GkmSection.tsx
"use client";

import { useFormContext } from "react-hook-form";
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

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function GkmSection() {
	const { control } = useFormContext();

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Riwayat GKM" />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<FormField
					control={control}
					name="gkmHistory.participationCount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Jumlah Partisipasi
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Isi dengan angka, cth: 3"
									{...field}
									onChange={(e) =>
										field.onChange(parseInt(e.target.value, 10) || 0)
									}
									className="w-full"
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
								Peran Tertinggi
								<RequiredAsterisk />
							</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="w-full">
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
		</section>
	);
}
