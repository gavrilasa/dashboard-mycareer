import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { PathType, VacancyPeriod } from "@prisma/client";

// Definisi urutan section/tahapan
const SECTIONS_ORDER: { interestType: PathType; period: VacancyPeriod }[] = [
	{ interestType: "ALIGN", period: "SHORT_TERM" },
	{ interestType: "ALIGN", period: "LONG_TERM" },
	{ interestType: "CROSS", period: "SHORT_TERM" },
	{ interestType: "CROSS", period: "LONG_TERM" },
];

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (_req: NextRequest, { session }) => {
		const employeeId = session?.user?.employeeId;

		if (!employeeId) {
			return NextResponse.json(
				{ message: "Employee ID tidak ditemukan." },
				{ status: 403 }
			);
		}

		try {
			// Ambil semua minat yang sudah dipilih oleh karyawan
			const existingInterests = await prisma.jobInterest.findMany({
				where: { employeeId },
				select: {
					interestType: true,
					period: true,
				},
			});

			const completedSections = existingInterests.map((interest) => ({
				interestType: interest.interestType,
				period: interest.period,
			}));

			// Tentukan section berikutnya yang harus diisi
			let nextSection = null;
			for (const section of SECTIONS_ORDER) {
				const isCompleted = completedSections.some(
					(cs) =>
						cs.interestType === section.interestType &&
						cs.period === section.period
				);
				if (!isCompleted) {
					nextSection = section;
					break;
				}
			}

			return NextResponse.json({
				completedSections,
				nextSection,
				isCompleted: nextSection === null,
			});
		} catch (error) {
			console.error("Error fetching job interest status:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
