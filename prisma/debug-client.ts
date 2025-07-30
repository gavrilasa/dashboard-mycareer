// minimal-test.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function minimalTest() {
	try {
		console.log("Testing minimal employee creation...");

		// First, let's see what the create method expects by trying with minimal data
		const employee = await prisma.employee.create({
			data: {
				employeeId: "TEST001",
				fullName: "Test User",
				dateOfBirth: new Date("1990-01-01"),
				gender: "MALE",
				hireDate: new Date(),
				lastEducationDegree: "S1",
				lastEducationSchool: "Test School",
				lastEducationMajor: "Test Major",
				branchId: "N001", // Assuming this exists from your seed
				departmentId: "N001-ADM-HR", // Assuming this exists
				positionId: "N001-72", // Assuming this exists
				levelId: "cmdpl9tdm00018ovgi7oxy9gs", // Use the ID from your error message
			},
		});

		console.log("Success! Employee created:", employee);

		// Clean up
		await prisma.employee.delete({
			where: { employeeId: "TEST001" },
		});
	} catch (error) {
		console.error("Error:", error.message);
	}
}

minimalTest().finally(() => prisma.$disconnect());
