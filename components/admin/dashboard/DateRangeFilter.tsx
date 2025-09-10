// components/admin/dashboard/DateRangeFilter.tsx

"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DateRangeFilterProps {
	onDateChange: (range: { from: Date; to: Date }) => void;
	className?: string;
}

export function DateRangeFilter({
	onDateChange,
	className,
}: DateRangeFilterProps) {
	const [date, setDate] = React.useState<DateRange | undefined>(() => {
		const nowInAsiaJakarta = toZonedTime(new Date(), "Asia/Jakarta");
		const to = endOfDay(nowInAsiaJakarta);
		const from = startOfDay(subDays(to, 29));
		return { from, to };
	});
	const [preset, setPreset] = React.useState<string>("30");

	React.useEffect(() => {
		if (date?.from && date?.to) {
			onDateChange({ from: date.from, to: date.to });
		}
	}, [date, onDateChange]);

	const handlePresetChange = (value: string) => {
		setPreset(value);
		const nowInAsiaJakarta = toZonedTime(new Date(), "Asia/Jakarta");
		const to = endOfDay(nowInAsiaJakarta);
		let from: Date;

		switch (value) {
			case "7":
				from = startOfDay(subDays(nowInAsiaJakarta, 6));
				break;
			case "90":
				from = startOfDay(subDays(nowInAsiaJakarta, 89));
				break;
			case "30":
			default:
				from = startOfDay(subDays(nowInAsiaJakarta, 29));
				break;
		}
		setDate({ from, to });
	};

	const handleDateSelect = (selectedDate: DateRange | undefined) => {
		setDate(selectedDate);
		// Jika pengguna memilih tanggal dari kalender, reset pilihan preset
		if (selectedDate) {
			setPreset("custom");
		}
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[260px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pilih tanggal</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="end">
					<div className="flex p-2 border-b">
						<Select onValueChange={handlePresetChange} value={preset}>
							<SelectTrigger>
								<SelectValue placeholder="Pilih rentang..." />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="7">7 Hari Terakhir</SelectItem>
								<SelectItem value="30">30 Hari Terakhir</SelectItem>
								<SelectItem value="90">90 Hari Terakhir</SelectItem>
								<SelectItem value="custom" disabled>
									Rentang Kustom
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDateSelect}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
