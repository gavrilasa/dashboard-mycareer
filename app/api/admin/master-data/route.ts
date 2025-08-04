import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import { Prisma } from "@prisma/client";

export const GET = withAuthorization(
	{ resource: "position", action: "read" },
	async (_req, { session }) => {
		try {
			const userRole = session?.user?.role;
			const userBranchId = session?.user?.branchId;
			const userDepartmentId = session?.user?.departmentId;

			let branchWhere: Prisma.BranchWhereInput = {};
			let departmentWhere: Prisma.DepartmentWhereInput = {};
			let positionWhere: Prisma.PositionWhereInput = {};
			const levelWhere: Prisma.LevelWhereInput = {};

			if (userRole === "HR_BRANCH") {
				branchWhere = { id: userBranchId };
				departmentWhere = { branchId: userBranchId };
				positionWhere = { branchId: userBranchId };
			} else if (userRole === "HD") {
				branchWhere = { id: userBranchId };
				departmentWhere = { id: userDepartmentId };
				positionWhere = { departmentId: userDepartmentId };
			}

			const [branches, departments, positions, levels] =
				await prisma.$transaction([
					prisma.branch.findMany({
						where: branchWhere,
						orderBy: { id: "asc" },
					}),
					prisma.department.findMany({
						where: departmentWhere,
						orderBy: { name: "asc" },
					}),
					prisma.position.findMany({
						where: positionWhere,
						orderBy: { name: "asc" },
					}),
					prisma.level.findMany({
						where: levelWhere,
						orderBy: { name: "asc" },
					}),
				]);

			return NextResponse.json({
				branches,
				departments,
				positions,
				levels,
			});
		} catch (error) {
			console.error("Error fetching master data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan internal pada server." },
				{ status: 500 }
			);
		}
	}
);
