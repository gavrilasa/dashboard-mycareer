"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/common/DataTable";

// Tipe Data
interface Branch {
	id: string;
	name: string;
	address: string | null;
}

export default function BranchesPage() {
	const [allBranches, setAllBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/master-data/branches");
				if (!response.ok) throw new Error("Failed to fetch branches");
				const data = await response.json();
				setAllBranches(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredData = useMemo(() => {
		return allBranches.filter((branch) =>
			branch.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
		);
	}, [allBranches, debouncedSearchTerm]);

	const paginatedData = useMemo(() => {
		const start = (currentPage - 1) * limit;
		return filteredData.slice(start, start + limit);
	}, [filteredData, currentPage, limit]);

	const totalPages = Math.ceil(filteredData.length / limit);

	useEffect(() => {
		setCurrentPage(1);
	}, [limit, debouncedSearchTerm]);

	// Define columns for the DataTable
	const columns = [
		{
			header: "ID Cabang",
			accessor: (item: Branch) => item.id,
			className: "w-[15%]",
		},
		{
			header: "Nama Cabang",
			accessor: (item: Branch) => item.name,
			className: "w-[40%]",
		},
		{
			header: "Alamat",
			accessor: (item: Branch) => item.address || "-",
			className: "w-[45%]",
		},
	];

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-gray-800">Data Cabang</h1>
			<DataTable
				columns={columns}
				data={paginatedData}
				loading={loading}
				limit={limit}
				onLimitChange={setLimit}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				pagination={{
					currentPage,
					totalPages,
					totalRecords: filteredData.length,
					onPageChange: setCurrentPage,
				}}
			/>
		</div>
	);
}
