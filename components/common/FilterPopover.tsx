// components/common/FilterPopover.tsx

"use client";

import { useState, useEffect } from "react";
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
	positionId?: string;
	pathType?: "ALIGN" | "CROSS" | "";
	fromJobRoleId?: string;
	toJobRoleId?: string;
	status?: "published" | "draft" | "";
}

interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
	departmentId?: string;
}

interface MasterData {
	branches?: MasterDataItem[];
	departments?: MasterDataItem[];
	positions?: MasterDataItem[];
	jobRoles?: MasterDataItem[];
}

export interface FilterConfigItem {
	key: keyof ActiveFilters;
	label: string;
	placeholder: string;
	options: MasterDataItem[] | { id: string; name: string }[];
	dependsOn?: keyof ActiveFilters;
	dependencyMapKey?: "branchId" | "departmentId";
}

interface FilterPopoverProps {
	masterData: MasterData;
	activeFilters: ActiveFilters;
	onApplyFilters: (filters: ActiveFilters) => void;
	filterConfig: FilterConfigItem[];
}

export function FilterPopover({
	masterData,
	activeFilters,
	onApplyFilters,
	filterConfig,
}: FilterPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [tempFilters, setTempFilters] = useState<ActiveFilters>(activeFilters);

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
		const resetFilters: ActiveFilters = {};
		filterConfig.forEach((config) => {
			resetFilters[config.key] = "";
		});
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
			if (filterName === "branchId") {
				newFilters.departmentId = "";
				newFilters.positionId = "";
			}
			if (filterName === "departmentId") {
				newFilters.positionId = "";
			}
			return newFilters;
		});
	};

	const getFilteredOptions = (config: FilterConfigItem) => {
		if (!config.dependsOn || !config.dependencyMapKey) {
			return config.options;
		}

		const dependencyValue = tempFilters[config.dependsOn];
		if (!dependencyValue) {
			return [];
		}

		let sourceList: MasterDataItem[] = [];
		if (config.key === "departmentId") {
			sourceList = masterData.departments || [];
		} else if (config.key === "positionId") {
			sourceList = masterData.positions || [];
		}

		return sourceList.filter(
			(opt) => opt[config.dependencyMapKey!] === dependencyValue
		);
	};

	const isFilterActive = Object.values(activeFilters).some(
		(val) => val && val.length > 0
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={isFilterActive ? "default" : "outline"}
					size="sm"
					className="cursor-pointer"
				>
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
						{filterConfig.map((config) => (
							<div
								key={config.key}
								className="grid grid-cols-3 items-center gap-4"
							>
								<Label htmlFor={config.key}>{config.label}</Label>
								<Select
									value={tempFilters[config.key] || "all"}
									onValueChange={(value) =>
										handleFilterChange(config.key, value)
									}
									disabled={
										!!config.dependsOn && !tempFilters[config.dependsOn]
									}
								>
									<SelectTrigger className="col-span-2 h-8">
										<SelectValue placeholder={config.placeholder} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Semua</SelectItem>
										{getFilteredOptions(config).map((option) => (
											<SelectItem key={option.id} value={option.id}>
												{option.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						))}
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
