// /app/api/admin/employees/sync/status/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

const statusSchema = z.object({
	jobId: z.string().uuid("Invalid Job ID format."),
});

export const GET = withAuthorization(
	{ resource: "employee", action: "upload" },
	async (req: NextRequest) => {
		try {
			const { searchParams } = new URL(req.url);
			const jobId = searchParams.get("jobId");

			const validation = statusSchema.safeParse({ jobId });

			if (!validation.success) {
				return NextResponse.json(
					{
						message: "Invalid Job ID provided.",
						errors: validation.error.issues,
					},
					{ status: 400 }
				);
			}

			const job = await prisma.syncProcess.findUnique({
				where: { jobId: validation.data.jobId },
			});

			if (!job) {
				return NextResponse.json(
					{ message: "Sync process not found." },
					{ status: 404 }
				);
			}

			return NextResponse.json({
				status: job.status,
				error: job.error,
			});
		} catch (error) {
			console.error("Error fetching sync status:", error);
			return NextResponse.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
);
