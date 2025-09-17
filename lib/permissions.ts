import { Role } from "@prisma/client";

export type Resource =
	| "dashboard"
	| "jobVacant"
	| "careerPath"
	| "questionnaire"
	| "form"
	| "employee"
	| "position"
	| "department"
	| "branch"
	| "userManagement";

export type Action =
	| "create"
	| "read"
	| "update"
	| "delete"
	| "publish"
	| "upload"
	| "answer"
	| "apply"
	| "sync";

export const PERMISSIONS: Record<Role, Partial<Record<Resource, Action[]>>> = {
	ADMIN: {
		dashboard: ["read"],
		jobVacant: ["create", "read", "update", "delete", "publish", "sync"],
		careerPath: ["create", "read", "update", "delete"],
		questionnaire: ["read", "update"],
		form: ["read"],
		employee: ["create", "read", "update", "delete", "upload"],
		position: ["create", "read", "update", "delete"],
		department: ["read"],
		branch: ["read"],
		userManagement: ["create", "read", "update", "delete"],
	},
	HR_BRANCH: {
		dashboard: ["read"],
		jobVacant: ["create", "read", "update", "delete", "publish"],
		careerPath: ["read"],
		questionnaire: ["read"],
		form: ["read"],
		employee: ["create", "read", "update", "delete"],
		position: ["create", "read", "update", "delete"],
		department: ["read"],
	},
	HD: {
		dashboard: ["read"],
		jobVacant: ["read"],
		careerPath: ["read"],
		questionnaire: ["read"],
		form: ["read"],
		employee: ["read"],
		position: ["read"],
	},
	EMPLOYEE: {
		dashboard: ["read"],
		form: ["create", "update", "read"],
		questionnaire: ["answer", "read"],
		jobVacant: ["read", "apply"],
	},
};
