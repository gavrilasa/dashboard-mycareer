import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { GkmRole, ProjectRole } from "@prisma/client";
import { Role } from "@prisma/client";

interface HandlerArgs {
	session: {
		user?: {
			employeeId?: string | null;
			role?: Role;
		} | null;
	};
	whereClause: Record<string, unknown>;
}

const projectRoles = Object.values(ProjectRole) as [string, ...string[]];
const gkmRoles = Object.values(GkmRole) as [string, ...string[]];

const formSchema = z.object({
	careerHistories: z.array(
		z.object({
			id: z.string().optional(),
			branchId: z.string().min(1, { message: "Cabang wajib diisi" }),
			departmentId: z.string().min(1, { message: "Departemen wajib diisi" }),
			positionId: z.string().min(1, { message: "Posisi wajib diisi" }),
			startDate: z.string().min(1, { message: "Tanggal mulai wajib diisi" }),
			endDate: z.string().optional().nullable(),
		})
	),

	organizationHistories: z.array(
		z.object({
			id: z.string().optional(),
			organization: z
				.string()
				.min(1, { message: "Nama organisasi wajib diisi" }),
			role: z.string().min(1, { message: "Peran organisasi wajib diisi" }),
			startDate: z.string().min(1, {
				message: "Tanggal mulai organisasi wajib dan valid",
			}),
			endDate: z.string().optional().nullable(),
		})
	),

	committeeHistories: z.array(
		z.object({
			id: z.string().optional(),
			eventName: z.string().min(1, { message: "Nama acara wajib diisi" }),
			role: z
				.string()
				.min(1, { message: "Peran dalam kepanitiaan wajib diisi" }),
			year: z.number().int().min(1900, { message: "Tahun minimal 1900" }),
		})
	),

	projectHistories: z.array(
		z.object({
			id: z.string().optional(),
			projectName: z.string().min(1, { message: "Nama proyek wajib diisi" }),
			role: z.enum(projectRoles, {
				message: "Peran proyek tidak valid",
			}),
			year: z
				.number()
				.int()
				.min(1900, { message: "Tahun proyek minimal 1900" }),
			description: z.string().optional().nullable(),
		})
	),

	gkmHistory: z.object({
		participationCount: z.number().int().min(0, {
			message: "Jumlah partisipasi minimal 0",
		}),
		highestRole: z.enum(gkmRoles, {
			message: "Peran GKM tidak valid",
		}),
	}),

	bestEmployeeScore: z.object({
		count: z.number().int().min(0, {
			message: "Jumlah penghargaan minimal 0",
		}),
	}),

	careerPreference: z.object({
		preferredMentor: z.string().optional().nullable(),
		preferredTraining: z.string().optional().nullable(),
	}),
});

