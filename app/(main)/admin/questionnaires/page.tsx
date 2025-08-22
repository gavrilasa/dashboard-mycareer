"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { ColumnDef } from "@tanstack/react-table";
import { Toaster, toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

// --- Definisi Tipe Data ---

// Tipe ini harus memiliki 'id' untuk kompatibilitas dengan CrudTable
interface EmployeeResult {
	id: string; // Menggunakan 'id' sebagai alias untuk employeeId
	employeeId: string;
	fullName: string;
	positionName: string;
	results: {
		competency: string;
		calculatedScore: number;
		gap: number;
		recommendations: string;
	}[];
}

interface ApiResponse {
	data: Omit<EmployeeResult, "id">[]; // API respons tidak perlu 'id'
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

// --- Definisi Kolom ---

const baseColumns: ColumnDef<EmployeeResult>[] = [
	{
		accessorKey: "fullName",
		header: "Nama Karyawan",
	},
	{
		accessorKey: "positionName",
		header: "Jabatan",
	},
];

const recommendationColumn: ColumnDef<EmployeeResult> = {
	header: "Rekomendasi Pelatihan",
	id: "recommendations",
	cell: ({ row }) => {
		const recommendations = row.original.results
			.filter((r) => r.recommendations)
			.map((r) => r.recommendations)
			.join(", ");
		return (
			<div className="whitespace-normal text-xs">{recommendations || "-"}</div>
		);
	},
};

export default function QuestionnaireResultsPage() {
	const [data, setData] = useState<EmployeeResult[]>([]);
	const [allCompetencies, setAllCompetencies] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalRecords: 0,
	});

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const fetchResults = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(
				`/api/admin/competency-results?${params.toString()}`
			);

			if (!response.ok) {
				throw new Error(
					(await response.json()).message || "Gagal memuat hasil."
				);
			}

			const result: ApiResponse = await response.json();

			// Mengubah 'employeeId' menjadi 'id' agar sesuai dengan CrudTable
			const formattedData = result.data.map((emp) => ({
				...emp,
				id: emp.employeeId,
			}));
			setData(formattedData);

			setPagination({
				currentPage: result.meta.page,
				totalPages: result.meta.totalPages,
				totalRecords: result.meta.total,
			});

			if (page === 1 && debouncedSearchTerm === "") {
				const uniqueCompetencies = result.data.reduce<Set<string>>(
					(acc, employee) => {
						employee.results.forEach((res) => acc.add(res.competency));
						return acc;
					},
					new Set()
				);
				setAllCompetencies(Array.from(uniqueCompetencies));
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Gagal Memuat Data", { description: error.message });
			}
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchResults();
	}, [fetchResults]);

	const columns = useMemo<ColumnDef<EmployeeResult>[]>(() => {
		const dynamicColumns: ColumnDef<EmployeeResult>[] = allCompetencies.map(
			(competency) => ({
				header: competency,
				id: competency,
				cell: ({ row }) => {
					const result = row.original.results.find(
						(r) => r.competency === competency
					);
					if (!result) return "-";

					const score = result.calculatedScore.toFixed(2);
					const gap = result.gap;

					return (
						<div className="flex flex-col items-center text-center">
							<span className="font-semibold">{score}</span>
							<Badge
								variant={gap < 0 ? "destructive" : "default"}
								className="w-fit"
							>
								{gap >= 0 ? (
									<ArrowUp className="h-3 w-3 mr-1" />
								) : (
									<ArrowDown className="h-3 w-3 mr-1" />
								)}
								{gap.toFixed(2)}
							</Badge>
						</div>
					);
				},
			})
		);
		return [...baseColumns, ...dynamicColumns, recommendationColumn];
	}, [allCompetencies]);

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Hasil Kuesioner Kompetensi</h1>
				</div>
				<CrudTable
					columns={columns}
					data={data}
					loading={loading}
					search={searchTerm}
					onSearchChange={setSearchTerm}
					pagination={{ ...pagination, onPageChange: setPage }}
					limit={limit}
					onLimitChange={setLimit}
					createButton={null}
				/>
			</div>
		</>
	);
}
