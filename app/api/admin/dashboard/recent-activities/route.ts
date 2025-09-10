// app/api/admin/dashboard/recent-activities/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (_req: NextRequest) => {
		try {
			const activities = await prisma.activityLog.findMany({
				take: 8,
				orderBy: {
					timestamp: "desc",
				},
				include: {
					employee: {
						select: {
							fullName: true,
						},
					},
				},
			});

			// 2. Format data untuk konsistensi di frontend
			const formattedActivities = activities.map((activity) => ({
				id: activity.id,
				type: activity.type,
				timestamp: activity.timestamp,
				description: activity.description,
				employeeName: activity.employee?.fullName || null,
			}));

			return NextResponse.json(formattedActivities);
		} catch (error) {
			console.error("Error fetching recent activities:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
