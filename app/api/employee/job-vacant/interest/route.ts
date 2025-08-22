import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";
import { Prisma, PathType, VacancyPeriod } from "@prisma/client";

const interestSchema = z.object({
	jobVacancyId: z.string().cuid(),
	interestType: z.enum([PathType.ALIGN, PathType.CROSS]),
	period: z.enum([VacancyPeriod.SHORT_TERM, VacancyPeriod.LONG_TERM]),
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

			const formStatus = await prisma.gkmHistory.findUnique({
				where: { employeeId },
			});

			if (!formStatus) {
				return NextResponse.json(
					{
						message:
							"Anda harus melengkapi Formulir Data Diri terlebih dahulu sebelum dapat menyatakan minat.",
						code: "FORM_INCOMPLETE",
					},
					{ status: 403 }
				);
			}

			const newInterest = await prisma.jobInterest.create({
				data: {
					employeeId: employeeId,
					jobVacancyId: parsedData.jobVacancyId,
					interestType: parsedData.interestType,
					period: parsedData.period,
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
