// components/admin/forms/FormViewerDialog.tsx

"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
	GkmRole,
	CareerHistory,
	OrganizationHistory,
	CommitteeHistory,
	ProjectHistory,
} from "@prisma/client";

// --- Type Definitions ---
interface FullFormData {
	careerHistories: CareerHistory[];
	organizationHistories: OrganizationHistory[];
	committeeHistories: CommitteeHistory[];
	projectHistories: ProjectHistory[];
	gkmHistory: { participationCount: number; highestRole: GkmRole } | null;
	bestEmployeeScore: { count: number } | null;
	careerPreference: {
		preferredMentor: string | null;
		preferredTraining: string | null;
	} | null;
}

interface FormViewerDialogProps {
	isOpen: boolean;
	onClose: () => void;
	isLoading: boolean;
	formData: FullFormData | null;
	employeeInfo: { id: string; name: string } | null;
}

const InfoRow = ({
	label,
	value,
}: {
	label: string;
	value?: string | number | null;
}) => (
	<div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
		<dt className="text-sm font-medium leading-6 text-gray-500">{label}</dt>
		<dd className="mt-1 text-sm leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
			{value || "-"}
		</dd>
	</div>
);

const SectionTitle = ({ title }: { title: string }) => (
	<h3 className="text-lg font-semibold leading-7 text-gray-900 border-b pb-2 mb-4">
		{title}
	</h3>
);

export function FormViewerDialog({
	isOpen,
	onClose,
	isLoading,
	formData,
	employeeInfo,
}: FormViewerDialogProps) {
	const renderContent = () => {
		if (isLoading) return <Skeleton className="h-96 w-full" />;
		if (!formData)
			return (
				<p className="text-center text-gray-500 py-10">
					Data formulir tidak ditemukan atau belum diisi oleh karyawan.
				</p>
			);

		return (
			<div className="space-y-8">
				{/* --- Riwayat Karier --- */}
				<div>
					<SectionTitle title="Riwayat Karier Internal" />
					{formData.careerHistories?.length > 0 ? (
						formData.careerHistories.map((item) => (
							<div key={item.id} className="mb-4 pl-4 border-l-2">
								{/* Note: Branch, Department, and Position names would require a join in the API call. Displaying IDs for now. */}
								<InfoRow label="ID Posisi" value={item.positionId} />
								<InfoRow
									label="Tanggal Mulai"
									value={format(new Date(item.startDate), "dd MMMM yyyy")}
								/>
								<InfoRow
									label="Tanggal Selesai"
									value={
										item.endDate
											? format(new Date(item.endDate), "dd MMMM yyyy")
											: "Sekarang"
									}
								/>
							</div>
						))
					) : (
						<p className="text-sm text-gray-500">Tidak ada data.</p>
					)}
				</div>

				{/* --- Riwayat Organisasi --- */}
				<div>
					<SectionTitle title="Riwayat Organisasi" />
					{formData.organizationHistories?.length > 0 ? (
						formData.organizationHistories.map((item) => (
							<div key={item.id} className="mb-4 pl-4 border-l-2">
								<InfoRow label="Nama Organisasi" value={item.organization} />
								<InfoRow label="Peran" value={item.role} />
								<InfoRow
									label="Tanggal Mulai"
									value={format(new Date(item.startDate), "dd MMMM yyyy")}
								/>
								<InfoRow
									label="Tanggal Selesai"
									value={
										item.endDate
											? format(new Date(item.endDate), "dd MMMM yyyy")
											: "Sekarang"
									}
								/>
							</div>
						))
					) : (
						<p className="text-sm text-gray-500">Tidak ada data.</p>
					)}
				</div>

				{/* --- Riwayat Kepanitiaan --- */}
				<div>
					<SectionTitle title="Riwayat Kepanitiaan" />
					{formData.committeeHistories?.length > 0 ? (
						formData.committeeHistories.map((item) => (
							<div key={item.id} className="mb-4 pl-4 border-l-2">
								<InfoRow label="Nama Acara" value={item.eventName} />
								<InfoRow label="Peran" value={item.role} />
								<InfoRow label="Tahun" value={item.year} />
							</div>
						))
					) : (
						<p className="text-sm text-gray-500">Tidak ada data.</p>
					)}
				</div>

				{/* --- Riwayat Proyek --- */}
				<div>
					<SectionTitle title="Riwayat Proyek" />
					{formData.projectHistories?.length > 0 ? (
						formData.projectHistories.map((item) => (
							<div key={item.id} className="mb-4 pl-4 border-l-2">
								<InfoRow label="Nama Proyek" value={item.projectName} />
								<InfoRow label="Peran" value={item.role} />
								<InfoRow label="Tahun" value={item.year} />
								<InfoRow label="Deskripsi" value={item.description} />
							</div>
						))
					) : (
						<p className="text-sm text-gray-500">Tidak ada data.</p>
					)}
				</div>

				{/* --- GKM & Prestasi --- */}
				<div>
					<SectionTitle title="GKM & Prestasi" />
					<InfoRow
						label="Partisipasi GKM"
						value={`${formData.gkmHistory?.participationCount || 0} kali`}
					/>
					<InfoRow
						label="Peran Tertinggi GKM"
						value={formData.gkmHistory?.highestRole.replace(/_/g, " ")}
					/>
					<InfoRow
						label="Karyawan Teladan"
						value={`${formData.bestEmployeeScore?.count || 0} kali`}
					/>
				</div>

				{/* --- Preferensi Karir --- */}
				<div>
					<SectionTitle title="Preferensi Karir" />
					<InfoRow
						label="Preferensi Mentor"
						value={formData.careerPreference?.preferredMentor}
					/>
					<InfoRow
						label="Kebutuhan Pelatihan"
						value={formData.careerPreference?.preferredTraining}
					/>
				</div>
			</div>
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Detail Formulir: {employeeInfo?.name}</DialogTitle>
					<DialogDescription>ID Karyawan: {employeeInfo?.id}</DialogDescription>
				</DialogHeader>
				<div className="py-4">{renderContent()}</div>
			</DialogContent>
		</Dialog>
	);
}
