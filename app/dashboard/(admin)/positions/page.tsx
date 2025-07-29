"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/common/DataTable";

// Tipe Data
interface Position {
	id: number;
	name: string;
	departmentId: string;
}
interface Department {
	id: string;
	name: string;
}

export default function PositionsPage() {
	const [allPositions, setAllPositions] = useState<Position[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [positionsRes, departmentsRes] = await Promise.all([
					fetch("/api/master-data/positions"),
					fetch("/api/master-data/departments"),
				]);
				const positionsData = await positionsRes.json();
				const departmentsData = await departmentsRes.json();
				setAllPositions(positionsData);
				setDepartments(departmentsData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const departmentMap = useMemo(
		() => new Map(departments.map((dept) => [dept.id, dept.name])),
		[departments]
	);

	const filteredPositions = useMemo(() => {
		return allPositions.filter((position) =>
			position.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
		);
	}, [allPositions, debouncedSearchTerm]);

	const paginatedPositions = useMemo(() => {
		const start = (currentPage - 1) * limit;
		return filteredPositions.slice(start, start + limit);
	}, [filteredPositions, currentPage, limit]);

	const totalPages = Math.ceil(filteredPositions.length / limit);

	useEffect(() => {
		setCurrentPage(1);
	}, [limit, debouncedSearchTerm]);

	// Define columns for the DataTable
	const columns = [
		{
			header: "ID",
			accessor: (item: Position) => item.id,
			className: "w-[10%]",
		},
		{
			header: "Nama Posisi",
			accessor: (item: Position) => item.name,
			className: "w-[45%]",
		},
		{
			header: "Nama Departemen",
			accessor: (item: Position) => departmentMap.get(item.departmentId) || "-",
			className: "w-[45%]",
		},
	];

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-gray-800">Data Posisi</h1>
			<DataTable
				columns={columns}
				data={paginatedPositions}
				loading={loading}
				limit={limit}
				onLimitChange={setLimit}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				pagination={{
					currentPage,
					totalPages,
					totalRecords: filteredPositions.length,
					onPageChange: setCurrentPage,
				}}
			/>
		</div>
	);
}
