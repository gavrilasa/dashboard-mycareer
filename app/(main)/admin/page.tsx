// app/(main)/admin/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "sonner";
import { Users, FileText, ClipboardCheck, Briefcase } from "lucide-react";
import { Role } from "@prisma/client";

// Impor tipe terpusat
import {
	KpiData,
	NameValueData,
	DateCountData,
	Activity,
} from "@/types/dashboard";

import { KpiCard } from "@/components/admin/dashboard/KpiCard";
import { DateRangeFilter } from "@/components/admin/dashboard/DateRangeFilter";
import { EmployeeDistributionChart } from "@/components/admin/dashboard/EmployeeDistributionChart";
import { QuestionnaireTrendChart } from "@/components/admin/dashboard/QuestionnaireTrendChart";
import { RelocationPieChart } from "@/components/admin/dashboard/RelocationPieChart";
import { RecentActivityFeed } from "@/components/admin/dashboard/RecentActivityFeed";

export default function DashboardPage() {
	const { data: session } = useSession();
	const [kpis, setKpis] = useState<KpiData | null>(null);
	// Gunakan tipe yang spesifik untuk setiap state
	const [distributionData, setDistributionData] = useState<NameValueData[]>([]);
	const [trendData, setTrendData] = useState<DateCountData[]>([]);
	const [relocationData, setRelocationData] = useState<NameValueData[]>([]);
	const [activities, setActivities] = useState<Activity[]>([]);

	const [loadingKpis, setLoadingKpis] = useState(true);
	const [loadingDistribution, setLoadingDistribution] = useState(true);
	const [loadingTrend, setLoadingTrend] = useState(true);
	const [loadingRelocation, setLoadingRelocation] = useState(true);
	const [loadingActivities, setLoadingActivities] = useState(true);

	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: new Date(new Date().setDate(new Date().getDate() - 29)),
		to: new Date(),
	});

	const fetchData = useCallback(async () => {
		setLoadingKpis(true);
		setLoadingDistribution(true);
		setLoadingTrend(true);
		setLoadingRelocation(true);
		setLoadingActivities(true);

		try {
			const startDate = dateRange.from.toISOString();
			const endDate = dateRange.to.toISOString();

			const [kpisRes, distributionRes, trendRes, relocationRes, activitiesRes] =
				await Promise.all([
					fetch("/api/admin/dashboard/kpis"),
					fetch("/api/admin/dashboard/employee-distribution"),
					fetch(
						`/api/admin/dashboard/questionnaire-trend?startDate=${startDate}&endDate=${endDate}`
					),
					fetch("/api/admin/dashboard/relocation-summary"),
					fetch("/api/admin/dashboard/recent-activities"),
				]);

			if (!kpisRes.ok) throw new Error("Gagal memuat KPI.");
			if (!distributionRes.ok)
				throw new Error("Gagal memuat data distribusi karyawan.");
			if (!trendRes.ok) throw new Error("Gagal memuat tren kuesioner.");
			if (!relocationRes.ok) throw new Error("Gagal memuat data relokasi.");
			if (!activitiesRes.ok) throw new Error("Gagal memuat aktivitas terbaru.");

			setKpis(await kpisRes.json());
			setDistributionData(await distributionRes.json());
			setTrendData(await trendRes.json());
			setRelocationData(await relocationRes.json());
			setActivities(await activitiesRes.json());
		} catch (error) {
			toast.error("Gagal Memuat Data Dasbor", {
				description:
					error instanceof Error ? error.message : "Terjadi kesalahan.",
			});
		} finally {
			setLoadingKpis(false);
			setLoadingDistribution(false);
			setLoadingTrend(false);
			setLoadingRelocation(false);
			setLoadingActivities(false);
		}
	}, [dateRange]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const userRole = session?.user?.role;
	const showDistributionChart =
		userRole === Role.ADMIN || userRole === Role.HR_BRANCH;

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-8 space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold">Dasbor Admin</h1>
						<p className="text-muted-foreground">
							Ringkasan data dan analitik sistem.
						</p>
					</div>
					<DateRangeFilter onDateChange={setDateRange} />
				</div>

				{/* KPI Cards */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<KpiCard
						title="Total Karyawan Aktif"
						value={kpis?.totalEmployees ?? 0}
						icon={Users}
						isLoading={loadingKpis}
					/>
					<KpiCard
						title="Total Form Terisi"
						value={kpis?.totalFormsCompleted ?? 0}
						icon={FileText}
						isLoading={loadingKpis}
					/>
					<KpiCard
						title="Total Kuesioner Selesai"
						value={kpis?.totalQuestionnaires ?? 0}
						icon={ClipboardCheck}
						isLoading={loadingKpis}
					/>
					<KpiCard
						title="Total Job Vacant Aktif"
						value={kpis?.totalVacancies ?? 0}
						icon={Briefcase}
						isLoading={loadingKpis}
					/>
				</div>

				{/* Charts & Activities Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Charts Section */}
					<div className="lg:col-span-2 space-y-6">
						{showDistributionChart && (
							<EmployeeDistributionChart
								data={distributionData}
								isLoading={loadingDistribution}
								title={
									userRole === Role.ADMIN
										? "Distribusi Karyawan per Cabang"
										: "Distribusi Karyawan per Departemen"
								}
								description={
									userRole === Role.ADMIN
										? "Jumlah absolut karyawan di setiap cabang."
										: "Jumlah absolut karyawan di setiap departemen pada cabang Anda."
								}
							/>
						)}
						<QuestionnaireTrendChart
							data={trendData}
							isLoading={loadingTrend}
						/>
					</div>

					{/* Side Section */}
					<div className="space-y-6">
						<RelocationPieChart
							data={relocationData}
							isLoading={loadingRelocation}
						/>
						<RecentActivityFeed
							activities={activities}
							isLoading={loadingActivities}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
