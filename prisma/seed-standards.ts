// prisma/seed-standards.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const standardsData: {
	positionName: string;
	competency: string;
	standardValue: number;
}[] = [
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Budgeting Mastery",
		standardValue: 5,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Taxation Mastery",
		standardValue: 4,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Financial Report Mastery",
		standardValue: 5,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Cost Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "General Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Manajemen SDM",
		standardValue: 3,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Fin & Acct Mgr, Act",
		competency: "Financial Management",
		standardValue: 4,
	},
	{
		positionName: "General Acct Spv",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "Taxation Mastery",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Financial Report Mastery",
		standardValue: 4,
	},
	{
		positionName: "General Acct Spv",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "General Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "General Acct Spv",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "General Acct Spv",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Manajemen SDM",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "General Acct Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Taxation Mastery",
		standardValue: 2,
	},
	{
		positionName: "General Acct Staff",
		competency: "Financial Report Mastery",
		standardValue: 4,
	},
	{
		positionName: "General Acct Staff",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "General Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "General Acct Staff",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Manajemen SDM",
		standardValue: 2,
	},
	{
		positionName: "General Acct Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Financial Report Mastery",
		standardValue: 3.5,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Cost Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "General Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Manajemen SDM",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Financial Report Mastery",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Cost Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "General Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Manajemen SDM",
		standardValue: 2,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Budgeting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Finance Spv",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "Financial Report Mastery",
		standardValue: 4,
	},
	{
		positionName: "Finance Spv",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "General Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Finance Spv",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Manajemen SDM",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Financial Management",
		standardValue: 3.5,
	},
	{
		positionName: "Finance Staff",
		competency: "Budgeting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Finance Staff",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Financial Report Mastery",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "General Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Manajemen SDM",
		standardValue: 2,
	},
	{
		positionName: "Finance Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Budgeting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Financial Report Mastery",
		standardValue: 3.5,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Cost Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "General Accounting Mastery",
		standardValue: 4,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Administration Mastering",
		standardValue: 4,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Manajemen SDM",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "SAP Mastering",
		standardValue: 3.5,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Taxation Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Financial Report Mastery",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "General Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Administration Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Manajemen SDM",
		standardValue: 2,
	},
	{
		positionName: "Cashier",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Budgeting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Taxation Mastery",
		standardValue: 2,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Financial Report Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Cost Accounting Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "General Accounting Mastery",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Administration Mastering",
		standardValue: 4,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "System Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Manajemen SDM",
		standardValue: 2,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Policy & Legal Opinion",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Manajemen PPHI",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Organization Development",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Talent Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Managemen Comben",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Man Power Planning dan Productivity",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Pengelolaan Kinerja",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Safety, Health, Environment Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Manajemen Energi",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "External & Public Relation",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Business Process Management",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Mgr, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Policy & Legal Opinion",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Manajemen PPHI",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Organization Development",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Talent Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Managemen Comben",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Man Power Planning dan Productivity",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Pengelolaan Kinerja",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Safety, Health, Environment Management",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Manajemen Energi",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Officer",
		competency: "External & Public Relation",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Business Process Management",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 5,
	},
	{
		positionName: "Branch HR Officer",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 4,
	},
	{
		positionName: "IR Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Manajemen PPHI",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 4,
	},
	{
		positionName: "IR Spv",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Organization Development",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Talent Management",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "IR Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "IR Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "IR Spv",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "IR Spv",
		competency: "External & Public Relation",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Asset/Facility Management",
		standardValue: 2,
	},
	{
		positionName: "IR Spv",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "IR Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "IR Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "IR Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "IR Spv",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "IR Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Recruitment Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Training and Development Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Organization Development",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Talent Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Recruitment Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Training and Development Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Organization Development",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Talent Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Pengelolaan Kinerja",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv",
		competency: "Managemen Comben",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Managemen Comben",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Man Power Planning dan Productivity",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Pengelolaan Kinerja",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Spv",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Asset/Facility Management",
		standardValue: 4,
	},
	{
		positionName: "GAS Spv",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Safety, Health, Environment Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Asset/Facility Management",
		standardValue: 4,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "SHE Spv",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 4,
	},
	{
		positionName: "SHE Spv",
		competency: "Manajemen Energi",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "External & Public Relation",
		standardValue: 2,
	},
	{
		positionName: "SHE Spv",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "SHE Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "SHE Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Financial Management",
		standardValue: 2,
	},
	{
		positionName: "Security Spv",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "Security Spv",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Asset/Facility Management",
		standardValue: 2,
	},
	{
		positionName: "Security Spv",
		competency: "Security Management",
		standardValue: 4,
	},
	{
		positionName: "Security Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Pengelolaan Kinerja",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "External & Public Relation",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "IR Assistant",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "External & Public Relation",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "IR Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "Managemen Comben",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Man Power Planning dan Productivity",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Pengelolaan Kinerja",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Comben Assistant",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "Manajemen PPHI",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "Managemen Comben",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Comben Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Recruitment Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Training and Development Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Organization Development",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "SHE Staff",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Talent Management",
		standardValue: 2,
	},
	{
		positionName: "SHE Staff",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Manajemen Energi",
		standardValue: 2,
	},
	{
		positionName: "SHE Staff",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "SHE Staff",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Recruitment Management",
		standardValue: 2,
	},
	{
		positionName: "HRIS Staff",
		competency: "Training and Development Management",
		standardValue: 2,
	},
	{
		positionName: "HRIS Staff",
		competency: "Organization Development",
		standardValue: 2,
	},
	{
		positionName: "HRIS Staff",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Managemen Comben",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 2,
	},
	{
		positionName: "HRIS Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "HRIS Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 2,
	},
	{
		positionName: "PR Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "External & Public Relation",
		standardValue: 4,
	},
	{
		positionName: "PR Staff",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "PR Staff",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Asset/Facility Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Business Process Management",
		standardValue: 2,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Admin to BHRO",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Policy & Legal Opinion",
		standardValue: 2,
	},
	{
		positionName: "GAS Staff",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Safety, Health, Environment Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Staff",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Handling Customer Complain",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Asset/Facility Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Security Management",
		standardValue: 2,
	},
	{
		positionName: "GAS Staff",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Asset/Facility Management",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Security Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Manajemen Sarana & Hubungan Industrial",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Policy & Legal Opinion",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Manajemen PPHI",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Pengelolaan LKS Bipartit",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Recruitment Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Training and Development Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Organization Development",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Talent Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Managemen Comben",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Man Power Planning dan Productivity",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Pengelolaan Kinerja",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Safety, Health, Environment Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Manajemen Energi",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "External & Public Relation",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Handling Customer Complain",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Asset/Facility Management",
		standardValue: 2,
	},
	{
		positionName: "Security Operatif",
		competency: "Security Management",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Production Process Handling",
		standardValue: 5,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Man Power Handling",
		standardValue: 5,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Raw Material Handling",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Technical Machine Mastery",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Utility Management",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Production Planning",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Suply Chain Management",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Business Process Management",
		standardValue: 5,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Production Mgr, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Production Process Handling",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Raw Material Handling",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Technical Machine Mastery",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Utility Management",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Suply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Administrastion Mastering",
		standardValue: 1,
	},
	{
		positionName: "Production Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Production Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Financial Management",
		standardValue: 1,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Production Process Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Raw Material Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Technical Machine Mastery",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Utility Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Administrastion Mastering",
		standardValue: 1,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Production Process Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Raw Material Handling",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Technical Machine Mastery",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Utility Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 1,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Raw Material Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Raw Material Handling",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "Helper & Operator",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 2,
	},
	{
		positionName: "Helper & Operator",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 1,
	},
	{
		positionName: "Helper & Operator",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Helper & Operator",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 1,
	},
	{
		positionName: "Helper & Operator",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Admin to PM",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Admin to PM",
		competency: "Business Process Management",
		standardValue: 1,
	},
	{
		positionName: "Admin to PM",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 1,
	},
	{
		positionName: "Admin to PM",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Admin to PM",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Production Process Handling",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Technical Machine Mastery",
		standardValue: 5,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Utility Management",
		standardValue: 5,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Production Planning",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Suply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technical Mgr, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Technical Machine Mastery",
		standardValue: 4,
	},
	{
		positionName: "Technical Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 4,
	},
	{
		positionName: "Technical Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 4,
	},
	{
		positionName: "Technical Spv",
		competency: "Utility Management",
		standardValue: 4,
	},
	{
		positionName: "Technical Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Technical Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Utility Management",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Technic Section Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Technical Machine Mastery",
		standardValue: 2,
	},
	{
		positionName: "Technic Field",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Utility Management",
		standardValue: 2,
	},
	{
		positionName: "Technic Field",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Tech Admin",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Tech Admin",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Tech Admin",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 5,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Incoming QC Mastering",
		standardValue: 5,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 5,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Production Planning",
		standardValue: 4,
	},
	{
		positionName: "BPDQC Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Suply Chain Management",
		standardValue: 4,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Sistem Management Mastering",
		standardValue: 5,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Business Process Management",
		standardValue: 5,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "BPDQC Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Production Process Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "QC Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 4,
	},
	{
		positionName: "QC Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "QC Section Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "QC Field",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Quality Control Process Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Incoming QC Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Outgoing QC Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Quality Control Process Mastery",
		standardValue: 2,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Incoming QC Mastering",
		standardValue: 2,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Outgoing QC Mastering",
		standardValue: 2,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "PPIC Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Production Planning",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "RM Procurement Mastery",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "Inventory Control",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "Suply Chain Management",
		standardValue: 5,
	},
	{
		positionName: "PPIC Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 5,
	},
	{
		positionName: "PPIC Spv",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Production Process Handling",
		standardValue: 2,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Production Planning",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "RM Procurement Mastery",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Inventory Control",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Suply Chain Management",
		standardValue: 5,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 5,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Production Planning",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "RM Procurement Mastery",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Inventory Control",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Suply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Manufacturing Performance Report",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Physical Stock Management",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Administrastion Mastering",
		standardValue: 4,
	},
	{
		positionName: "PPIC Staff",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "PPIC Staff",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "PPIC Staff",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Warehouse Management",
		standardValue: 5,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "RM Inventory Management",
		standardValue: 5,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "FG Inventory Management",
		standardValue: 5,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Capacity Planning",
		standardValue: 5,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Physical Stock Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Industrial Truck Mastery",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Administrastion Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Mgr, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Man Power Handling",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Warehouse Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "RM Inventory Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "FG Inventory Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Capacity Planning",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Physical Stock Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Administrastion Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Sistem Management Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Man Power Handling",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Warehouse Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "RM Inventory Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "FG Inventory Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Capacity Planning",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Physical Stock Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Industrial Truck Mastery",
		standardValue: 2,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Sistem Management Mastering",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Warehouse Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "RM Inventory Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "FG Inventory Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Physical Stock Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Administrastion Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "RM Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "FG Inventory Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Physical Stock Management",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Industrial Truck Mastery",
		standardValue: 4,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "RM Inventory Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Helper",
		competency: "FG Inventory Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Helper",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Physical Stock Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Helper",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Helper",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Helper",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Production Process Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Production Machine Mastery (Machine Handling)",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Basic Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Man Power Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Raw Material Handling",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Technical Machine Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Technical Preventive Maintenance Machine Skill",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Machine Fabrication Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Utility Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Quality Control Process Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Incoming QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Laboratorium Analysis Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Outgoing QC Mastering",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Production Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "RM Procurement Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Inventory Control",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Suply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Manufacturing Performance Report",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Warehouse Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "RM Inventory Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Admin",
		competency: "FG Inventory Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Admin",
		competency: "Capacity Planning",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Physical Stock Management",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Industrial Truck Mastery",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Whs Admin",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Admin",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Whs Admin",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Teritory Management",
		standardValue: 5,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Distribution & Supply Chain Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Key Account Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Sales Management",
		standardValue: 5,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Promotion Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Trade Marketing Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Brand Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Database Management",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Business Process Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Mgr, Act",
		competency: "Financial Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Teritory Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Key Account Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Sales Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Promotion Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Trade Marketing Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Brand Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Financial Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Teritory Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Key Account Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Sales Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Promotion Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Trade Marketing Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Brand Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Financial Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Teritory Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Key Account Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Sales Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Promotion Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Trade Marketing Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Brand Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Teritory Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Key Account Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Sales Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Promotion Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Trade Marketing Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Brand Management",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "SAP Mastering",
		standardValue: 2,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Distribution & Supply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Sales Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Promotion Management",
		standardValue: 2,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Administrastion Mastering",
		standardValue: 4,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Distribution & Supply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Sales Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Promotion Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Distribution & Supply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Sales Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Promotion Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Distribution & Supply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Sales Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Promotion Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Administrastion Mastering",
		standardValue: 4,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Business Process Management",
		standardValue: 2,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Teritory Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Distribution & Supply Chain Management",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Sales Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Promotion Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Distribution Officer",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Teritory Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Distribution & Supply Chain Management",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Sales Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Promotion Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Database Management",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Business Process Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "SAP Mastering",
		standardValue: 4,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Teritory Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Sales Management",
		standardValue: 2,
	},
	{
		positionName: "Distribution Staff",
		competency: "Promotion Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Administrastion Mastering",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Sistem Management Mastering",
		standardValue: 2,
	},
	{
		positionName: "Distribution Staff",
		competency: "Business Process Management",
		standardValue: 2,
	},
	{
		positionName: "Distribution Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Distribution & Supply Chain Management",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Sales Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Promotion Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Database Management",
		standardValue: 2,
	},
	{
		positionName: "Distribution Admin",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "SAP Mastering",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Teritory Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Distribution & Supply Chain Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Key Account Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Sales Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Promotion Management",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Trade Marketing Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Brand Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Administrastion Mastering",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Database Management",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Sistem Management Mastering",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Business Process Management",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Manajemen Sumber Daya Manusia",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "SAP Mastering",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Financial Management",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "General Acct Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Finance Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Finance Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Cashier",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Cashier",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Admin to Fin & Acct Mgr",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "IR Assistant",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "IR Assistant",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "IR Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "IR Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Comben Assistant",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Comben Assistant",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Comben Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Comben Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "SHE Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "SHE Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "HRIS Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "HRIS Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "PR Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "PR Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Admin to BHRO",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "GAS Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "GAS Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "GAS Operatif",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "GAS Operatif",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Security Operatif",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Security Operatif",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Prod Section Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Helper & Operator",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Helper & Operator",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Admin to PM",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Admin to PM",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Technic Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Technic Field",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Technic Field",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Tech Admin",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Tech Admin",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "QC Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC Field",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "QC Field",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "QC Process Analyst",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Admin to BPDQC Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "PPIC Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Whs Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Whs Stock Keeper",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Operator Skid Loader",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Whs Helper",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Whs Helper",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Whs Admin",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Whs Admin",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Repr, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Admin to ASPM",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Distribution Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Admin",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "Distribution Admin",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "A & P Staff",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Analisa",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Coaching",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Komunikasi",
		standardValue: 0,
	},
	{
		positionName: "A & P Staff",
		competency: "Menginspirasi Orang Lain",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "General Acct Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "General Acct Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Cost Acct Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Finance Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Finance Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Cost & Finance Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Branch HR Officer",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "IR Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "IR Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Org Dev Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Comben Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "GAS Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "SHE Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "SHE Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Security Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Security Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Production Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Production Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Prod Shift Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Technical Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Technical Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "BPDQC Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC Process Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM & FG Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "QC RM Section Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "PPIC Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Warehouse Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Area Sales & Promotion Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Marketing EDP Spv, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Peningkatan Berkelanjutan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Adaptability",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Belajar Terapan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Integritas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Orientasi Pada Kualitas",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Kontribusi Pada Keberhasilan Tim",
		standardValue: 0,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Membangun Kesetiaan Pelanggan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Kolaborasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Mengelola Waktu Dan Pekerjaan",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Membangun Tim Yang Berhasil",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Analisa",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Coaching",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Komunikasi",
		standardValue: 3,
	},
	{
		positionName: "Distribution Officer, Act",
		competency: "Menginspirasi Orang Lain",
		standardValue: 3,
	},
];

