// prisma/seed-test-users.ts

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function generatePassword(
	employeeId: string,
	dob: string
): Promise<string> {
	const plainTextPassword = `${employeeId}${dob}`;
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(plainTextPassword, salt);
}

function getDate(dateString: string): Date {
	const day = parseInt(dateString.substring(0, 2), 10);
	const month = parseInt(dateString.substring(2, 4), 10) - 1; // Bulan di JS dimulai dari 0
	const year = parseInt(dateString.substring(4, 8), 10);
	return new Date(year, month, day);
}

function calculateYearsDifference(startDate: Date): number {
	const today = new Date();
	let years = today.getFullYear() - startDate.getFullYear();
	const monthDifference = today.getMonth() - startDate.getMonth();
	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < startDate.getDate())
	) {
		years--;
	}
	const fraction = ((monthDifference + 12) % 12) / 12;
	return years + fraction;
}

async function main() {
	console.log("Memulai seeding test users...");

	// 1. Admin User
	const adminEmployeeId = "ADM001";
	const adminDob = "01011990";
	const adminPassword = await generatePassword(adminEmployeeId, adminDob);

	await prisma.user.upsert({
		where: { employeeId: adminEmployeeId },
		update: {},
		create: {
			employeeId: adminEmployeeId,
			password: adminPassword,
			role: "admin",
			branchId: "N001",
			departmentId: "ADM-HR",
			name: "Admin User",
			email: "admin@example.com",
		},
	});
	console.log(`Seeded Admin user: ${adminEmployeeId}`);

	// 2. HR User (Head Office)
	const hrHoEmployeeId = "HRH001";
	const hrHoDob = "05051992";
	const hrHoHireDate = "05052018";
	const hrHoPassword = await generatePassword(hrHoEmployeeId, hrHoDob);
	const hrHoDateOfBirth = getDate(hrHoDob);
	const hrHoHireDateObj = getDate(hrHoHireDate);

	await prisma.user.upsert({
		where: { employeeId: hrHoEmployeeId },
		update: {},
		create: {
			employeeId: hrHoEmployeeId,
			password: hrHoPassword,
			role: "hr",
			branchId: "N001",
			departmentId: "ADM-HR",
			name: "HR Head Office",
			email: "hrho@example.com",
		},
	});
	await prisma.employee.upsert({
		where: { employeeId: hrHoEmployeeId },
		update: {},
		create: {
			employeeId: hrHoEmployeeId,
			name: "HR Head Office",
			dateOfBirth: hrHoDateOfBirth,
			hireDate: hrHoHireDateObj,
			gender: "L",
			personnelAreaId: "N001",
			positionId: 8,
			departmentId: "ADM-HR",
			levelId: "staff",
			age: calculateYearsDifference(hrHoDateOfBirth),
			lengthOfService: calculateYearsDifference(hrHoHireDateObj),
			educationDegree: "S1",
			schoolName: "Universitas Contoh A",
			majorName: "Manajemen SDM",
			bestEmployeeScore: 90,
			formFilledStatus: 1,
			questionnaireStatus: 1,
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	console.log(`Seeded HR Head Office user: ${hrHoEmployeeId}`);

	// 3. HR User (Branch Office - N002 DKI)
	const hrBranchEmployeeId = "HRB001";
	const hrBranchDob = "10101993";
	const hrBranchHireDate = "10102019";
	const hrBranchPassword = await generatePassword(
		hrBranchEmployeeId,
		hrBranchDob
	);
	const hrBranchDateOfBirth = getDate(hrBranchDob);
	const hrBranchHireDateObj = getDate(hrBranchHireDate);

	await prisma.user.upsert({
		where: { employeeId: hrBranchEmployeeId },
		update: {},
		create: {
			employeeId: hrBranchEmployeeId,
			password: hrBranchPassword,
			role: "hr",
			branchId: "N002",
			departmentId: "ADM-HR",
			name: "HR Branch DKI",
			email: "hrb@example.com",
		},
	});
	await prisma.employee.upsert({
		where: { employeeId: hrBranchEmployeeId },
		update: {},
		create: {
			employeeId: hrBranchEmployeeId,
			name: "HR Branch DKI",
			dateOfBirth: hrBranchDateOfBirth,
			hireDate: hrBranchHireDateObj,
			gender: "P",
			personnelAreaId: "N002",
			positionId: 24,
			departmentId: "ADM-HR",
			levelId: "staff",
			age: calculateYearsDifference(hrBranchDateOfBirth),
			lengthOfService: calculateYearsDifference(hrBranchHireDateObj),
			educationDegree: "S1",
			schoolName: "Universitas Contoh B",
			majorName: "Administrasi",
			bestEmployeeScore: 88,
			formFilledStatus: 1,
			questionnaireStatus: 1,
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	console.log(`Seeded HR Branch DKI user: ${hrBranchEmployeeId}`);

	// 4. HD User (Head Office - ADM-FA department)
	const hdHoEmployeeId = "HDH001";
	const hdHoDob = "15031991";
	const hdHoHireDate = "15032016";
	const hdHoPassword = await generatePassword(hdHoEmployeeId, hdHoDob);
	const hdHoDateOfBirth = getDate(hdHoDob);
	const hdHoHireDateObj = getDate(hdHoHireDate);

	await prisma.user.upsert({
		where: { employeeId: hdHoEmployeeId },
		update: {},
		create: {
			employeeId: hdHoEmployeeId,
			password: hdHoPassword,
			role: "hd",
			branchId: "N001",
			departmentId: "ADM-FA",
			name: "HD Head Office",
			email: "hdho@example.com",
		},
	});
	await prisma.employee.upsert({
		where: { employeeId: hdHoEmployeeId },
		update: {},
		create: {
			employeeId: hdHoEmployeeId,
			name: "HD Head Office",
			dateOfBirth: hdHoDateOfBirth,
			hireDate: hdHoHireDateObj,
			gender: "L",
			personnelAreaId: "N001",
			positionId: 10,
			departmentId: "ADM-FA",
			levelId: "staff",
			age: calculateYearsDifference(hdHoDateOfBirth),
			lengthOfService: calculateYearsDifference(hdHoHireDateObj),
			educationDegree: "S2",
			schoolName: "Universitas Contoh C",
			majorName: "Keuangan",
			bestEmployeeScore: 92,
			formFilledStatus: 1,
			questionnaireStatus: 1,
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	console.log(`Seeded HD Head Office user: ${hdHoEmployeeId}`);

	// 5. Employee User
	const employeeId = "EMP001";
	const employeeDob = "20071995";
	const employeeHireDate = "20072020";
	const employeePassword = await generatePassword(employeeId, employeeDob);
	const employeeDateOfBirth = getDate(employeeDob);
	const employeeHireDateObj = getDate(employeeHireDate);

	await prisma.user.upsert({
		where: { employeeId: employeeId },
		update: {},
		create: {
			employeeId: employeeId,
			password: employeePassword,
			role: "employee",
			branchId: "N002",
			departmentId: "MFG-PROD",
			name: "Employee Test",
			email: "employee@example.com",
		},
	});
	await prisma.employee.upsert({
		where: { employeeId: employeeId },
		update: {},
		create: {
			employeeId: employeeId,
			name: "Employee Test",
			dateOfBirth: employeeDateOfBirth,
			hireDate: employeeHireDateObj,
			gender: "L",
			personnelAreaId: "N002",
			positionId: 126,
			departmentId: "MFG-PROD",
			levelId: "spv",
			age: calculateYearsDifference(employeeDateOfBirth),
			lengthOfService: calculateYearsDifference(employeeHireDateObj),
			educationDegree: "D3",
			schoolName: "Politeknik Manufaktur",
			majorName: "Teknik Produksi",
			bestEmployeeScore: 85,
			formFilledStatus: 0,
			questionnaireStatus: 0,
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	await prisma.careerHistory.upsert({
		where: { id: `${employeeId}-initial-career` },
		update: {},
		create: {
			id: `${employeeId}-initial-career`,
			employeeId: employeeId,
			positionId: 126,
			levelId: "spv",
			personnelAreaId: "N002",
			departmentId: "MFG-PROD",
			startDate: employeeHireDateObj,
			status: 1,
			endDate: null,
		},
	});
	console.log(`Seeded Employee user: ${employeeId}`);

	console.log("Seeding test users selesai!");
}

main()
	.catch((e) => {
		console.error("Error selama seeding test users:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
