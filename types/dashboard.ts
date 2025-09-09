// types/dashboard.ts

export interface KpiData {
	totalEmployees: number;
	totalFormsCompleted: number;
	totalQuestionnaires: number;
	totalVacancies: number;
}

// Untuk grafik batang & lingkaran
export interface NameValueData {
	name: string;
	value: number;
}

// Untuk grafik garis
export interface DateCountData {
	date: string;
	count: number;
}

export interface Activity {
	id: string;
	type: "NEW_EMPLOYEE" | "FORM_COMPLETED" | "QUESTIONNAIRE_COMPLETED";
	timestamp: string;
	description: string;
	employeeName: string | null;
}
