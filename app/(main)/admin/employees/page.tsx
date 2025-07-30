"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";
import { SyncModal } from "@/components/admin/SyncModal";

// --- Updated Type Definitions ---
interface ChangeDetail {
	field: string;
	from: string | null;
	to: string | null;
}

interface EmployeeUpdate {
	employeeId: string;
	name: string;
	changes: ChangeDetail[];
}

interface SyncAnalysis {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: EmployeeUpdate[];
	toDelete: { employeeId: string; name: string }[];
}

interface Employee {
	employeeId: string;
	name: string;
	position: { name: string } | null;
	department: { name: string } | null;
	branch: { name: string } | null;
}

interface PaginatedEmployees {
	data: Employee[];
	meta: { totalRecords: number; totalPages: number };
}

export default function EmployeesPage() {
	const [data, setData] = useState<Employee[]>([]);
	const [meta, setMeta] = useState({ totalRecords: 0, totalPages: 1 });
	const [loading, setLoading] = useState(true);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

	const fetchEmployees = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(`/api/admin/employees?${params.toString()}`);
			const result: PaginatedEmployees = await response.json();
			setData(result.data);
			setMeta(result.meta);
		} catch (error) {
			console.error("Failed to fetch employees:", error);
		} finally {
			setLoading(false);
		}
	}, [page, limit, debouncedSearchTerm]);

	useEffect(() => {
		fetchEmployees();
	}, [fetchEmployees]);
	useEffect(() => {
		setPage(1);
	}, [limit, debouncedSearchTerm]);

	const handleCreate = () => console.log("Open create modal");
	const handleEdit = (employee: Employee) =>
		console.log("Open edit modal for:", employee.employeeId);
	const handleDelete = (employee: Employee) =>
		console.log("Open delete modal for:", employee.employeeId);

	const columns = [
		{
			header: "ID",
			className: "w-[10%]",
			accessor: (item: Employee) => item.employeeId,
		},
		{
			header: "Name",
			className: "w-[20%]",
			accessor: (item: Employee) => item.name,
		},
		{
			header: "Position",
			className: "w-[20%]",
			accessor: (item: Employee) => item.position?.name || "-",
		},
		{
			header: "Dept",
			className: "w-[20%]",
			accessor: (item: Employee) => item.department?.name || "-",
		},
		{
			header: "Branches",
			className: "w-[20%]",
			accessor: (item: Employee) => item.branch?.name || "-",
		},
		{
			header: "Action",
			className: "w-[10%] text-center",
			accessor: (item: Employee) => (
				<div className="flex items-center justify-center gap-2">
					<Button
						onClick={() => handleEdit(item)}
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-500 hover:text-blue-600"
					>
						<Edit size={16} />
					</Button>
					<Button
						onClick={() => handleDelete(item)}
						variant="ghost"
						size="icon"
						className="h-6 w-6 text-gray-500 hover:text-red-600"
					>
						<Trash2 size={16} />
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-800">Data Karyawan</h1>
				<Button variant="default" onClick={() => setIsSyncModalOpen(true)}>
					<RefreshCcw className="mr-2 h-4 w-4" />
					Synchronize Data
				</Button>
			</div>

			<CrudTable
				title=""
				columns={columns}
				data={data}
				loading={loading}
				limit={limit}
				onLimitChange={setLimit}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				onCreate={handleCreate}
				pagination={{
					currentPage: page,
					totalPages: meta.totalPages,
					totalRecords: meta.totalRecords,
					onPageChange: setPage,
				}}
			/>

			<SyncModal
				isOpen={isSyncModalOpen}
				onClose={() => setIsSyncModalOpen(false)}
				onSuccess={() => {
					fetchEmployees();
					setIsSyncModalOpen(false);
				}}
			/>
		</>
	);
}
