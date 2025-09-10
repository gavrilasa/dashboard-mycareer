// components/employee/dashboard/HistoryCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// --- Type Definitions ---
interface ColumnDef<T> {
	accessorKey: keyof T | string;
	header: string;
	cell?: (item: T) => React.ReactNode;
}

interface HistoryCardProps<T> {
	title: string;
	icon: React.ElementType;
	items: T[] | undefined;
	renderItemMobile: (item: T) => React.ReactNode;
	columnsDesktop: ColumnDef<T>[];
}

// --- Helper Function (Diperbaiki) ---
function getNestedValue<T>(obj: T, path: string): React.ReactNode {
	const value = path
		.split(".")
		.reduce(
			(acc, part) =>
				acc && typeof acc === "object"
					? (acc as Record<string, unknown>)[part]
					: undefined,
			obj as unknown
		);

	// Memastikan nilai yang dikembalikan adalah tipe yang valid untuk ReactNode
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		React.isValidElement(value)
	) {
		return value;
	}
	return null;
}

// --- Komponen Utama ---
export const HistoryCard = <T extends { id: string | number }>({
	title,
	icon: Icon,
	items,
	renderItemMobile,
	columnsDesktop,
}: HistoryCardProps<T>) => {
	const hasItems = items && items.length > 0;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center">
					<Icon className="w-6 h-6 mr-3 text-primary" />
					<CardTitle>{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				{!hasItems ? (
					<p className="text-sm text-center text-gray-500">
						Tidak ada riwayat untuk ditampilkan.
					</p>
				) : (
					<>
						{/* Tampilan Mobile: Daftar Sederhana (Hanya tampil di layar kecil) */}
						<ul className="space-y-4 lg:hidden">
							{items.map((item) => (
								<li key={item.id}>{renderItemMobile(item)}</li>
							))}
						</ul>

						{/* Tampilan Desktop: Tabel (Hanya tampil di layar besar) */}
						<Table className="hidden lg:table">
							<TableHeader>
								<TableRow>
									{columnsDesktop.map((col) => (
										<TableHead key={col.header}>{col.header}</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.id}>
										{columnsDesktop.map((col) => (
											<TableCell key={`${item.id}-${col.header}`}>
												{col.cell
													? col.cell(item)
													: getNestedValue(item, col.accessorKey as string)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>
				)}
			</CardContent>
		</Card>
	);
};
