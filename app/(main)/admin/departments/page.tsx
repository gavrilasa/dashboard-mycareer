"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/common/DataTable";

// Tipe Data
interface Department {
	id: string;
	name: string;
}

export default function DepartmentsPage() {
	const [allDepartments, setAllDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/master-data/departments");
				if (!response.ok) throw new Error("Failed to fetch departments");
				const data = await response.json();
				setAllDepartments(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredData = useMemo(() => {
		return allDepartments.filter((dept) =>
			dept.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
		);
	}, [allDepartments, debouncedSearchTerm]);

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
			header: "ID Departemen",
			accessor: (item: Department) => item.id,
			className: "w-[20%]",
		},
		{
			header: "Nama Departemen",
			accessor: (item: Department) => item.name,
			className: "w-[60%]",
		},
	];

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-gray-800">Data Departemen</h1>
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
