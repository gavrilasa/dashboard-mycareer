import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { UserRole, EducationDegree, Gender } from "@prisma/client"; // Import Gender enum
import { hash } from "bcryptjs";
import { ValidatedRow } from "../analyze/route"; // Import the shared type from the analyze endpoint

interface ExecutePayload {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: { employeeId: string; name: string }[];
	toDelete: { employeeId: string; name: string }[];
	fullData: ValidatedRow[];
}

// Helper to calculate age and length of service
const calculateYearsDifference = (startDate: Date): number => {
	const today = new Date();
	let years = today.getFullYear() - startDate.getFullYear();
	const m = today.getMonth() - startDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < startDate.getDate())) {
		years--;
	}
	return parseFloat(years.toFixed(2));
};

// Helper to format date for password generation
const formatDateForPassword = (date: Date): string => {
	const d = String(date.getUTCDate()).padStart(2, "0");
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const y = date.getUTCFullYear();
	return `${d}${m}${y}`;
};

export async function POST(req: Request) {
	try {
		const { toCreate, toUpdate, toDelete, fullData } =
			(await req.json()) as ExecutePayload;

		const dataMap = new Map(fullData.map((row) => [row.employeeId, row]));

		// --- OPTIMIZATION: Perform all expensive operations BEFORE the transaction ---
		const usersToCreate = await Promise.all(
			toCreate.map(async (emp) => {
				const rowData = dataMap.get(emp.employeeId);
				if (!rowData)
					throw new Error(`Data not found for new employee ${emp.employeeId}`);

				const dateOfBirth = new Date(rowData.birthDate);
				const dobForPassword = formatDateForPassword(dateOfBirth);
				const password = await hash(`${emp.employeeId}${dobForPassword}`, 10);

				return {
					employeeId: emp.employeeId,
					password: password,
					role: UserRole.EMPLOYEE,
					email: null,
				};
			})
		);

		const employeesToCreate = toCreate.map((emp) => {
			const rowData = dataMap.get(emp.employeeId);
			if (!rowData)
				throw new Error(`Data not found for new employee ${emp.employeeId}`);

			const dateOfBirth = new Date(rowData.birthDate);
			const hireDate = new Date(rowData.hireDate);

			return {
				employeeId: emp.employeeId,
				name: rowData["Employee Name"],
				dateOfBirth: dateOfBirth,
				hireDate: hireDate,
				// FIX: Cast the string to the Gender enum type
				gender: (rowData["Gender"] === "Male" ? "MALE" : "FEMALE") as Gender,
				personnelAreaId: rowData.branchId,
				positionId: rowData.positionId,
				departmentId: rowData.departmentId,
				levelId: rowData.levelId,
				age: calculateYearsDifference(dateOfBirth),
				lengthOfService: calculateYearsDifference(hireDate),
				educationDegree: rowData["Pend"] as EducationDegree,
				schoolName: rowData["Nama Sekolah/Univ"],
				majorName: rowData["Jurusan"],
				formFilledStatus: 0,
				questionnaireStatus: 0,
				createdAt: new Date(),
			};
		});

		// --- Database Transaction with increased timeout ---
		await prisma.$transaction(
			async (tx) => {
				// 1. Deletions
				if (toDelete.length > 0) {
					const idsToDelete = toDelete.map((e) => e.employeeId);
					await tx.user.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});
					await tx.employee.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});
				}

				// 2. Updates (must be done in a loop, but this is generally fast)
				if (toUpdate.length > 0) {
					for (const emp of toUpdate) {
						const rowData = dataMap.get(emp.employeeId);
						if (rowData) {
							const dateOfBirth = new Date(rowData.birthDate);
							const hireDate = new Date(rowData.hireDate);
							await tx.employee.update({
								where: { employeeId: emp.employeeId },
								data: {
									name: rowData["Employee Name"],
									dateOfBirth,
									hireDate,
									gender: (rowData["Gender"] === "Male"
										? "MALE"
										: "FEMALE") as Gender,
									personnelAreaId: rowData.branchId,
									positionId: rowData.positionId,
									departmentId: rowData.departmentId,
									levelId: rowData.levelId,
									age: calculateYearsDifference(dateOfBirth),
									lengthOfService: calculateYearsDifference(hireDate),
									educationDegree: rowData["Pend"] as EducationDegree,
									schoolName: rowData["Nama Sekolah/Univ"],
									majorName: rowData["Jurusan"],
									lastUpdatedAt: new Date(),
								},
							});
						}
					}
				}

				// 3. Creations (using efficient batch operations)
				if (usersToCreate.length > 0) {
					await tx.user.createMany({ data: usersToCreate });
					await tx.employee.createMany({ data: employeesToCreate });
				}
			},
			{
				timeout: 30000, // Increase timeout to 30 seconds for safety
			}
		);

		return NextResponse.json({
			message: "Synchronization completed successfully.",
		});
	} catch (error) {
		console.error("Sync execution failed:", error);
		return NextResponse.json(
			{ message: "An unexpected error occurred during synchronization." },
			{ status: 500 }
		);
	}
}
