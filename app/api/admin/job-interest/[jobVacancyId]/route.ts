import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";

export async function GET(
	req: NextRequest,
	{ params }: { params: { idJV: string } }
) {
	const session = await auth();
	const { idJV } = await params;

	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Anda belum login" },
			{ status: 401 }
		);
	}
	if (session.user.role === "employee") {
		return NextResponse.json(
			{
				error: "Forbidden",
				message: "Anda tidak memiliki akses karena bukan seorang HR",
			},
			{ status: 403 }
		);
	}

	const JV = await prisma.jobVacancy.findUnique({
		where: {
			idJV: idJV,
		},
		include: {
			DataBranch: true,
			DataLevel: true,
			DataPosition: {
				include: {
					DataDepartment: true,
				},
			},
		},
	});

	const interestedEmp = await prisma.jobInterest.findMany({
		where: {
			idJV: idJV,
		},
		include: {
			karyawan: true,
		},
	});

	const returnedData = {
		...JV,
		personnelArea: JV?.DataBranch.namaBranch,
		personnelSubarea: JV?.DataPosition?.DataDepartment?.namaDepartment,
		position: JV?.DataPosition.namaPosition,
		levelPosition: JV?.DataLevel?.namaLevel || "Supervisor",
		interestedEmp: interestedEmp.map((e: any) => e.karyawan) || [],
	};

	return NextResponse.json({ data: returnedData }, { status: 200 });
}
