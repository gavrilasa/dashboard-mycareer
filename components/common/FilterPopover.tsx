"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Filter, RotateCcw } from "lucide-react";

// --- Type Definitions ---

export interface ActiveFilters {
	branchId?: string;
	departmentId?: string;
	// Tambahkan jenis filter lain di sini jika diperlukan di masa depan
}

type FilterType = "branch" | "department";

interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
}

interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
}

interface FilterPopoverProps {
	masterData: MasterData;
	activeFilters: ActiveFilters;
	onApplyFilters: (filters: ActiveFilters) => void;
	filterConfig: FilterType[];
}

export function FilterPopover({
	masterData,
	activeFilters,
	onApplyFilters,
	filterConfig,
}: FilterPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState<ActiveFilters>(activeFilters);

	// Sinkronkan state sementara dengan filter aktif saat popover dibuka
	useEffect(() => {
		if (isOpen) {
			setTempFilters(activeFilters);
		}
	}, [isOpen, activeFilters]);

	const handleApply = () => {
		onApplyFilters(tempFilters);
		setIsOpen(false);
	};

	const handleReset = () => {
		const resetFilters = {
			branchId: "",
			departmentId: "",
		};
		setTempFilters(resetFilters);
		onApplyFilters(resetFilters);
		setIsOpen(false);
	};

	const handleFilterChange = (
		filterName: keyof ActiveFilters,
		value: string
	) => {
		const newValue = value === "all" ? "" : value;
		setTempFilters((prev) => {
			const newFilters = { ...prev, [filterName]: newValue };
			// Jika filter cabang diubah, reset filter departemen
			if (filterName === "branchId") {
				newFilters.departmentId = "";
			}
			return newFilters;
		});
	};

	const filteredDepartments = useMemo(
		() =>
			tempFilters.branchId
				? masterData.departments.filter(
						(d) => d.branchId === tempFilters.branchId
				  )
				: masterData.departments,
		[tempFilters.branchId, masterData.departments]
	);

	const isFilterActive = Object.values(activeFilters).some(
		(val) => val && val.length > 0
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant={isFilterActive ? "default" : "outline"} size="sm">
					<Filter className="mr-2 h-4 w-4" />
					Filter
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Filter Data</h4>
						<p className="text-sm text-muted-foreground">
							Saring data berdasarkan kriteria di bawah ini.
						</p>
					</div>
					<div className="grid gap-4">
						{filterConfig.includes("branch") && (
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="branch">Cabang</Label>
								<Select
									value={tempFilters.branchId || "all"}
									onValueChange={(value) =>
										handleFilterChange("branchId", value)
									}
								>
									<SelectTrigger className="col-span-2 h-8">
										<SelectValue placeholder="Pilih Cabang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua Cabang</SelectItem>
										{masterData.branches.map((b) => (
											<SelectItem key={b.id} value={b.id}>
												{b.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
						{filterConfig.includes("department") && (
							<div className="grid grid-cols-3 items-center gap-4">
								<Label htmlFor="department">Departemen</Label>
								<Select
									value={tempFilters.departmentId || "all"}
									onValueChange={(value) =>
										handleFilterChange("departmentId", value)
									}
								>
									<SelectTrigger className="col-span-2 h-8">
										<SelectValue placeholder="Pilih Departemen" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua Departemen</SelectItem>
										{filteredDepartments.map((d) => (
											<SelectItem key={d.id} value={d.id}>
												{d.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
					<div className="flex justify-between pt-4 border-t">
						<Button variant="ghost" size="sm" onClick={handleReset}>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset
						</Button>
						<Button size="sm" onClick={handleApply}>
							Terapkan Filter
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