export const GET = withAuthorization(
	{ resource: "form", action: "read" },
	async (_req: NextRequest, { session }: HandlerArgs) => {
		try {
			const employeeId = session?.user?.employeeId;
			if (!employeeId) {
				return NextResponse.json(
					{ message: "Employee ID tidak ditemukan." },
					{ status: 403 }
				);
			}

			const data = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					branchId: true,
					departmentId: true,
					positionId: true,
					careerHistories: { orderBy: { startDate: "desc" } },
					organizationHistories: true,
					committeeHistories: true,
					projectHistories: true,
					gkmHistory: true,
					bestEmployeeScore: true,
					careerPreference: true,
				},
			});

			if (!data) {
				return NextResponse.json(
					{ message: "Data karyawan tidak ditemukan." },
					{ status: 404 }
				);
			}

			return NextResponse.json(data);
		} catch (error) {
			console.error("Error fetching employee form data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);

export const POST = withAuthorization(
	{ resource: "form", action: "update" },
	async (req: NextRequest, { session }: HandlerArgs) => {
		try {
			const employeeId = session?.user?.employeeId;
			if (!employeeId) {
				return NextResponse.json(
					{ message: "Employee ID tidak ditemukan." },
					{ status: 403 }
				);
			}

			const body = await req.json();

			const parsedData = formSchema.parse(body);

			await prisma.$transaction(async (tx) => {
				await tx.careerHistory.deleteMany({
					where: {
						employeeId,
						id: {
							notIn: parsedData.careerHistories
								.map((h) => h.id)
								.filter(Boolean) as string[],
						},
					},
				});
				await tx.organizationHistory.deleteMany({
					where: {
						employeeId,
						id: {
							notIn: parsedData.organizationHistories
								.map((h) => h.id)
								.filter(Boolean) as string[],
						},
					},
				});
				await tx.committeeHistory.deleteMany({
					where: {
						employeeId,
						id: {
							notIn: parsedData.committeeHistories
								.map((h) => h.id)
								.filter(Boolean) as string[],
						},
					},
				});
				await tx.projectHistory.deleteMany({
					where: {
						employeeId,
						id: {
							notIn: parsedData.projectHistories
								.map((h) => h.id)
								.filter(Boolean) as string[],
						},
					},
				});

				for (const history of parsedData.careerHistories) {
					const { id, ...data } = history;
					const processedData = {
						...data,
						startDate: new Date(`${data.startDate}T00:00:00.000Z`),
						endDate: data.endDate
							? new Date(`${data.endDate}T00:00:00.000Z`)
							: null,
					};
					await tx.careerHistory.upsert({
						where: { id: id || "" },
						create: { ...processedData, employeeId },
						update: processedData,
					});
				}

				for (const history of parsedData.organizationHistories) {
					const { id, ...data } = history;
					const processedData = {
						...data,
						startDate: new Date(`${data.startDate}T00:00:00.000Z`),
						endDate: data.endDate
							? new Date(`${data.endDate}T00:00:00.000Z`)
							: null,
					};
					await tx.organizationHistory.upsert({
						where: { id: id || "" },
						create: { ...processedData, employeeId },
						update: processedData,
					});
				}

				for (const history of parsedData.committeeHistories) {
					const { id, ...data } = history;
					await tx.committeeHistory.upsert({
						where: { id: id || "" },
						create: { ...data, employeeId },
						update: data,
					});
				}
				for (const history of parsedData.projectHistories) {
					const { id, ...data } = history;
					await tx.projectHistory.upsert({
						where: { id: id || "" },
						create: {
							...data,
							employeeId,
							role: data.role as ProjectRole,
						},
						update: {
							...data,
							role: data.role as ProjectRole,
						},
					});
				}

				await tx.gkmHistory.upsert({
					where: { employeeId },
					create: {
						...parsedData.gkmHistory,
						employeeId,
						highestRole: parsedData.gkmHistory.highestRole as GkmRole,
					},
					update: {
						...parsedData.gkmHistory,
						highestRole: parsedData.gkmHistory.highestRole as GkmRole,
					},
				});
				await tx.bestEmployeeScore.upsert({
					where: { employeeId },
					create: { ...parsedData.bestEmployeeScore, employeeId },
					update: parsedData.bestEmployeeScore,
				});
				await tx.careerPreference.upsert({
					where: { employeeId },
					create: { ...parsedData.careerPreference, employeeId },
					update: parsedData.careerPreference,
				});

				const employee = await tx.employee.findUnique({
					where: { employeeId },
					select: { fullName: true },
				});

				if (employee) {
					await tx.activityLog.create({
						data: {
							type: "FORM_COMPLETED",
							description: `${employee.fullName} telah menyelesaikan Formulir Data Diri.`,
							employeeId: employeeId,
						},
					});
				}
			});

			return NextResponse.json(
				{ message: "Data berhasil disimpan." },
				{ status: 200 }
			);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({ errors: error.flatten() }, { status: 400 });
			}
			console.error("Error saving employee form data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
