import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const interestSchema = z.object({
	jobVacancyId: z.string().cuid(),
});

export const POST = withAuthorization(
	{ resource: "jobVacant", action: "apply" },
	async (req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;
		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan." },
				{ status: 403 }
			);
		}

		try {
			const body = await req.json();
			const parsedData = interestSchema.parse(body);
			const { jobVacancyId } = parsedData;

			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: {
					position: { select: { jobRoleId: true } },
					gkmHistory: true,
					questionnaireResponses: { take: 1 },
				},
			});

			// --- FIX: Logika Pengecekan Cerdas ---
			const isFormComplete = !!employee?.gkmHistory;
			const isQuestionnaireComplete =
				(employee?.questionnaireResponses?.length ?? 0) > 0;

			if (!isFormComplete || !isQuestionnaireComplete) {
				return NextResponse.json(
					{
						message: "Profil Anda belum lengkap.",
						code: "PROFILE_INCOMPLETE",
						// Kirim detail bagian mana yang belum lengkap
						details: {
							form: !isFormComplete,
							questionnaire: !isQuestionnaireComplete,
						},
					},
					{ status: 403 }
				);
			}

			if (!employee.position?.jobRoleId) {
				return NextResponse.json(
					{ message: "Data posisi Anda tidak ditemukan." },
					{ status: 404 }
				);
			}

			const vacancy = await prisma.jobVacancy.findUnique({
				where: { id: jobVacancyId },
				select: { jobRoleId: true },
			});

			if (!vacancy) {
				return NextResponse.json(
					{ message: "Lowongan yang dipilih tidak valid." },
					{ status: 404 }
				);
			}

			const careerPath = await prisma.careerPath.findFirst({
				where: {
					fromJobRoleId: employee.position.jobRoleId,
					toJobRoleId: vacancy.jobRoleId,
				},
			});

			if (!careerPath) {
				return NextResponse.json(
					{
						message:
							"Tidak ditemukan jenjang karier yang valid untuk lowongan ini.",
					},
					{ status: 404 }
				);
			}

			const newInterest = await prisma.jobInterest.create({
				data: {
					employeeId: employeeId,
					jobVacancyId: jobVacancyId,
					interestType: careerPath.pathType,
					period: careerPath.period,
				},
			});

			return NextResponse.json(newInterest, { status: 201 });
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({ errors: error.flatten() }, { status: 400 });
			}
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				return NextResponse.json(
					{ message: "Anda sudah memilih minat untuk kategori ini." },
					{ status: 409 }
				);
			}

			console.error("Error creating job interest:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
