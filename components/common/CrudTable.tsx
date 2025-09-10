// components/common/CrudTable.tsx

"use client";

import React from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Pagination } from "./Pagination";

interface DataItem {
	id: string | number;
}

interface CrudTableProps<TData extends DataItem, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading: boolean;
	limit: number;
	onLimitChange: (value: number) => void;
	search: string;
	onSearchChange: (value: string) => void;
	pagination: {
		currentPage: number;
		totalPages: number;
		totalRecords: number;
		onPageChange: (page: number) => void;
	};
	createButton?: React.ReactNode;
	filterContent?: React.ReactNode;
	sorting?: SortingState; // Prop untuk menerima state sorting
	setSorting?: React.Dispatch<React.SetStateAction<SortingState>>; // Prop untuk handler sorting
}

export function CrudTable<TData extends DataItem, TValue>({
	columns,
	data,
	loading,
	limit,
	onLimitChange,
	search,
	onSearchChange,
	pagination,
	createButton,
	filterContent,
	sorting,
	setSorting,
}: CrudTableProps<TData, TValue>) {
	const { currentPage, totalPages, totalRecords, onPageChange } = pagination;
	const startEntry = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
	const endEntry = Math.min(currentPage * limit, totalRecords);

	return (
		<div className="px-6 pt-6 pb-5 bg-white border border-gray-200 rounded-lg shadow-md">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 mb-4 md:flex-row md:items-center">
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600">Show</span>
					<Select
						value={limit.toString()}
						onValueChange={(value) => onLimitChange(Number(value))}
					>
						<SelectTrigger className="w-[70px]">
							<SelectValue placeholder={limit} />
						</SelectTrigger>
						<SelectContent>
							{[10, 25, 50].map((val) => (
								<SelectItem key={val} value={val.toString()}>
									{val}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-sm text-gray-600">entries</span>
				</div>
				<div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
					<div className="relative w-full sm:w-auto">
						<Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
						<Input
							placeholder="Search..."
							value={search}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full pl-10 md:w-64"
						/>
					</div>
					{filterContent}
					{createButton}
				</div>
			</div>

			<DataTable
				columns={columns}
				data={data}
				loading={loading}
				sorting={sorting}
				setSorting={setSorting}
			/>

			{totalRecords > 0 && (
				<div className="flex flex-col items-center justify-between gap-4 mt-6 md:flex-row">
					<p className="text-sm text-gray-600">
						Showing {startEntry} to {endEntry} of {totalRecords} entries
					</p>
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</div>
			)}
		</div>
	);
}
