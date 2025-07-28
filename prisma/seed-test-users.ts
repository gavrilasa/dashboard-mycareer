import {
	PrismaClient,
	Gender,
	UserRole,
	EducationDegree,
} from "@prisma/client";
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

function getDate(dateString: string): Date {
	const day = parseInt(dateString.substring(0, 2), 10);
	const month = parseInt(dateString.substring(2, 4), 10) - 1; // Bulan di JS dimulai dari 0
	const year = parseInt(dateString.substring(4, 8), 10);
	return new Date(Date.UTC(year, month, day));
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
	return parseFloat((years + fraction).toFixed(2));
}

async function main() {
	console.log("Memulai seeding test users...");

	// --- Data Pengguna untuk Seeding ---

	const usersToSeed = [
		// 1 HR User
		{
			employeeId: "HRH001",
			name: "HR Head Office",
			dob: "05051992",
			hireDate: "05052018",
			gender: Gender.FEMALE,
			branchId: "N001",
			departmentId: "ADM-HR",
			positionId: 72,
			levelId: "spv",
			education: EducationDegree.S1,
			role: UserRole.HR,
		},
		// 1 HD User
		{
			employeeId: "HDH001",
			name: "HD Head Office",
			dob: "15031991",
			hireDate: "15032016",
			gender: Gender.MALE,
			branchId: "N001",
			departmentId: "ADM-FA",
			positionId: 10,
			levelId: "mgr",
			education: EducationDegree.S2,
			role: UserRole.HD,
		},
		// 2 Employee Users
		{
			employeeId: "EMP001",
			name: "Employee Test Satu",
			dob: "20071995",
			hireDate: "20072020",
			gender: Gender.MALE,
			branchId: "N002",
			departmentId: "MFG-PROD",
			positionId: 126,
			levelId: "spv",
			education: EducationDegree.D3,
			role: UserRole.EMPLOYEE,
		},
		{
			employeeId: "EMP002",
			name: "Employee Test Dua",
			dob: "21081996",
			hireDate: "21082021",
			gender: Gender.FEMALE,
			branchId: "N004",
			departmentId: "MFG-WRH",
			positionId: 191,
			levelId: "spv",
			education: EducationDegree.D4,
			role: UserRole.EMPLOYEE,
		},
	];

	for (const userData of usersToSeed) {
		const password = await generatePassword(userData.employeeId, userData.dob);
		const dateOfBirth = getDate(userData.dob);
		const hireDateObj = getDate(userData.hireDate);

		await prisma.user.upsert({
			where: { employeeId: userData.employeeId },
			update: {},
			create: {
				employeeId: userData.employeeId,
				password: password,
				role: userData.role,
				email: `${userData.employeeId.toLowerCase()}@example.com`,
				employee: {
					create: {
						name: userData.name,
						dateOfBirth: dateOfBirth,
						hireDate: hireDateObj,
						gender: userData.gender,
						personnelAreaId: userData.branchId,
						positionId: userData.positionId,
						departmentId: userData.departmentId,
						levelId: userData.levelId,
						age: calculateYearsDifference(dateOfBirth),
						lengthOfService: calculateYearsDifference(hireDateObj),
						educationDegree: userData.education,
						schoolName: "Universitas Seeding",
						majorName: "Jurusan Seeding",
						bestEmployeeScore: Math.floor(Math.random() * (95 - 85 + 1) + 85),
						formFilledStatus: 1,
						questionnaireStatus: 1,
						createdAt: new Date(),
						careerHistories: {
							create: {
								positionId: userData.positionId,
								levelId: userData.levelId,
								personnelAreaId: userData.branchId,
								departmentId: userData.departmentId,
								startDate: hireDateObj,
								status: 1,
							},
						},
					},
				},
			},
		});
		console.log(`Seeded ${userData.role} user: ${userData.employeeId}`);
	}

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
