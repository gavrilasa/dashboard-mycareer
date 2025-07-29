import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { read, utils } from "xlsx";
import { EducationDegree, Gender } from "@prisma/client";

// --- (Type definitions and parseDate function remain the same) ---
type ExcelRow = {
	"Personnel Area": string;
	"Pers. Number": string;
	"Employee Name": string;
	Position: string;
	"Personnel Subarea": string;
	Lv: string;
	TMK: string | number | Date;
	Birthdate: string | number | Date;
	Gender: "Male" | "Female";
	Pend: string;
	"Nama Sekolah/Univ": string;
	Jurusan: string;
};

export type ValidatedRow = ExcelRow & {
	employeeId: string;
	branchId: string;
	departmentId: string;
	positionId: number;
	levelId: string;
	birthDate: Date;
	hireDate: Date;
};

function parseDate(dateValue: string | number | Date): Date | null {
	if (dateValue instanceof Date) {
		if (isNaN(dateValue.getTime())) return null;
		const year = dateValue.getUTCFullYear();
		const month = dateValue.getUTCMonth();
		const day = dateValue.getUTCDate();
		return new Date(Date.UTC(year, month, day));
	}
	if (typeof dateValue === "string") {
		const parts = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
		if (!parts) return null;
		const day = parseInt(parts[1], 10);
		const month = parseInt(parts[2], 10) - 1;
		let year = parseInt(parts[3], 10);
		if (year < 100) {
			year = year <= 29 ? 2000 + year : 1900 + year;
		}
		if (month < 0 || month > 11 || day < 1 || day > 31) return null;
		const date = new Date(Date.UTC(year, month, day));
		if (isNaN(date.getTime())) return null;
		return date;
	}
	if (typeof dateValue === "number") {
		let adjustedValue = dateValue;
		if (dateValue < 61) {
			adjustedValue = dateValue - 1;
		}
		const utcMilliseconds = (adjustedValue - 25569) * 86400000;
		const tempDate = new Date(utcMilliseconds);
		const year = tempDate.getUTCFullYear();
		const month = tempDate.getUTCMonth();
		const day = tempDate.getUTCDate();
		const date = new Date(Date.UTC(year, month, day));
		if (isNaN(date.getTime())) return null;
		return date;
	}
	return null;
}

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ message: "No file uploaded." },
				{ status: 400 }
			);
		}

		const buffer = await file.arrayBuffer();
		const workbook = read(buffer, {
			type: "buffer",
			cellDates: false,
			raw: true,
		});
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const data: ExcelRow[] = utils.sheet_to_json(sheet);

		if (data.length === 0) {
			return NextResponse.json(
				{ message: "The uploaded file is empty." },
				{ status: 400 }
			);
		}

		const [dbEmployees, dbBranches, dbDepartments, dbPositions, dbLevels] =
			await prisma.$transaction([
				prisma.employee.findMany({
					include: {
						branch: true,
						department: true,
						position: true,
						level: true,
					},
				}),
				prisma.branch.findMany(),
				prisma.department.findMany(),
				prisma.position.findMany(),
				prisma.level.findMany(),
			]);

		const dbEmployeeMap = new Map(dbEmployees.map((e) => [e.employeeId, e]));
		const branchMap = new Map(
			dbBranches.map((b) => [b.name.toLowerCase(), b.id])
		);
		const departmentMap = new Map(
			dbDepartments.map((d) => [d.name.toLowerCase(), d.id])
		);
		const positionMap = new Map(
			dbPositions.map((p) => [p.name.toLowerCase(), p.id])
		);
		const levelMap = new Map(dbLevels.map((l) => [l.id.toLowerCase(), l.id]));

		const errors: { row: number; employeeId: string; error: string }[] = [];
		const validRows: ValidatedRow[] = [];

		for (let i = 0; i < data.length; i++) {
			const row = data[i];
			const rowNum = i + 2;
			const employeeId = row["Pers. Number"]?.toString();
			const currentErrors: string[] = [];

			if (!employeeId) {
				if (Object.keys(row).length === 0) continue;
				errors.push({
					row: rowNum,
					employeeId: "N/A",
					error: "Column 'Pers. Number' is missing or empty.",
				});
				continue;
			}

			const branchId = branchMap.get(row["Personnel Area"]?.toLowerCase());
			if (!branchId)
				currentErrors.push(`Branch '${row["Personnel Area"]}' not found.`);

			const departmentId = departmentMap.get(
				row["Personnel Subarea"]?.toLowerCase()
			);
			if (!departmentId)
				currentErrors.push(
					`Department '${row["Personnel Subarea"]}' not found.`
				);

			const positionId = positionMap.get(row["Position"]?.toLowerCase());
			if (!positionId)
				currentErrors.push(`Position '${row["Position"]}' not found.`);

			const levelIdInput = row["Lv"]?.toLowerCase();
			const levelId = levelMap.get(levelIdInput);
			if (!levelId) currentErrors.push(`Level ID '${row["Lv"]}' not found.`);

			const birthDate = parseDate(row["Birthdate"]);
			if (!birthDate)
				currentErrors.push(
					`Invalid Birthdate format for '${row["Birthdate"]}'.`
				);

			const hireDate = parseDate(row["TMK"]);
			if (!hireDate)
				currentErrors.push(
					`Invalid TMK (hire date) format for '${row["TMK"]}'.`
				);

			if (
				row["Pend"] &&
				!Object.values(EducationDegree).includes(row["Pend"] as EducationDegree)
			) {
				currentErrors.push(`Invalid education degree '${row["Pend"]}'.`);
			}

			if (currentErrors.length > 0) {
				errors.push({
					row: rowNum,
					employeeId,
					error: currentErrors.join("; "),
				});
			} else {
				validRows.push({
					...row,
					employeeId,
					branchId: branchId!,
					departmentId: departmentId!,
					positionId: positionId!,
					levelId: levelId!,
					birthDate: birthDate!,
					hireDate: hireDate!,
				});
			}
		}

		if (errors.length > 0) {
			return NextResponse.json({ errors }, { status: 400 });
		}

		const fileEmployeeIds = new Set(validRows.map((row) => row.employeeId));

		const toCreate = validRows
			.filter((row) => !dbEmployeeMap.has(row.employeeId))
			.map((r) => ({ employeeId: r.employeeId, name: r["Employee Name"] }));

		// PERBAIKAN: Mengganti 'any' dengan tipe yang lebih spesifik
		type Change = {
			field: string;
			from: string | Gender | EducationDegree | null | undefined;
			to: string | Gender | EducationDegree | null | undefined;
		};
		const toUpdate: { employeeId: string; name: string; changes: Change[] }[] =
			[];

		validRows.forEach((row) => {
			const dbEmployee = dbEmployeeMap.get(row.employeeId);
			if (!dbEmployee) return;

			const changes: Change[] = [];

			if (dbEmployee.name !== row["Employee Name"])
				changes.push({
					field: "Name",
					from: dbEmployee.name,
					to: row["Employee Name"],
				});
			if (dbEmployee.personnelAreaId !== row.branchId)
				changes.push({
					field: "Branch",
					from: dbEmployee.branch?.name,
					to: row["Personnel Area"],
				});
			if (dbEmployee.departmentId !== row.departmentId)
				changes.push({
					field: "Department",
					from: dbEmployee.department?.name,
					to: row["Personnel Subarea"],
				});
			if (dbEmployee.positionId !== row.positionId)
				changes.push({
					field: "Position",
					from: dbEmployee.position?.name,
					to: row["Position"],
				});
			if (dbEmployee.levelId !== row.levelId)
				changes.push({
					field: "Level",
					from: dbEmployee.levelId,
					to: row.levelId,
				});
			if (dbEmployee.dateOfBirth.getTime() !== row.birthDate.getTime())
				changes.push({
					field: "Birthdate",
					from: dbEmployee.dateOfBirth.toLocaleDateString("en-CA"),
					to: row.birthDate.toLocaleDateString("en-CA"),
				});
			if (dbEmployee.hireDate.getTime() !== row.hireDate.getTime())
				changes.push({
					field: "Hire Date",
					from: dbEmployee.hireDate.toLocaleDateString("en-CA"),
					to: row.hireDate.toLocaleDateString("en-CA"),
				});

			const fileGender = row.Gender === "Male" ? Gender.MALE : Gender.FEMALE;
			if (dbEmployee.gender !== fileGender)
				changes.push({
					field: "Gender",
					from: dbEmployee.gender,
					to: fileGender,
				});

			if (dbEmployee.educationDegree !== row.Pend)
				changes.push({
					field: "Education",
					from: dbEmployee.educationDegree,
					to: row.Pend,
				});
			if (dbEmployee.schoolName !== row["Nama Sekolah/Univ"])
				changes.push({
					field: "School",
					from: dbEmployee.schoolName,
					to: row["Nama Sekolah/Univ"],
				});
			if (dbEmployee.majorName !== row.Jurusan)
				changes.push({
					field: "Major",
					from: dbEmployee.majorName,
					to: row.Jurusan,
				});

			if (changes.length > 0) {
				toUpdate.push({
					employeeId: row.employeeId,
					name: row["Employee Name"],
					changes,
				});
			}
		});

		const toDelete = Array.from(dbEmployeeMap.values())
			.filter((emp) => !fileEmployeeIds.has(emp.employeeId))
			.map((emp) => ({ employeeId: emp.employeeId, name: emp.name }));

		return NextResponse.json({
			analysis: { toCreate, toUpdate, toDelete, fullData: validRows },
		});
	} catch (error) {
		console.error("Sync analysis failed:", error);
		return NextResponse.json(
			{ message: "An unexpected error occurred during file analysis." },
			{ status: 500 }
		);
	}
}
