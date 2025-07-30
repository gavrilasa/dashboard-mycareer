// prisma/seed-test-users.ts

import { PrismaClient, Gender, Role, EducationDegree } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function generatePassword(
	employeeId: string,
	dob: string
): Promise<string> {
	const plainTextPassword = `${employeeId}${dob}`;
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(plainTextPassword, salt);
}

function parseDate(dateString: string): Date {
	const day = parseInt(dateString.substring(0, 2), 10);
	const month = parseInt(dateString.substring(2, 4), 10) - 1;
	const year = parseInt(dateString.substring(4, 8), 10);
	return new Date(Date.UTC(year, month, day));
}

async function getLevelId(
	levelName: "STAFF" | "SUPERVISOR" | "MANAGER"
): Promise<string> {
	const level = await prisma.level.findUnique({ where: { name: levelName } });
	if (!level) throw new Error(`Level ${levelName} not found.`);
	return level.id;
}

async function main() {
	console.log("🚀 Memulai proses seeding akun pengguna mockup...");

	const supervisorLevelId = await getLevelId("SUPERVISOR");
	const managerLevelId = await getLevelId("MANAGER");
	const staffLevelId = await getLevelId("STAFF");

	const usersToSeed = [
		{
			employeeId: "ADMIN01",
			fullName: "Admin Head Office",
			dob: "01011990",
			gender: Gender.MALE,
			role: Role.ADMIN,
			branchId: "N001",
			departmentId: "N001-ADM-HR",
			positionId: "N001-72",
			levelId: supervisorLevelId,
			lastEducationDegree: EducationDegree.S1,
			lastEducationSchool: "Universitas Indonesia",
			lastEducationMajor: "Manajemen",
		},
		{
			employeeId: "HR001DKI",
			fullName: "HR Cabang DKI",
			dob: "02021992",
			gender: Gender.FEMALE,
			role: Role.HR_BRANCH,
			branchId: "N002",
			departmentId: "N002-ADM-HR",
			positionId: "N002-24",
			levelId: staffLevelId,
			lastEducationDegree: EducationDegree.S1,
			lastEducationSchool: "Universitas Gadjah Mada",
			lastEducationMajor: "Psikologi",
		},
		{
			employeeId: "HD001CBT",
			fullName: "HD Produksi Cibitung",
			dob: "03031988",
			gender: Gender.MALE,
			role: Role.HD,
			branchId: "N003",
			departmentId: "N003-MFG-PROD",
			positionId: "N003-129",
			levelId: managerLevelId,
			lastEducationDegree: EducationDegree.S3,
			lastEducationSchool: "Institut Teknologi Bandung",
			lastEducationMajor: "Teknik Industri",
		},
		{
			employeeId: "EMP001TGR",
			fullName: "Karyawan Tangerang",
			dob: "04041995",
			gender: Gender.FEMALE,
			role: Role.EMPLOYEE,
			branchId: "N004",
			departmentId: "N004-RND-QCA",
			positionId: "N004-143",
			levelId: staffLevelId,
			lastEducationDegree: EducationDegree.D3,
			lastEducationSchool: "Politeknik Negeri Jakarta",
			lastEducationMajor: "Analis Kimia",
		},
	];

	// Hapus semua user dan employee lama yang mungkin ada di data seed
	console.log("🔥 Menghapus pengguna dan karyawan lama...");
	await prisma.user.deleteMany({
		where: { employeeId: { in: usersToSeed.map((u) => u.employeeId) } },
	});
	await prisma.employee.deleteMany({
		where: { employeeId: { in: usersToSeed.map((u) => u.employeeId) } },
	});

	console.log("✨ Membuat ulang pengguna dan karyawan...");
	for (const userData of usersToSeed) {
		const hashedPassword = await generatePassword(
			userData.employeeId,
			userData.dob
		);

		// FIXED: Create User first, then Employee
		// This avoids the foreign key constraint issue
		const user = await prisma.user.create({
			data: {
				employeeId: userData.employeeId,
				password: hashedPassword,
				role: userData.role,
				...(userData.role === Role.HR_BRANCH && {
					branchId: userData.branchId,
				}),
				...(userData.role === Role.HD && {
					branchId: userData.branchId,
					departmentId: userData.departmentId,
				}),
			},
		});

		// Then create Employee that references the User
		await prisma.employee.create({
			data: {
				employeeId: userData.employeeId,
				fullName: userData.fullName,
				dateOfBirth: parseDate(userData.dob),
				gender: userData.gender,
				hireDate: new Date(),
				lastEducationDegree: userData.lastEducationDegree,
				lastEducationSchool: userData.lastEducationSchool,
				lastEducationMajor: userData.lastEducationMajor,
				branchId: userData.branchId,
				departmentId: userData.departmentId,
				positionId: userData.positionId,
				levelId: userData.levelId,
			},
		});

		console.log(
			`✅ Berhasil seeding pengguna ${userData.role}: ${userData.employeeId}`
		);
	}

	console.log("🎉 Seeding akun pengguna mockup telah selesai!");
}

main()
	.catch((e) => {
		console.error("❌ Terjadi error selama proses seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
