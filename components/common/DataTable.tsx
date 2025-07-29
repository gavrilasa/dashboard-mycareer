"use client";

import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { Pagination } from "./Pagination";

// Generic types for reusability
interface Column<T> {
	header: string;
	accessor: (item: T) => React.ReactNode;
	className?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	loading: boolean;

	// Controls for the header
	limit: number;
	onLimitChange: (value: number) => void;
	searchTerm: string;
	onSearchChange: (value: string) => void;

	// Controls for the footer
	pagination: {
		currentPage: number;
		totalPages: number;
		totalRecords: number;
		onPageChange: (page: number) => void;
	};
}

// The unique identifier for each row must be 'id' of type string or number
type DataItem = { id: string | number };

export function DataTable<T extends DataItem>({
	columns,
	data,
	loading,
	limit,
	onLimitChange,
	searchTerm,
	onSearchChange,
	pagination,
}: DataTableProps<T>) {
	const { currentPage, totalPages, totalRecords, onPageChange } = pagination;
	const startEntry = totalRecords > 0 ? (currentPage - 1) * limit + 1 : 0;
	const endEntry = Math.min(currentPage * limit, totalRecords);

	// Helper function to get raw text content for the tooltip (title attribute)
	const getCellTextContent = (
		item: T,
		accessor: Column<T>["accessor"]
	): string => {
		const value = accessor(item);
		if (React.isValidElement(value)) {
			// Safely access props with a more specific type
			const props = value.props as { children?: React.ReactNode };
			if (props && props.children) {
				return React.Children.toArray(props.children).join("");
			}
			return "";
		}
		return String(value ?? "");
	};

	return (
		<div className="px-6 pt-6 pb-5 bg-white border border-gray-200 rounded-lg shadow-md">
			{/* Table Header */}
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
				<div className="relative w-full md:w-auto">
					<Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
					<Input
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 md:w-64"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<Table className="min-w-full table-fixed">
					<TableHeader>
						<TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
							{columns.map((col) => (
								<TableHead key={col.header} className={col.className}>
									{col.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<Loader2 className="w-6 h-6 mx-auto text-gray-400 animate-spin" />
								</TableCell>
							</TableRow>
						) : data.length > 0 ? (
							data.map((item) => (
								<TableRow key={item.id} className="border-b border-gray-200">
									{columns.map((col) => {
										const cellContent = col.accessor(item);
										const titleText = getCellTextContent(item, col.accessor);
										return (
											<TableCell
												key={col.header}
												className="py-3 whitespace-nowrap overflow-hidden text-ellipsis"
											>
												{/* The div with 'truncate' is essential for ellipsis to work correctly */}
												<div className="truncate" title={titleText}>
													{cellContent}
												</div>
											</TableCell>
										);
									})}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Tidak ada hasil ditemukan.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Table Footer */}
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
