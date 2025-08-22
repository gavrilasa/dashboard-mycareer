import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { PathType, VacancyPeriod } from "@prisma/client";

// Urutan section harus sama persis dengan di endpoint status
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
			const employee = await prisma.employee.findUnique({
				where: { employeeId },
				select: { positionId: true },
			});

			if (!employee?.positionId) {
				return NextResponse.json(
					{ message: "Posisi karyawan saat ini tidak ditemukan." },
					{ status: 404 }
				);
			}

			// 1. Cari tahu section mana yang aktif
			const existingInterests = await prisma.jobInterest.findMany({
				where: { employeeId },
				select: { interestType: true, period: true },
			});

			let activeSection = null;
			for (const section of SECTIONS_ORDER) {
				const isCompleted = existingInterests.some(
					(cs) =>
						cs.interestType === section.interestType &&
						cs.period === section.period
				);
				if (!isCompleted) {
					activeSection = section;
					break;
				}
			}

			// Jika semua section sudah selesai, kembalikan array kosong
			if (!activeSection) {
				return NextResponse.json({ section: null, opportunities: [] });
			}

			// 2. Ambil semua CareerPath yang relevan untuk section aktif
			const relevantCareerPaths = await prisma.careerPath.findMany({
				where: {
					fromPositionId: employee.positionId,
					pathType: activeSection.interestType,
				},
				select: {
					toPositionId: true,
				},
			});

			const targetPositionIds = relevantCareerPaths.map(
				(path) => path.toPositionId
			);

			if (targetPositionIds.length === 0) {
				return NextResponse.json({
					section: activeSection,
					opportunities: [],
				});
			}

			// 3. Ambil semua JobVacancy yang cocok dengan CareerPath dan periode
			const opportunities = await prisma.jobVacancy.findMany({
				where: {
					isPublished: true,
					period: activeSection.period,
					positionId: {
						in: targetPositionIds,
					},
				},
				include: {
					position: { select: { name: true } },
					department: { select: { name: true } },
					branch: { select: { name: true } },
				},
			});

			return NextResponse.json({
				section: activeSection,
				opportunities,
			});
		} catch (error) {
			console.error("Error fetching job opportunities:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
