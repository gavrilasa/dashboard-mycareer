// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getLevelId(
	levelName: "STAFF" | "SUPERVISOR" | "MANAGER"
): Promise<string> {
	const level = await prisma.level.findUnique({
		where: { name: levelName },
		select: { id: true },
	});
	if (!level) {
		throw new Error(
			`Level with name ${levelName} not found. Make sure to seed levels first.`
		);
	}
	return level.id;
}

function getLevelName(
	positionName: string
): "STAFF" | "SUPERVISOR" | "MANAGER" {
	const lowerCaseName = positionName.toLowerCase();
	if (lowerCaseName.includes("mgr") || lowerCaseName.includes("manager")) {
		return "MANAGER";
	}
	if (
		lowerCaseName.includes("spv") ||
		lowerCaseName.includes("supervisor") ||
		lowerCaseName.includes("coord")
	) {
		return "SUPERVISOR";
	}
	return "STAFF";
}

async function main() {
	console.log("🚀 Memulai proses seeding database...");

	// 1. Seed Levels
	const levels = ["STAFF", "SUPERVISOR", "MANAGER"];
	for (const levelName of levels) {
		await prisma.level.upsert({
			where: { name: levelName },
			update: {},
			create: { name: levelName },
		});
	}
	console.log(`✅ Berhasil seeding ${levels.length} level.`);

	// 2. Seed Branches
	const branches = [
		{ id: "N001", name: "ICBP-Noodle Head Office" },
		{ id: "N002", name: "ICBP-Noodle DKI" },
		{ id: "N003", name: "ICBP-Noodle Cibitung" },
		{ id: "N004", name: "ICBP-Noodle Tangerang" },
		{ id: "N005", name: "ICBP-Noodle Bandung" },
		{ id: "N006", name: "ICBP-Noodle Semarang" },
		{ id: "N007", name: "ICBP-Noodle Surabaya" },
		{ id: "N008", name: "ICBP-Noodle Medan" },
		{ id: "N009", name: "ICBP-Noodle Cirebon" },
		{ id: "P001", name: "ICBP-Noodle Pekanbaru" },
		{ id: "P002", name: "ICBP-Noodle Palembang" },
		{ id: "P003", name: "ICBP-Noodle Lampung" },
		{ id: "P004", name: "ICBP-Noodle Banjarmasin" },
		{ id: "P005", name: "ICBP-Noodle Pontianak" },
		{ id: "P006", name: "ICBP-Noodle Manado" },
		{ id: "P007", name: "ICBP-Noodle Makassar" },
		{ id: "P008", name: "ICBP-Noodle Jambi" },
		{ id: "P009", name: "ICBP-Noodle Tj. Api Api" },
	];

	for (const branch of branches) {
		await prisma.branch.upsert({
			where: { id: branch.id },
			update: { name: branch.name },
			create: {
				id: branch.id,
				name: branch.name,
			},
		});
	}
	console.log(`✅ Berhasil seeding ${branches.length} cabang.`);

	// 3. Seed Departments
	const departmentDefinitions = [
		{ id: "ADM-FA", name: "ADM Fin.& Acct." },
		{ id: "ADM-GM", name: "ADM Gen.Mgt" },
		{ id: "ADM-HR", name: "ADM HR" },
		{ id: "MFG-MFG", name: "MFG Manufactur" },
		{ id: "MFG-PPIC", name: "MFG PPIC" },
		{ id: "MFG-PROD", name: "MFG Production" },
		{ id: "MFG-PURC", name: "MFG Purchasing" },
		{ id: "MFG-TECH", name: "MFG Technical" },
		{ id: "MFG-WRH", name: "MFG Warehouse" },
		{ id: "MKT-MKT", name: "MKT Marketing" },
		{ id: "MKT-SD", name: "MKT Sales&Distr" },
		{ id: "RND-QCA", name: "R&D QC/QA" },
		{ id: "RND-RD", name: "R&D Resrch.Dev." },
	];

	let totalDepartmentsCreated = 0;
	for (const branch of branches) {
		for (const deptDef of departmentDefinitions) {
			const departmentId = `${branch.id}-${deptDef.id}`;
			await prisma.department.upsert({
				where: { id: departmentId },
				update: { name: deptDef.name },
				create: {
					id: departmentId,
					name: deptDef.name,
					branch: {
						connect: { id: branch.id },
					},
				},
			});
			totalDepartmentsCreated++;
		}
	}
	console.log(
		`✅ Berhasil seeding ${totalDepartmentsCreated} departemen di semua cabang.`
	);

	// 4. Seed Positions
	const positionDefinitions = [
		{ id: 1, name: "A & P Admin", departmentId: "MKT-MKT" },
		{ id: 2, name: "A & P Coord", departmentId: "MKT-MKT" },
		{ id: 3, name: "A & P Spv", departmentId: "MKT-MKT" },
		{ id: 4, name: "A & P Staff", departmentId: "MKT-MKT" },
		{ id: 5, name: "Acct Spv", departmentId: "ADM-FA" },
		{ id: 6, name: "Acct Staff", departmentId: "ADM-FA" },
		{ id: 7, name: "Admin to ASPM", departmentId: "MKT-MKT" },
		{ id: 8, name: "Admin to BHRM", departmentId: "ADM-HR" },
		{ id: 9, name: "Admin to BPDQC Mgr", departmentId: "RND-QCA" },
		{ id: 10, name: "Admin to Fin & Acct Mgr", departmentId: "ADM-FA" },
		{ id: 11, name: "Admin to FM", departmentId: "MFG-PROD" },
		{ id: 12, name: "Admin to PM", departmentId: "MFG-PROD" },
		{ id: 13, name: "Admin to Whs Mgr", departmentId: "MFG-WRH" },
		{ id: 14, name: "Area Sales & Promotion Mgr, Act", departmentId: "MKT-SD" },
		{ id: 15, name: "Area Sales & Promotion Repr", departmentId: "MKT-SD" },
		{
			id: 16,
			name: "Area Sales & Promotion Repr, Act",
			departmentId: "MKT-SD",
		},
		{ id: 17, name: "Area Sales & Promotion Spv", departmentId: "MKT-SD" },
		{ id: 18, name: "Area Sales & Promotion Spv, Act", departmentId: "MKT-SD" },
		{ id: 19, name: "Assistant BM Indomie", departmentId: "MKT-MKT" },
		{ id: 20, name: "Bag Noodle Dev Spv", departmentId: "RND-RD" },
		{ id: 21, name: "BPDQC Mgr, Act", departmentId: "RND-QCA" },
		{ id: 22, name: "BPDQC Spv", departmentId: "RND-QCA" },
		{ id: 23, name: "Branch HR Mgr, Act", departmentId: "ADM-HR" },
		{ id: 24, name: "Branch HR Officer", departmentId: "ADM-HR" },
		{ id: 25, name: "Budget & Controller Spv", departmentId: "ADM-FA" },
		{ id: 26, name: "Budget & Controller Spv, Act", departmentId: "ADM-FA" },
		{ id: 27, name: "Buyer", departmentId: "MFG-PURC" },
		{ id: 28, name: "Cashier", departmentId: "ADM-FA" },
		{ id: 29, name: "Category Management Specialist", departmentId: "MKT-SD" },
		{ id: 30, name: "Central Doc Control Spv", departmentId: "RND-QCA" },
		{ id: 31, name: "Chemical Analyst", departmentId: "RND-QCA" },
		{ id: 32, name: "Comben Assistant", departmentId: "ADM-HR" },
		{ id: 33, name: "Comben Spv", departmentId: "ADM-HR" },
		{ id: 34, name: "Comben Spv, Act", departmentId: "ADM-HR" },
		{ id: 35, name: "Comben Staff", departmentId: "ADM-HR" },
		{ id: 36, name: "Continous Improvement Spv", departmentId: "ADM-HR" },
		{ id: 37, name: "Coord Ingr. & Alkali", departmentId: "MFG-PROD" },
		{ id: 38, name: "Cost & Finance Spv", departmentId: "ADM-FA" },
		{ id: 39, name: "Cost Acct Spv", departmentId: "ADM-FA" },
		{ id: 40, name: "Cost Acct Staff", departmentId: "ADM-FA" },
		{ id: 41, name: "CQA & CQC Admin", departmentId: "RND-QCA" },
		{ id: 42, name: "Cup Noodle & RM Dev Spv", departmentId: "RND-RD" },
		{ id: 43, name: "Distribution Admin", departmentId: "MKT-SD" },
		{ id: 44, name: "Distribution Assistant", departmentId: "MKT-SD" },
		{ id: 45, name: "Distribution Officer", departmentId: "MKT-SD" },
		{ id: 46, name: "Distribution Officer, Act", departmentId: "MKT-SD" },
		{ id: 47, name: "Distribution Staff", departmentId: "MKT-SD" },
		{ id: 48, name: "Doc Controller Spv", departmentId: "ADM-GM" },
		{ id: 49, name: "Doc Controller Staff", departmentId: "ADM-GM" },
		{ id: 50, name: "Draft & Design Sect Spv", departmentId: "MFG-TECH" },
		{ id: 51, name: "Electrical Technical Spv", departmentId: "MFG-TECH" },
		{ id: 52, name: "Employee Service Staff", departmentId: "ADM-HR" },
		{ id: 53, name: "Fin & Acct Mgr, Act", departmentId: "ADM-FA" },
		{ id: 54, name: "Finance Spv", departmentId: "ADM-FA" },
		{ id: 55, name: "Finance Staff", departmentId: "ADM-FA" },
		{ id: 56, name: "Flavour Dev Technician", departmentId: "RND-RD" },
		{ id: 57, name: "Flavour Engineering & Dev Spv", departmentId: "RND-RD" },
		{ id: 58, name: "Food Services Spv", departmentId: "MKT-SD" },
		{ id: 59, name: "GAS Assistant", departmentId: "ADM-HR" },
		{ id: 60, name: "GAS Coord", departmentId: "ADM-HR" },
		{ id: 61, name: "GAS Spv", departmentId: "ADM-HR" },
		{ id: 62, name: "GAS Spv, Act", departmentId: "ADM-HR" },
		{ id: 63, name: "GAS Staff", departmentId: "ADM-HR" },
		{ id: 64, name: "General Acct Spv", departmentId: "ADM-FA" },
		{ id: 65, name: "General Acct Staff", departmentId: "ADM-FA" },
		{
			id: 66,
			name: "Halal Coord & Customer Complain Spv",
			departmentId: "ADM-HR",
		},
		{ id: 67, name: "HCO EDP Spv", departmentId: "MKT-SD" },
		{ id: 68, name: "HCO Spv", departmentId: "MKT-SD" },
		{ id: 69, name: "HR Admin", departmentId: "ADM-HR" },
		{ id: 70, name: "HR Admin Spv", departmentId: "ADM-HR" },
		{ id: 71, name: "HR EDP Staff", departmentId: "ADM-HR" },
		{ id: 72, name: "HRIS & Comben Spv", departmentId: "ADM-HR" },
		{ id: 73, name: "HRIS Spv", departmentId: "ADM-HR" },
		{ id: 74, name: "Indomie Brand Admin", departmentId: "MKT-MKT" },
		{ id: 75, name: "Instrument Analyst", departmentId: "RND-QCA" },
		{ id: 76, name: "IR & PR Asst", departmentId: "ADM-HR" },
		{ id: 77, name: "IR & PR Spv", departmentId: "ADM-HR" },
		{ id: 78, name: "IR & PR Staff", departmentId: "ADM-HR" },
		{ id: 79, name: "IR Assistant", departmentId: "ADM-HR" },
		{ id: 80, name: "IR Spv", departmentId: "ADM-HR" },
		{ id: 81, name: "IR Staff", departmentId: "ADM-HR" },
		{ id: 82, name: "Key Account Spv", departmentId: "MKT-SD" },
		{ id: 83, name: "Key Account Spv E-Commerce", departmentId: "MKT-SD" },
		{
			id: 84,
			name: "Key Account Spv Modern Food Service",
			departmentId: "MKT-SD",
		},
		{ id: 85, name: "Key Account Spv MTKA", departmentId: "MKT-SD" },
		{ id: 86, name: "Lab Chemistry Coordinator", departmentId: "RND-QCA" },
		{ id: 87, name: "Lab Microbiology Coordinator", departmentId: "RND-QCA" },
		{ id: 88, name: "Management EDP Spv", departmentId: "ADM-GM" },
		{ id: 89, name: "Management EDP Spv, Act", departmentId: "ADM-GM" },
		{ id: 90, name: "Management EDP Staff", departmentId: "ADM-GM" },
		{ id: 91, name: "Manpower Productivity Spv", departmentId: "ADM-HR" },
		{ id: 92, name: "Marketing Admin", departmentId: "MKT-MKT" },
		{ id: 93, name: "Marketing EDP Spv", departmentId: "MKT-SD" },
		{ id: 94, name: "Marketing EDP Spv", departmentId: "MKT-MKT" },
		{ id: 95, name: "Marketing EDP Spv, Act", departmentId: "MKT-MKT" },
		{ id: 96, name: "Marketing EDP Staff", departmentId: "MKT-MKT" },
		{ id: 97, name: "Microbiology Analyst", departmentId: "RND-QCA" },
		{
			id: 98,
			name: "Modern Trade Promotion Analyst & Support",
			departmentId: "MKT-SD",
		},
		{ id: 99, name: "MT Acct", departmentId: "ADM-HR" },
		{ id: 100, name: "MT HR", departmentId: "ADM-HR" },
		{ id: 101, name: "MT MFG", departmentId: "ADM-HR" },
		{ id: 102, name: "MT PPIC", departmentId: "ADM-HR" },
		{ id: 103, name: "MT Sales", departmentId: "ADM-HR" },
		{
			id: 104,
			name: "Nd Others, Shelf Life & Regulatory Staff",
			departmentId: "RND-RD",
		},
		{ id: 105, name: "NPL Project & Shelf Life Spv", departmentId: "RND-QCA" },
		{ id: 106, name: "OD & PD Staff", departmentId: "ADM-HR" },
		{ id: 107, name: "Operation Dev Spv", departmentId: "MFG-MFG" },
		{ id: 108, name: "Org Dev Spv", departmentId: "ADM-HR" },
		{ id: 109, name: "Org Dev Spv, Act", departmentId: "ADM-HR" },
		{ id: 110, name: "Org Dev Staff", departmentId: "ADM-HR" },
		{ id: 111, name: "Panel Dev Staff", departmentId: "RND-RD" },
		{ id: 112, name: "Panelis Dev Coordinator", departmentId: "RND-RD" },
		{ id: 113, name: "People Dev Staff", departmentId: "ADM-HR" },
		{ id: 114, name: "PPIC Assistant", departmentId: "MFG-PPIC" },
		{ id: 115, name: "PPIC RM Planning Assistant", departmentId: "MFG-PPIC" },
		{ id: 116, name: "PPIC RM Planning Staff", departmentId: "MFG-PPIC" },
		{ id: 117, name: "PPIC Spv", departmentId: "MFG-PPIC" },
		{ id: 118, name: "PPIC Spv, Act", departmentId: "MFG-PPIC" },
		{ id: 119, name: "PPIC Staff", departmentId: "MFG-PPIC" },
		{ id: 120, name: "PR Staff", departmentId: "ADM-HR" },
		{ id: 121, name: "Prod EPS Section Spv", departmentId: "MFG-PROD" },
		{ id: 122, name: "Prod EPS Spv", departmentId: "MFG-PROD" },
		{ id: 123, name: "Prod Section SILO", departmentId: "MFG-PROD" },
		{ id: 124, name: "Prod Section Spv", departmentId: "MFG-PROD" },
		{ id: 125, name: "Prod Section Spv, Act", departmentId: "MFG-PROD" },
		{ id: 126, name: "Prod Shift Spv", departmentId: "MFG-PROD" },
		{ id: 127, name: "Prod Shift Spv, Act", departmentId: "MFG-PROD" },
		{ id: 128, name: "Product Dev Technician", departmentId: "RND-RD" },
		{ id: 129, name: "Production Mgr, Act", departmentId: "MFG-PROD" },
		{ id: 130, name: "Production Spv", departmentId: "MFG-PROD" },
		{ id: 131, name: "Prototype Technician", departmentId: "RND-RD" },
		{ id: 132, name: "Proximat Analyst", departmentId: "RND-QCA" },
		{ id: 133, name: "Purchasing Admin", departmentId: "MFG-PURC" },
		{ id: 134, name: "Purchasing Assistant", departmentId: "MFG-PURC" },
		{ id: 135, name: "Purchasing Officer", departmentId: "MFG-PURC" },
		{ id: 136, name: "Purchasing Staff", departmentId: "MFG-PURC" },
		{ id: 137, name: "QC Auditor Spv", departmentId: "RND-QCA" },
		{ id: 138, name: "QC FG Section Spv", departmentId: "RND-QCA" },
		{ id: 139, name: "QC FG Section Spv, Act", departmentId: "RND-QCA" },
		{ id: 140, name: "QC PD Section Spv", departmentId: "RND-QCA" },
		{ id: 141, name: "QC PD Spv", departmentId: "RND-QCA" },
		{ id: 142, name: "QC Process Section Spv", departmentId: "RND-QCA" },
		{ id: 143, name: "QC Process Spv", departmentId: "RND-QCA" },
		{ id: 144, name: "QC Process Spv, Act", departmentId: "RND-QCA" },
		{ id: 145, name: "QC RM & FG Section Spv", departmentId: "RND-QCA" },
		{ id: 146, name: "QC RM & FG Spv", departmentId: "RND-QCA" },
		{ id: 147, name: "QC RM & FG Spv, Act", departmentId: "RND-QCA" },
		{ id: 148, name: "QC RM Section Spv", departmentId: "RND-QCA" },
		{ id: 149, name: "QC Section Spv", departmentId: "RND-QCA" },
		{ id: 150, name: "Sales EDP Spv", departmentId: "MKT-SD" },
		{ id: 151, name: "Sales Trainee", departmentId: "ADM-HR" },
		{ id: 152, name: "Sales Trainee - ASPR, Act", departmentId: "ADM-HR" },
		{ id: 153, name: "Sarimi Brand Admin", departmentId: "MKT-MKT" },
		{ id: 154, name: "Secretary to BM", departmentId: "ADM-GM" },
		{ id: 155, name: "Secretary to Div. Head", departmentId: "ADM-GM" },
		{ id: 156, name: "Secretary to GM", departmentId: "ADM-GM" },
		{ id: 157, name: "Secretary to GM Fin & Acct", departmentId: "ADM-FA" },
		{ id: 158, name: "Secretary to GM HR", departmentId: "ADM-HR" },
		{ id: 159, name: "Secretary to GM Marketing", departmentId: "MKT-MKT" },
		{ id: 160, name: "Secretary to GM Mfg", departmentId: "MFG-MFG" },
		{ id: 161, name: "Secretary to GM Sales", departmentId: "MKT-SD" },
		{ id: 162, name: "Section Whs Spare Part", departmentId: "MFG-TECH" },
		{ id: 163, name: "Security Chief", departmentId: "ADM-HR" },
		{ id: 164, name: "Security Grp Leader", departmentId: "ADM-HR" },
		{ id: 165, name: "SHE Assistant", departmentId: "ADM-HR" },
		{ id: 166, name: "SHE Spv", departmentId: "ADM-HR" },
		{ id: 167, name: "SHE Staff", departmentId: "ADM-HR" },
		{ id: 168, name: "System Analyst Spv", departmentId: "ADM-FA" },
		{ id: 169, name: "Targeted Flavour Dev Spv", departmentId: "RND-RD" },
		{ id: 170, name: "Targeted Flavour Dev Staff", departmentId: "RND-RD" },
		{ id: 171, name: "Tax & Acct Spv", departmentId: "ADM-FA" },
		{ id: 172, name: "Tax Officer", departmentId: "ADM-FA" },
		{ id: 173, name: "Tax Staff", departmentId: "ADM-FA" },
		{ id: 174, name: "Tech Building & General Sec", departmentId: "MFG-TECH" },
		{ id: 175, name: "Tech EPS Section Spv", departmentId: "MFG-TECH" },
		{ id: 176, name: "Tech PM Section Spv", departmentId: "MFG-TECH" },
		{ id: 177, name: "Tech Process Spv", departmentId: "MFG-TECH" },
		{ id: 178, name: "Tech Prod EPS Section Spv", departmentId: "MFG-TECH" },
		{ id: 179, name: "Tech Prod Section Spv", departmentId: "MFG-TECH" },
		{ id: 180, name: "Tech Prod Spv", departmentId: "MFG-TECH" },
		{ id: 181, name: "Tech Utility Section Spv", departmentId: "MFG-TECH" },
		{ id: 182, name: "Tech Utility Spv", departmentId: "MFG-TECH" },
		{ id: 183, name: "Tech Workshop Section", departmentId: "MFG-TECH" },
		{ id: 184, name: "Tech Workshop Section Spv", departmentId: "MFG-TECH" },
		{ id: 185, name: "Technical Mgr, Act", departmentId: "MFG-TECH" },
		{ id: 186, name: "Technical Spv", departmentId: "MFG-TECH" },
		{ id: 187, name: "Trade Marketing Spv GT", departmentId: "MKT-SD" },
		{ id: 188, name: "Trade Marketing Spv MTI", departmentId: "MKT-SD" },
		{ id: 189, name: "Warehouse FG Spv", departmentId: "MFG-WRH" },
		{ id: 190, name: "Warehouse Mgr, Act", departmentId: "MFG-WRH" },
		{ id: 191, name: "Warehouse Spv", departmentId: "MFG-WRH" },
		{ id: 192, name: "Whs FG Section Spv", departmentId: "MFG-WRH" },
		{ id: 193, name: "Whs FG Spv", departmentId: "MFG-WRH" },
		{ id: 194, name: "Whs RM Admin", departmentId: "MFG-WRH" },
		{ id: 195, name: "Whs RM Section Spv", departmentId: "MFG-WRH" },
		{ id: 196, name: "Whs RM Section Spv, Act", departmentId: "MFG-WRH" },
		{ id: 197, name: "Whs RM Spv", departmentId: "MFG-WRH" },
		{ id: 198, name: "Whs RM Spv, Act", departmentId: "MFG-WRH" },
		{ id: 199, name: "Whs SP & A&P Section Spv", departmentId: "MFG-WRH" },
		{ id: 200, name: "Whs SP Section Spv", departmentId: "MFG-WRH" },
		{ id: 201, name: "Workshop Supervisor", departmentId: "MFG-TECH" },
	];

	const staffLevelId = await getLevelId("STAFF");
	const supervisorLevelId = await getLevelId("SUPERVISOR");
	const managerLevelId = await getLevelId("MANAGER");

	const getLevelIdByName = (name: string) => {
		const levelName = getLevelName(name);
		if (levelName === "MANAGER") return managerLevelId;
		if (levelName === "SUPERVISOR") return supervisorLevelId;
		return staffLevelId;
	};

	let totalPositionsCreated = 0;
	for (const branch of branches) {
		for (const posDef of positionDefinitions) {
			const positionId = `${branch.id}-${posDef.id}`;
			const departmentId = `${branch.id}-${posDef.departmentId}`;

			const data = {
				id: positionId,
				name: posDef.name,
				branch: { connect: { id: branch.id } },
				department: { connect: { id: departmentId } },
				level: { connect: { id: getLevelIdByName(posDef.name) } },
			};

			await prisma.position.upsert({
				where: { id: positionId },
				update: {
					name: data.name,
				},
				create: data,
			});
			totalPositionsCreated++;
		}
	}
	console.log(
		`✅ Berhasil seeding ${totalPositionsCreated} posisi di semua cabang.`
	);

	console.log("🎉 Seeding database telah selesai sepenuhnya!");
}

main()
	.catch((e) => {
		console.error("❌ Terjadi error selama proses seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
