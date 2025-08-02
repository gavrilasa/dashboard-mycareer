"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const pageNumbers = [];
	const maxPagesInWindow = 3;

	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		let startPage, endPage;
		if (currentPage <= 2) {
			startPage = 1;
			endPage = maxPagesInWindow;
		} else if (currentPage + 1 >= totalPages) {
			startPage = totalPages - maxPagesInWindow + 1;
			endPage = totalPages;
		} else {
			startPage = currentPage - 1;
			endPage = currentPage + 1;
		}

		// if (startPage > 1) {
		// 	pageNumbers.push("...");
		// }

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		// if (endPage < totalPages) {
		// 	pageNumbers.push("...");
		// }
	}

	return (
		<div className="flex items-center gap-1">
			{/* Tombol ke Halaman Pertama */}
			<Button
				variant="outline"
				size="sm"
				className="p-0 h-9 w-9"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
			>
				<span className="sr-only">Go to first page</span>
				<ChevronsLeft className="w-4 h-4" />
			</Button>
			{/* Tombol ke Halaman Sebelumnya */}
			{/* <Button
				variant="outline"
				size="sm"
				className="p-0 h-9 w-9"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<span className="sr-only">Go to previous page</span>
				<ChevronLeft className="w-4 h-4" />
			</Button> */}

			{/* Tombol Nomor Halaman */}
			<div className="flex items-center gap-1">
				{pageNumbers.map((num, index) =>
					typeof num === "number" ? (
						<Button
							key={index}
							variant={currentPage === num ? "default" : "outline"}
							size="sm"
							className="p-0 h-9 w-9"
							onClick={() => onPageChange(num)}
						>
							{num}
						</Button>
					) : (
						<span key={index} className="px-2 py-1 text-sm">
							...
						</span>
					)
				)}
			</div>

			{/* Tombol ke Halaman Berikutnya */}
			{/* <Button
				variant="outline"
				size="sm"
				className="p-0 h-9 w-9"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<span className="sr-only">Go to next page</span>
				<ChevronRight className="w-4 h-4" />
			</Button> */}
			{/* Tombol ke Halaman Terakhir */}
			<Button
				variant="outline"
				size="sm"
				className="p-0 h-9 w-9"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
			>
				<span className="sr-only">Go to last page</span>
				<ChevronsRight className="w-4 h-4" />
			</Button>
		</div>
	);
};
