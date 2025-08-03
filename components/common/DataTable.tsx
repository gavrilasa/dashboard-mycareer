"use client";

import React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	Cell, // Import the 'Cell' type from the library
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface DataItem {
	id: string | number;
}

interface DataTableProps<TData extends DataItem, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	loading?: boolean;
}

export function DataTable<TData extends DataItem, TValue>({
	columns,
	data,
	loading = false,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	// FIX: Replace 'any' with the specific 'Cell' type for type safety.
	const getCellTextContent = (cell: Cell<TData, unknown>): string => {
		const value = cell.getValue();
		if (React.isValidElement(value)) {
			const props = value.props as { children?: React.ReactNode };
			if (props && props.children) {
				return React.Children.toArray(props.children).join("");
			}
			return "";
		}
		return String(value ?? "");
	};

	return (
		<div className="overflow-x-auto">
			<Table className="min-w-full">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50"
						>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									style={{
										width:
											header.getSize() !== 150
												? `${header.getSize()}px`
												: undefined,
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								<Loader2 className="w-6 h-6 mx-auto text-gray-400 animate-spin" />
							</TableCell>
						</TableRow>
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.original.id}
								className="border-b border-gray-200"
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className="py-2 px-3 whitespace-nowrap overflow-hidden text-ellipsis align-top h-10"
										title={getCellTextContent(cell)}
									>
										<div className="flex items-center justify-start h-8">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
