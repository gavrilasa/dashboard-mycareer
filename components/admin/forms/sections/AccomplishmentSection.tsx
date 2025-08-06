// gavrilasa/dashboard-mycareer/dashboard-mycareer-d0fc9fe783109164caa8848ee01e37e14fba4761/components/admin/forms/sections/AccomplishmentSection.tsx
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

const RequiredAsterisk = () => <span className="text-red-500 ml-1">*</span>;
const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-xl font-semibold leading-7 text-gray-900 border-b pb-3 mb-6">
		{title}
	</h3>
);

export function AccomplishmentSection() {
	const { control } = useFormContext();

	return (
		<section className="bg-white p-8 rounded-xl">
			<SectionTitle title="Prestasi" />
			<div className="grid grid-cols-1 gap-6">
				<FormField
					control={control}
					name="bestEmployeeScore.count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Jumlah Penghargaan Karyawan Teladan
								<RequiredAsterisk />
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Isi dengan angka, cth: 1"
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
			</div>
		</section>
	);
}
