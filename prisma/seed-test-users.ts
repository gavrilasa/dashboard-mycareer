// prisma/seed-test-users.ts

import { PrismaClient, Gender, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Generates a hashed password from an employee's NIK and Date of Birth string.
 * @param nik - The employee's unique identifier (username).
 * @param dob - The date of birth in DDMMYYYY format.
 * @returns A promise that resolves to the hashed password.
 */
async function generatePassword(nik: string, dob: string): Promise<string> {
	const plainTextPassword = `${nik}${dob}`;
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(plainTextPassword, salt);
}

/**
 * Parses a DDMMYYYY string into a Date object.
 * @param dateString - The date in DDMMYYYY format.
 * @returns A Date object.
 */
function parseDate(dateString: string): Date {
	const day = parseInt(dateString.substring(0, 2), 10);
	const month = parseInt(dateString.substring(2, 4), 10) - 1; // JavaScript months are 0-indexed
	const year = parseInt(dateString.substring(4, 8), 10);
	return new Date(Date.UTC(year, month, day));
}

async function main() {
	console.log(
		"🚀 Memulai proses seeding akun mockup dengan NIK dan password..."
	);

	const usersToSeed = [
		// 1. Admin / HR Head Office (Nasional)
		{
			nik: "ADMIN01",
			name: "Admin Head Office",
			dob: "01011990",
			gender: Gender.MALE,
			role: Role.ADMIN,
			branchId: "N001", // Head Office
			departmentId: "ADM-HR",
			positionId: "72", // HRIS & Comben Spv
		},
		// 2. HR Branch (Cabang DKI)
		{
			nik: "HR001DKI",
			name: "HR Cabang DKI",
			dob: "02021992",
			gender: Gender.FEMALE,
			role: Role.HR_BRANCH,
			branchId: "N002", // Cabang DKI
			departmentId: "ADM-HR",
			positionId: "24", // Branch HR Officer
		},
		// 3. Head of Department (Cabang Cibitung)
		{
			nik: "HD001CBT",
			name: "HD Produksi Cibitung",
			dob: "03031988",
			gender: Gender.MALE,
			role: Role.HD,
			branchId: "N003", // Cabang Cibitung
			departmentId: "MFG-PROD",
			positionId: "129", // Production Mgr, Act
		},
		// 4. Employee (Cabang Tangerang)
		{
			nik: "EMP001TGR",
			name: "Karyawan Tangerang",
			dob: "04041995",
			gender: Gender.FEMALE,
			role: Role.EMPLOYEE,
			branchId: "N004", // Cabang Tangerang
			departmentId: "RND-QCA",
			positionId: "143", // QC Process Spv
		},
	];

	for (const userData of usersToSeed) {
		// Generate the hashed password from NIK and DOB
		const hashedPassword = await generatePassword(userData.nik, userData.dob);

		// Create the User record first, which holds the login credentials
		const user = await prisma.user.upsert({
			where: { nik: userData.nik }, // Find user by NIK
			update: {
				password: hashedPassword,
				role: userData.role,
				name: userData.name,
			},
			create: {
				nik: userData.nik, // Create user with NIK as the login identifier
				name: userData.name,
				password: hashedPassword,
				role: userData.role,
			},
		});

		// Then, create the associated Employee profile and link it to the User
		await prisma.employee.upsert({
			where: { nik: userData.nik },
			update: {}, // Don't update the employee profile if it already exists
			create: {
				id: userData.nik, // Use NIK as the primary key for the Employee record
				nik: userData.nik,
				dateOfBirth: parseDate(userData.dob),
				gender: userData.gender,
				// Establish the one-to-one relationship to the User record
				userId: user.id,
				// Connect to other master data
				branchId: userData.branchId,
				departmentId: userData.departmentId,
				positionId: userData.positionId,
			},
		});
		console.log(
			`✅ Berhasil seeding pengguna ${userData.role}: ${userData.nik}`
		);
	}

	console.log("🎉 Seeding akun mockup dengan NIK dan password telah selesai!");
}

main()
	.catch((e) => {
		console.error("❌ Terjadi error selama proses seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		// Ensure Prisma Client is disconnected
		await prisma.$disconnect();
	});
