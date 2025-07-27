// prisma/seed-test-users.ts

import { prisma } from "@/app/lib/prisma";
import { generatePassword } from "@/app/lib/utils/password";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

// Asumsi: utilitas ini sudah ada dan dapat diimpor dari lokasi yang benar
// import { convertDate } from "@/utils/typeConvertion"; // Jika diperlukan untuk konversi dari format lain
// import * as dbAligner from "@/utils/dbAligner"; // Jika diperlukan untuk mapping ID dari nama

async function main() {
	console.log("Memulai seeding test users...");

	// Pastikan master data (branches, departments, levels, positions)
	// sudah di-seed terlebih dahulu menggunakan `npm run seed` (file `prisma/seed.ts` utama)

	// Helper untuk mendapatkan Date objek dari string DDMMYYYY
	const getDate = (dateString: string) =>
		dayjs(dateString, "DDMMYYYY").toDate();
	const calculateAge = (dob: Date) => dayjs().diff(dob, "year", true);
	const calculateLengthOfService = (hireDate: Date) =>
		dayjs().diff(hireDate, "year", true);

	// --- Data Pengguna Uji Coba ---

	// 1. Admin User (Role: admin)
	// Admin user biasanya tidak memiliki entri di tabel `Employee`
	const adminEmployeeId = "ADM001";
	const adminDob = "01011990"; // DDMMYYYY
	const adminPassword = generatePassword(adminEmployeeId, adminDob);

	await prisma.user.upsert({
		where: { employeeId: adminEmployeeId },
		update: {},
		create: {
			employeeId: adminEmployeeId,
			password: adminPassword,
			role: "admin",
			branchId: "N001", // Head Office
			departmentId: "ADM-HR", // Departemen contoh
			name: "Admin User",
			email: "admin@example.com",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
	console.log(
		`Seeded Admin user: ${adminEmployeeId} (Password: ${adminEmployeeId}${adminDob})`
	);

	// 2. HR User (Head Office) - Role: hr, Branch: N001 (Head Office)
	const hrHoEmployeeId = "HRH001";
	const hrHoDob = "05051992"; // DDMMYYYY
	const hrHoHireDate = "05052018"; // DDMMYYYY
	const hrHoPassword = generatePassword(hrHoEmployeeId, hrHoDob);
	const hrHoDateOfBirth = getDate(hrHoDob);
	const hrHoHireDateObj = getDate(hrHoHireDate);
	const hrHoPositionId = 8; // ID Posisi: Admin to BHRM (di ADM-HR)
	const hrHoLevelId = "staff";

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
			createdAt: new Date(),
			updatedAt: new Date(),
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
			positionId: hrHoPositionId,
			departmentId: "ADM-HR",
			levelId: hrHoLevelId,
			age: calculateAge(hrHoDateOfBirth),
			lengthOfService: calculateLengthOfService(hrHoHireDateObj),
			educationDegree: "S1",
			schoolName: "Universitas Contoh A",
			majorName: "Manajemen SDM",
			bestEmployeeScore: 90, // Contoh skor
			formFilledStatus: 1, // Sudah mengisi form
			questionnaireStatus: 1, // Sudah mengisi kuesioner
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	console.log(
		`Seeded HR Head Office user: ${hrHoEmployeeId} (Password: ${hrHoEmployeeId}${hrHoDob})`
	);

	// 3. HR User (Branch Office - N002 DKI) - Role: hr, Branch: N002 (DKI)
	const hrBranchEmployeeId = "HRB001";
	const hrBranchDob = "10101993"; // DDMMYYYY
	const hrBranchHireDate = "10102019"; // DDMMYYYY
	const hrBranchPassword = generatePassword(hrBranchEmployeeId, hrBranchDob);
	const hrBranchDateOfBirth = getDate(hrBranchDob);
	const hrBranchHireDateObj = getDate(hrBranchHireDate);
	const hrBranchPositionId = 24; // ID Posisi: Branch HR Officer (di ADM-HR)
	const hrBranchLevelId = "staff";

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
			createdAt: new Date(),
			updatedAt: new Date(),
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
			positionId: hrBranchPositionId,
			departmentId: "ADM-HR",
			levelId: hrBranchLevelId,
			age: calculateAge(hrBranchDateOfBirth),
			lengthOfService: calculateLengthOfService(hrBranchHireDateObj),
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
	console.log(
		`Seeded HR Branch DKI user: ${hrBranchEmployeeId} (Password: ${hrBranchEmployeeId}${hrBranchDob})`
	);

	// 4. HD User (Head Office - ADM-FA department) - Role: hd, Branch: N001, Dept: ADM-FA
	const hdHoEmployeeId = "HDH001";
	const hdHoDob = "15031991"; // DDMMYYYY
	const hdHoHireDate = "15032016"; // DDMMYYYY
	const hdHoPassword = generatePassword(hdHoEmployeeId, hdHoDob);
	const hdHoDateOfBirth = getDate(hdHoDob);
	const hdHoHireDateObj = getDate(hdHoHireDate);
	const hdHoPositionId = 10; // ID Posisi: Admin to Fin & Acct Mgr (di ADM-FA)
	const hdHoLevelId = "staff";

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
			createdAt: new Date(),
			updatedAt: new Date(),
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
			positionId: hdHoPositionId,
			departmentId: "ADM-FA",
			levelId: hdHoLevelId,
			age: calculateAge(hdHoDateOfBirth),
			lengthOfService: calculateLengthOfService(hdHoHireDateObj),
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
	console.log(
		`Seeded HD Head Office user: ${hdHoEmployeeId} (Password: ${hdHoEmployeeId}${hdHoDob})`
	);

	// 5. Employee User (Cabang N002 DKI, Departemen MFG-PROD, Posisi Prod Shift Spv)
	const employeeId = "EMP001";
	const employeeDob = "20071995"; // DDMMYYYY
	const employeeHireDate = "20072020"; // DDMMYYYY
	const employeePassword = generatePassword(employeeId, employeeDob);
	const employeeDateOfBirth = getDate(employeeDob);
	const employeeHireDateObj = getDate(employeeHireDate);
	const employeePositionId = 126; // Prod Shift Spv
	const employeeLevelId = "spv";

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
			createdAt: new Date(),
			updatedAt: new Date(),
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
			positionId: employeePositionId,
			departmentId: "MFG-PROD",
			levelId: employeeLevelId,
			age: calculateAge(employeeDateOfBirth),
			lengthOfService: calculateLengthOfService(employeeHireDateObj),
			educationDegree: "D3",
			schoolName: "Politeknik Manufaktur",
			majorName: "Teknik Produksi",
			bestEmployeeScore: 85, // Contoh skor
			formFilledStatus: 0, // Belum mengisi form (untuk pengujian)
			questionnaireStatus: 0, // Belum mengisi kuesioner (untuk pengujian)
			createdAt: new Date(),
			lastUpdatedAt: new Date(),
		},
	});
	await prisma.careerHistory.upsert({
		where: { id: `${employeeId}-initial-career` }, // ID kustom
		update: {},
		create: {
			id: `${employeeId}-initial-career`,
			employeeId: employeeId,
			positionId: employeePositionId,
			levelId: employeeLevelId,
			personnelAreaId: "N002",
			departmentId: "MFG-PROD",
			startDate: employeeHireDateObj,
			status: 1, // Posisi aktif
			endDate: null, // Masih aktif
		},
	});
	console.log(
		`Seeded Employee user: ${employeeId} (Password: ${employeeId}${employeeDob})`
	);

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