async function main() {
	console.log(`Mulai proses seeding untuk Standar Kompetensi...`);

	const allPositions = await prisma.position.findMany({
		select: { id: true, name: true },
	});

	const normalizeString = (str: string) => {
		return str
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9&\s/]/g, "")
			.replace(/\s+/g, " ");
	};

	const positionMap = new Map(
		allPositions.map((p) => [normalizeString(p.name), p.id])
	);

	const standardsToCreate = [];
	const unprocessedPositions = new Set<string>();

	for (const standard of standardsData) {
		const normalizedPosName = normalizeString(standard.positionName);
		const positionId = positionMap.get(normalizedPosName);

		if (positionId) {
			standardsToCreate.push({
				positionId,
				competency: standard.competency.trim(),
				standardValue: standard.standardValue,
			});
		} else {
			unprocessedPositions.add(standard.positionName);
		}
	}

	if (unprocessedPositions.size > 0) {
		console.warn(
			"\nPERINGATAN: Jabatan berikut dari data standar tidak ditemukan di database dan dilewati:"
		);
		unprocessedPositions.forEach((posName) => console.warn(`- ${posName}`));
		console.log("\n");
	}

	if (standardsToCreate.length === 0 && standardsData.length > 0) {
		throw new Error(
			"Tidak ada data standar yang berhasil diproses. Proses seeding dihentikan."
		);
	}

	console.log(`Menghapus data standar lama...`);
	await prisma.competencyStandard.deleteMany({});

	console.log(`Memasukkan ${standardsToCreate.length} data standar baru...`);
	await prisma.competencyStandard.createMany({
		data: standardsToCreate,
		skipDuplicates: true,
	});

	console.log(`Proses seeding Standar Kompetensi selesai.`);

	// --- LANGKAH VERIFIKASI AKHIR ---
	console.log("\n--- Memulai Verifikasi Otomatis ---");
	const helperOperatorId = positionMap.get(
		normalizeString("Helper & Operator")
	);
	if (helperOperatorId) {
		const count = await prisma.competencyStandard.count({
			where: { positionId: helperOperatorId },
		});
		if (count > 0) {
			console.log(
				`✅ SUKSES: Verifikasi berhasil. Ditemukan ${count} data standar untuk 'Helper & Operator'.`
			);
		} else {
			console.error(
				"❌ GAGAL: Verifikasi gagal. Tidak ada data standar untuk 'Helper & Operator' yang masuk ke database."
			);
		}
	} else {
		console.warn(
			"Peringatan Verifikasi: Posisi 'Helper & Operator' tidak ditemukan untuk diverifikasi."
		);
	}
	console.log("---------------------------------");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
