import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

interface HandlerContext {
	params: { jobVacancyId: string };
}

export const GET = withAuthorization(
	{ resource: "jobVacant", action: "read" },
	async (_req: NextRequest, _args, { params }: HandlerContext) => {
		try {
			const { jobVacancyId } = params;

			const interests = await prisma.jobInterest.findMany({
				where: {
					jobVacancyId: jobVacancyId,
				},
				include: {
					employee: {
						select: {
							employeeId: true,
							fullName: true,
							position: { select: { name: true } },
							department: { select: { name: true } },
							branch: { select: { name: true } },
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			// Format data agar lebih mudah dikonsumsi frontend
			const interestedEmployees = interests.map((interest) => ({
				...interest.employee,
				interestId: interest.id,
				appliedAt: interest.createdAt,
			}));

			return NextResponse.json(interestedEmployees);
		} catch (error) {
			console.error("Error fetching interested employees:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
