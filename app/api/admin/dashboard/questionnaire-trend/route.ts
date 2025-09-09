// app/api/admin/dashboard/questionnaire-trend/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthorization } from "@/lib/auth-hof";
import {
	startOfDay,
	endOfDay,
	subDays,
	parseISO,
	differenceInDays,
	eachWeekOfInterval,
	eachMonthOfInterval,
	format,
	startOfWeek,
} from "date-fns";

export const GET = withAuthorization(
	{ resource: "dashboard", action: "read" },
	async (req: NextRequest) => {
		try {
			const { searchParams } = new URL(req.url);

			// 1. Dapatkan rentang waktu dari query params, atau default 30 hari terakhir
			const endDateParam = searchParams.get("endDate");
			const startDateParam = searchParams.get("startDate");

			const endDate = endDateParam
				? endOfDay(parseISO(endDateParam))
				: endOfDay(new Date());
			const startDate = startDateParam
				? startOfDay(parseISO(startDateParam))
				: startOfDay(subDays(endDate, 29));

			// 2. Tentukan granularitas (mingguan atau bulanan)
			const dateDifference = differenceInDays(endDate, startDate);
			const granularity = dateDifference > 90 ? "monthly" : "weekly";

			// 3. Ambil data pengisian kuesioner dalam rentang waktu yang ditentukan
			const responses = await prisma.questionnaireResponse.findMany({
				where: {
					submittedAt: {
						gte: startDate,
						lte: endDate,
					},
				},
				select: {
					submittedAt: true,
				},
			});

			// 4. Agregasi data berdasarkan granularitas
			let trendData: { date: string; count: number }[];

			if (granularity === "weekly") {
				const weeks = eachWeekOfInterval(
					{ start: startDate, end: endDate },
					{ weekStartsOn: 1 } // Mulai minggu pada hari Senin
				);
				const weeklyCounts = new Map<string, number>();

				weeks.forEach((weekStart: Date) => {
					// Hapus 'W' dari format label
					const weekLabel = format(weekStart, "dd MMM");
					weeklyCounts.set(weekLabel, 0);
				});

				responses.forEach((res) => {
					const weekStart = startOfWeek(res.submittedAt, { weekStartsOn: 1 });
					// Hapus 'W' dari format label di sini juga
					const weekLabel = format(weekStart, "dd MMM");
					if (weeklyCounts.has(weekLabel)) {
						weeklyCounts.set(weekLabel, weeklyCounts.get(weekLabel)! + 1);
					}
				});

				trendData = Array.from(weeklyCounts.entries()).map(([date, count]) => ({
					date,
					count,
				}));
			} else {
				// Granularitas Bulanan
				const months = eachMonthOfInterval({ start: startDate, end: endDate });
				const monthlyCounts = new Map<string, number>();

				months.forEach((monthStart: Date) => {
					const monthLabel = format(monthStart, "MMMM yyyy");
					monthlyCounts.set(monthLabel, 0);
				});

				responses.forEach((res) => {
					const monthLabel = format(res.submittedAt, "MMMM yyyy");
					if (monthlyCounts.has(monthLabel)) {
						monthlyCounts.set(monthLabel, monthlyCounts.get(monthLabel)! + 1);
					}
				});

				trendData = Array.from(monthlyCounts.entries()).map(
					([date, count]) => ({
						date,
						count,
					})
				);
			}

			// 5. Kembalikan data yang sudah diformat
			return NextResponse.json(trendData);
		} catch (error) {
			console.error("Error fetching questionnaire trend data:", error);
			return NextResponse.json(
				{ message: "Terjadi kesalahan pada server." },
				{ status: 500 }
			);
		}
	}
);
