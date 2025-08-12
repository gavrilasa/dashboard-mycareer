"use client";

import React from "react";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	Cell,
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

// Extend the ColumnMeta interface to include width property
declare module "@tanstack/react-table" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData, TValue> {
		width?: string;
		truncate?: boolean; // Option to enable/disable truncation per column
		align?: "left" | "center" | "right"; // Add alignment option
	}
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

	const shouldTruncate = (column: ColumnDef<TData, TValue>): boolean => {
		// Default to truncate unless explicitly disabled
		return column.meta?.truncate !== false;
	};

	const renderCellContent = (cell: Cell<TData, unknown>) => {
		const content = flexRender(cell.column.columnDef.cell, cell.getContext());

		// If it's an action column or contains buttons, don't truncate
		if (
			cell.column.id === "actions" ||
			!shouldTruncate(cell.column.columnDef)
		) {
			const align = cell.column.columnDef.meta?.align || "left";
			const justifyClass =
				align === "center"
					? "justify-center"
					: align === "right"
					? "justify-end"
					: "justify-start";
			return (
				<div className={`flex items-center h-8 ${justifyClass}`}>{content}</div>
			);
		}

		// For text content, apply truncation
		return (
			<div className="flex items-center justify-start h-8 w-full overflow-hidden">
				<div className="truncate w-full">{content}</div>
			</div>
		);
	};

	return (
		<div className="overflow-x-auto">
			<Table className="min-w-full table-fixed">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50"
						>
							{headerGroup.headers.map((header) => {
								// Get width from meta or fallback to size percentage
								const width =
									header.column.columnDef.meta?.width || `${header.getSize()}%`;
								const align = header.column.columnDef.meta?.align || "left";
								const alignClass =
									align === "center"
										? "text-center"
										: align === "right"
										? "text-right"
										: "text-left";

								return (
									<TableHead
										key={header.id}
										style={{ width }}
										className={alignClass}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
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
								{row.getVisibleCells().map((cell) => {
									// Get width from meta or fallback to size percentage
									const width =
										cell.column.columnDef.meta?.width ||
										`${cell.column.getSize()}%`;

									return (
										<TableCell
											key={cell.id}
											style={{ width }}
											className="py-2 px-3 align-top h-10"
											title={
												shouldTruncate(cell.column.columnDef)
													? getCellTextContent(cell)
													: undefined
											}
										>
											{renderCellContent(cell)}
										</TableCell>
									);
								})}
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
