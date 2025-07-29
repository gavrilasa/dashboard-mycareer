"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { CrudTable } from "@/components/common/CrudTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
// import { EmployeeFormModal } from "./components/EmployeeFormModal";
// import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";

// --- Tipe Data ---
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

	// State for modals
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
		null
	);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const fetchEmployees = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search: debouncedSearchTerm,
			});
			const response = await fetch(`/api/employees?${params.toString()}`);
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

	const handleCreate = () => {
		setSelectedEmployee(null);
		setIsModalOpen(true);
		console.log("Open create modal");
	};

	const handleEdit = (employee: Employee) => {
		setSelectedEmployee(employee);
		setIsModalOpen(true);
		console.log("Open edit modal for:", employee.employeeId);
	};

	const handleDelete = (employee: Employee) => {
		setSelectedEmployee(employee);
		setIsDeleteModalOpen(true);
		console.log("Open delete modal for:", employee.employeeId);
	};

	// PERBAIKAN: Definisi kolom diperbarui sesuai permintaan
	const columns = [
		{
			header: "ID",
			className: "w-[15%]",
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
			className: "w-15%]",
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
						className="h-8 w-8 text-gray-500 hover:text-blue-600"
					>
						<Edit size={16} />
					</Button>
					<Button
						onClick={() => handleDelete(item)}
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-gray-500 hover:text-red-600"
					>
						<Trash2 size={16} />
					</Button>
				</div>
			),
		},
	];

	return (
		<>
			<CrudTable
				title="Data Karyawan"
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

			{/* Modals for CRUD operations will be rendered here.
        They are conditionally rendered based on the state managed in this page.
      */}
			{/* <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={fetchEmployees} // Refresh data on success
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={fetchEmployees} // Refresh data on success
      /> */}
		</>
	);
}
