import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role, EducationDegree, Gender } from "@prisma/client";
import { hash } from "bcryptjs";
import { ValidatedRow } from "../analyze/route";
import { withAuthorization } from "@/lib/auth-hof";
import pLimit from "p-limit";

// --- Type Definitions and Helpers (Unchanged) ---
interface ExecutePayload {
	toCreate: { employeeId: string; name: string }[];
	toUpdate: { employeeId: string; name: string }[];
	toDelete: { employeeId: string; name: string }[];
	fullData: ValidatedRow[];
}

interface SyncError {
	row: number;
	employeeId: string;
	error: string;
}

const formatDateForPassword = (date: Date): string => {
	const d = String(date.getUTCDate()).padStart(2, "0");
	const m = String(date.getUTCMonth() + 1).padStart(2, "0");
	const y = date.getUTCFullYear();
	return `${d}${m}${y}`;
};

export const POST = withAuthorization(
	{ resource: "employee", action: "upload" },
	async (req: NextRequest) => {
		try {
			const { toCreate, toUpdate, toDelete, fullData } =
				(await req.json()) as ExecutePayload;

			const dataMap = new Map(
				fullData.map((row, index) => [
					row.employeeId,
					{ ...row, rowIndex: index + 2 },
				])
			);
			const mappingErrors: SyncError[] = [];

			// --- STAGE 1: DATA PREPARATION AND ERROR GATHERING ---

			const limit = pLimit(10);

			const usersToCreatePromises = toCreate.map((emp) => {
				const rowData = dataMap.get(emp.employeeId);
				if (!rowData) {
					mappingErrors.push({
						row: -1,
						employeeId: emp.employeeId,
						error: "Internal data inconsistency, mapping data not found.",
					});
					return null;
				}

				return limit(async () => {
					const dateOfBirth = new Date(rowData.birthDate);
					const dobForPassword = formatDateForPassword(dateOfBirth);
					const password = await hash(`${emp.employeeId}${dobForPassword}`, 10);
					return {
						employeeId: emp.employeeId,
						password: password,
						role: Role.EMPLOYEE,
						branchId: rowData.branchId,
						departmentId: rowData.departmentId,
					};
				});
			});

			// FIX: Filter out null values to ensure the array is correctly typed for Prisma.
			const usersToCreate = (await Promise.all(usersToCreatePromises)).filter(
				(user): user is NonNullable<typeof user> => user !== null
			);

			const employeesToCreate = toCreate
				.map((emp) => {
					const rowData = dataMap.get(emp.employeeId);
					if (!rowData) {
						if (!mappingErrors.some((e) => e.employeeId === emp.employeeId)) {
							mappingErrors.push({
								row: -1,
								employeeId: emp.employeeId,
								error: "Internal data inconsistency, mapping data not found.",
							});
						}
						return null;
					}
					return {
						employeeId: emp.employeeId,
						fullName: rowData["Employee Name"],
						dateOfBirth: new Date(rowData.birthDate),
						hireDate: new Date(rowData.hireDate),
						gender: rowData["Gender"] === "Male" ? Gender.MALE : Gender.FEMALE,
						branchId: rowData.branchId,
						positionId: rowData.positionId,
						departmentId: rowData.departmentId,
						levelId: rowData.levelId,
						lastEducationDegree: rowData["Pend"] as EducationDegree,
						lastEducationSchool: rowData["Nama Sekolah/Univ"],
						lastEducationMajor: rowData["Jurusan"],
					};
					// FIX: Filter out null values here as well.
				})
				.filter((emp): emp is NonNullable<typeof emp> => emp !== null);

			if (mappingErrors.length > 0) {
				return NextResponse.json({ errors: mappingErrors }, { status: 400 });
			}

			// --- STAGE 2: DATABASE TRANSACTION ---
			await prisma.$transaction(
				async (tx) => {
					if (toDelete.length > 0) {
						const idsToDelete = toDelete.map((e) => e.employeeId);
						await tx.employee.deleteMany({
							where: { employeeId: { in: idsToDelete } },
						});
						await tx.user.deleteMany({
							where: { employeeId: { in: idsToDelete } },
						});
					}

					if (toUpdate.length > 0) {
						await Promise.all(
							toUpdate.map((emp) => {
								const rowData = dataMap.get(emp.employeeId);
								if (!rowData) return Promise.resolve();
								return tx.employee.update({
									where: { employeeId: emp.employeeId },
									data: {
										fullName: rowData["Employee Name"],
										dateOfBirth: new Date(rowData.birthDate),
										hireDate: new Date(rowData.hireDate),
										gender:
											rowData["Gender"] === "Male"
												? Gender.MALE
												: Gender.FEMALE,
										branchId: rowData.branchId,
										positionId: rowData.positionId,
										departmentId: rowData.departmentId,
										levelId: rowData.levelId,
										lastEducationDegree: rowData["Pend"] as EducationDegree,
										lastEducationSchool: rowData["Nama Sekolah/Univ"],
										lastEducationMajor: rowData["Jurusan"],
									},
								});
							})
						);
					}

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
				{ timeout: 180000 }
			);

			return NextResponse.json({
				message: "Synchronization completed successfully.",
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("constraint")) {
				return NextResponse.json(
					{
						message:
							"A data relation constraint was violated. Please check the validity of Branch, Department, Position, and Level IDs in your file.",
					},
					{ status: 400 }
				);
			}
			return NextResponse.json(
				{
					message:
						error instanceof Error
							? error.message
							: "An unexpected error occurred.",
				},
				{ status: 500 }
			);
		}
	}
);
