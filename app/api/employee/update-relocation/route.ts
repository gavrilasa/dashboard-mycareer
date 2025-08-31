import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { z } from "zod";

const relocationSchema = z.object({
	isWillingToRelocate: z.boolean(),
});

export const POST = withAuthorization(
	{ resource: "jobVacant", action: "apply" }, // Menggunakan permission yang relevan
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
			const parsedData = relocationSchema.parse(body);

			// Gunakan upsert untuk membuat atau memperbarui CareerPreference
			await prisma.careerPreference.upsert({
				where: { employeeId },
				create: {
					employeeId,
					isWillingToRelocate: parsedData.isWillingToRelocate,
				},
				update: {
					isWillingToRelocate: parsedData.isWillingToRelocate,
				},
			});

			return NextResponse.json(
				{ message: "Preferensi relokasi berhasil disimpan." },
				{ status: 200 }
			);
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({ errors: error.flatten() }, { status: 400 });
			}
			console.error("Error updating relocation preference:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
