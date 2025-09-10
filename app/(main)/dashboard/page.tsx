// app/(main)/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import {
	AlertCircle,
	History,
	Briefcase,
	Users,
	ClipboardList,
} from "lucide-react";
import { format } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ProfileCard } from "@/components/employee/dashboard/ProfileCard";
import { ActionCard } from "@/components/employee/dashboard/ActionCard";
import { InterestsCard } from "@/components/employee/dashboard/InterestsCard";
import { HistoryCard } from "@/components/employee/dashboard/HistoryCard";
import { AchievementsCard } from "@/components/employee/dashboard/AchievementsCard";
import {
	CareerHistory,
	CommitteeHistory,
	GkmHistory,
	OrganizationHistory,
	ProjectHistory,
	BestEmployeeScore,
} from "@prisma/client";

// --- Type Definitions ---
// Tipe baru untuk Riwayat Karir yang sudah dilengkapi nama
type CareerHistoryWithNames = CareerHistory & {
	id: string;
	positionName: string;
	departmentName: string;
};

interface DashboardData {
	profile: {
		employeeId?: string;
		fullName?: string;
		position?: string;
		department?: string;
		branch?: string;
		contact?: {
			phone?: string | null;
			address?: string | null;
		};
	};
	status: {
		isFormComplete: boolean;
		incompleteQuestionnaireCount: number;
	};
	careerInterests: {
		type: string;
		jobRoleName?: string | null;
	}[];
	histories: {
		career: CareerHistoryWithNames[]; // Gunakan tipe baru
		organization: (OrganizationHistory & { id: string })[];
		committee: (CommitteeHistory & { id: string })[];
		project: (ProjectHistory & { id: string })[];
	};
	achievements: {
		gkm: GkmHistory | null;
		bestEmployee: BestEmployeeScore | null;
	};
}

// --- Renderer Functions & Column Definitions for HistoryCard ---

// Career History (Diperbaiki)
const renderCareerHistoryItemMobile = (item: CareerHistoryWithNames) => (
	<div className="text-sm">
		{/* Gunakan positionName dan departmentName */}
		<p className="font-semibold">{item.positionName}</p>
		<p className="text-gray-600">{item.departmentName}</p>
		<p className="text-xs text-gray-400 mt-1">
			{format(new Date(item.startDate), "MMM yyyy")} -{" "}
			{item.endDate ? format(new Date(item.endDate), "MMM yyyy") : "Sekarang"}
		</p>
	</div>
);
const careerColumnsDesktop = [
	{ accessorKey: "positionName", header: "Posisi" },
	{ accessorKey: "departmentName", header: "Departemen" },
	{
		accessorKey: "period",
		header: "Periode",
		cell: (item: CareerHistory) =>
			`${format(new Date(item.startDate), "MMM yyyy")} - ${
				item.endDate ? format(new Date(item.endDate), "MMM yyyy") : "Sekarang"
			}`,
	},
];

// ... (sisa renderer dan kolom untuk riwayat lain tetap sama)

const renderOrgHistoryItemMobile = (item: OrganizationHistory) => (
	<div className="text-sm">
		<p className="font-semibold">
			{item.role} di {item.organization}
		</p>
		<p className="text-xs text-gray-400 mt-1">
			{format(new Date(item.startDate), "yyyy")} -{" "}
			{item.endDate ? format(new Date(item.endDate), "yyyy") : "Sekarang"}
		</p>
	</div>
);
const orgColumnsDesktop = [
	{ accessorKey: "organization", header: "Nama Organisasi" },
	{ accessorKey: "role", header: "Jabatan" },
	{
		accessorKey: "period",
		header: "Periode",
		cell: (item: OrganizationHistory) =>
			`${format(new Date(item.startDate), "yyyy")} - ${
				item.endDate ? format(new Date(item.endDate), "yyyy") : "Sekarang"
			}`,
	},
];

const renderCommitteeHistoryItemMobile = (item: CommitteeHistory) => (
	<div className="text-sm">
		<p className="font-semibold">
			{item.role} di {item.eventName}
		</p>
		<p className="text-xs text-gray-400 mt-1">Tahun {item.year}</p>
	</div>
);
const committeeColumnsDesktop = [
	{ accessorKey: "eventName", header: "Nama Acara" },
	{ accessorKey: "role", header: "Peran" },
	{ accessorKey: "year", header: "Tahun" },
];

const renderProjectHistoryItemMobile = (item: ProjectHistory) => (
	<div className="text-sm">
		<p className="font-semibold">
			{item.role} di Proyek {item.projectName}
		</p>
		<p className="text-xs text-gray-400 mt-1">Tahun {item.year}</p>
	</div>
);
const projectColumnsDesktop = [
	{ accessorKey: "projectName", header: "Nama Proyek" },
	{ accessorKey: "role", header: "Peran" },
	{ accessorKey: "year", header: "Tahun" },
];

// --- Main Page Component ---
export default function DashboardEmployeePage() {
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/employee/dashboard");
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Gagal memuat data dasbor.");
				}
				const data = await response.json();
				setDashboardData(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
				toast.error("Gagal Memuat Data", { description: error as string });
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
				<div className="lg:col-span-1 space-y-6">
					<Skeleton className="h-64 w-full" />
					<Skeleton className="h-56 w-full" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-6 px-4">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Terjadi Kesalahan</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!dashboardData) {
		return null;
	}

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-6 px-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-1 space-y-6 lg:sticky lg:top-12">
						<ProfileCard profile={dashboardData.profile} />
						<InterestsCard careerInterests={dashboardData.careerInterests} />
						<AchievementsCard
							gkm={dashboardData.achievements.gkm}
							bestEmployee={dashboardData.achievements.bestEmployee}
						/>
					</div>

					<div className="lg:col-span-2 space-y-6">
						{!dashboardData.status.isFormComplete && (
							<ActionCard
								title="Lengkapi Profil Anda"
								description="Data diri Anda belum lengkap. Mohon lengkapi untuk membuka semua fitur."
								buttonText="Lengkapi Formulir Data Diri"
								href="/form"
							/>
						)}
						{dashboardData.status.incompleteQuestionnaireCount > 0 && (
							<ActionCard
								title="Kuesioner Belum Diisi"
								description={`Anda memiliki ${dashboardData.status.incompleteQuestionnaireCount} kuesioner yang perlu diisi.`}
								buttonText="Isi Kuesioner Sekarang"
								href="/questionnaire"
							/>
						)}
						<HistoryCard
							title="Riwayat Karir"
							icon={Briefcase}
							items={dashboardData.histories.career}
							renderItemMobile={renderCareerHistoryItemMobile}
							columnsDesktop={careerColumnsDesktop}
						/>
						<HistoryCard
							title="Riwayat Organisasi"
							icon={Users}
							items={dashboardData.histories.organization}
							renderItemMobile={renderOrgHistoryItemMobile}
							columnsDesktop={orgColumnsDesktop}
						/>
						<HistoryCard
							title="Riwayat Kepanitiaan"
							icon={ClipboardList}
							items={dashboardData.histories.committee}
							renderItemMobile={renderCommitteeHistoryItemMobile}
							columnsDesktop={committeeColumnsDesktop}
						/>
						<HistoryCard
							title="Riwayat Proyek"
							icon={History}
							items={dashboardData.histories.project}
							renderItemMobile={renderProjectHistoryItemMobile}
							columnsDesktop={projectColumnsDesktop}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
