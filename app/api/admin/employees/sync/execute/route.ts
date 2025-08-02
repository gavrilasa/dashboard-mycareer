import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Role, EducationDegree, Gender } from "@prisma/client";
import { hash } from "bcryptjs";
import { ValidatedRow } from "../analyze/route";

interface ExecutePayload {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: { employeeId: string; name: string }[];
	toDelete: { employeeId: string; name: string }[];
	fullData: ValidatedRow[];
}

// Helper to format date for password generation (e.g., 01011990)
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

		// --- Prepare data for creation before the transaction ---
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
					role: Role.EMPLOYEE,
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
				fullName: rowData["Employee Name"],
				dateOfBirth: dateOfBirth,
				hireDate: hireDate,
				gender: rowData["Gender"] === "Male" ? Gender.MALE : Gender.FEMALE,
				branchId: rowData.branchId,
				positionId: rowData.positionId,
				departmentId: rowData.departmentId,
				levelId: rowData.levelId,
				lastEducationDegree: rowData["Pend"] as EducationDegree,
				lastEducationSchool: rowData["Nama Sekolah/Univ"],
				lastEducationMajor: rowData["Jurusan"],
			};
		});

		// --- Database Transaction ---
		await prisma.$transaction(
			async (tx) => {
				// 1. Deletions
				if (toDelete.length > 0) {
					const idsToDelete = toDelete.map((e) => e.employeeId);

					// ## FIX: Correct deletion order ##
					// Delete the dependent record (Employee) first.
					await tx.employee.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});

					// Then delete the principal record (User).
					await tx.user.deleteMany({
						where: { employeeId: { in: idsToDelete } },
					});
				}

				// 2. Updates
				if (toUpdate.length > 0) {
					for (const emp of toUpdate) {
						const rowData = dataMap.get(emp.employeeId);
						if (rowData) {
							const dateOfBirth = new Date(rowData.birthDate);
							const hireDate = new Date(rowData.hireDate);

							await tx.employee.update({
								where: { employeeId: emp.employeeId },
								data: {
									fullName: rowData["Employee Name"],
									dateOfBirth,
									hireDate,
									gender:
										rowData["Gender"] === "Male" ? Gender.MALE : Gender.FEMALE,
									branchId: rowData.branchId,
									positionId: rowData.positionId,
									departmentId: rowData.departmentId,
									levelId: rowData.levelId,
									lastEducationDegree: rowData["Pend"] as EducationDegree,
									lastEducationSchool: rowData["Nama Sekolah/Univ"],
									lastEducationMajor: rowData["Jurusan"],
								},
							});
						}
					}
				}

				// 3. Creations
				if (usersToCreate.length > 0) {
					await tx.user.createMany({
						data: usersToCreate,
						skipDuplicates: true,
					});
					await tx.employee.createMany({
						data: employeesToCreate,
						skipDuplicates: true,
					});
				}
			},
			{
				timeout: 30000,
			}
		);

		return NextResponse.json({
			message: "Synchronization completed successfully.",
		});
	} catch (error) {
		console.error("Sync execution failed:", error);
		if (error instanceof Error) {
			return NextResponse.json({ message: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ message: "An unexpected error occurred during synchronization." },
			{ status: 500 }
		);
	}
}
