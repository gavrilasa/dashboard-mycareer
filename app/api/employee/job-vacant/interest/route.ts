import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Peta kuesioner teknis
const departmentToQuestionnaireMap: Record<string, string> = {
	"ADM-FA": "Kuisioner Mapping Kompetensi Accounting",
	"ADM-GM": "Kuisioner Mapping Kompetensi MFG",
	"ADM-HR": "Kuisioner Mapping Kompetensi HR",
	"MFG-MFG": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PPIC": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PROD": "Kuisioner Mapping Kompetensi MFG",
	"MFG-PURC": "Kuisioner Mapping Kompetensi MFG",
	"MFG-TECH": "Kuisioner Mapping Kompetensi MFG",
	"MFG-WRH": "Kuisioner Mapping Kompetensi MFG",
	"MKT-MKT": "Kuisioner Mapping Kompetensi Marketing",
	"MKT-SD": "Kuisioner Mapping Kompetensi Marketing",
	"RND-QCA": "Kuisioner Mapping Kompetensi MFG",
	"RND-RD": "Kuisioner Mapping Kompetensi MFG",
};

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
					departmentId: true,
					position: { select: { jobRoleId: true } },
					gkmHistory: true,
					questionnaireResponses: {
						select: { questionnaire: { select: { title: true } } },
					},
				},
			});

			if (
				!employee ||
				!employee.departmentId ||
				!employee.position?.jobRoleId
			) {
				return NextResponse.json(
					{ message: "Data profil Anda tidak lengkap." },
					{ status: 404 }
				);
			}

			// --- FIX: Logika Pengecekan Kuesioner yang Akurat ---
			const isFormComplete = !!employee.gkmHistory;

			const departmentCodeParts = employee.departmentId.split("-");
			const departmentShortCode =
				departmentCodeParts.length > 2
					? departmentCodeParts.slice(1).join("-")
					: employee.departmentId;
			const technicalQuestionnaireTitle =
				departmentToQuestionnaireMap[departmentShortCode];

			const requiredTitles = new Set([
				"Kuisioner Mapping Kompetensi Managerial OPR STAFF",
				"Kuisioner Mapping Kompetensi Managerial SPV",
				technicalQuestionnaireTitle,
			]);

			const submittedTitles = new Set(
				employee.questionnaireResponses.map((r) => r.questionnaire.title)
			);
			const isQuestionnaireComplete = [...requiredTitles].every((title) =>
				submittedTitles.has(title)
			);

			if (!isFormComplete || !isQuestionnaireComplete) {
				return NextResponse.json(
					{
						message: "Profil Anda belum lengkap.",
						code: "PROFILE_INCOMPLETE",
						details: {
							form: !isFormComplete,
							questionnaire: !isQuestionnaireComplete,
						},
					},
					{ status: 403 }
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
