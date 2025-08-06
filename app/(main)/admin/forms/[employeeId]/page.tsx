"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GkmRole, ProjectRole } from "@prisma/client";

// Import all section components
import { CareerHistorySection } from "@/components/admin/forms/sections/CareerHistorySection";
import { OrganizationHistorySection } from "@/components/admin/forms/sections/OrganizationHistorySection";
import { CommitteeHistorySection } from "@/components/admin/forms/sections/CommitteeHistorySection";
import { ProjectHistorySection } from "@/components/admin/forms/sections/ProjectHistorySection";
import { GkmSection } from "@/components/admin/forms/sections/GkmSection";
import { AccomplishmentSection } from "@/components/admin/forms/sections/AccomplishmentSection";
import { CareerPreferenceSection } from "@/components/admin/forms/sections/CareerPreferenceSection";

const projectRoles = Object.values(ProjectRole) as [string, ...string[]];
const gkmRoles = Object.values(GkmRole) as [string, ...string[]];

const formSchema = z.object({
	careerHistories: z.array(
		z.object({
			id: z.string().optional(),
			branchId: z.string().min(1, "Cabang wajib diisi"),
			departmentId: z.string().min(1, "Departemen wajib diisi"),
			positionId: z.string().min(1, "Posisi wajib diisi"),
			startDate: z.date(),
			endDate: z.date().optional().nullable(),
		})
	),
	organizationHistories: z.array(
		z.object({
			id: z.string().optional(),
			organization: z.string().min(1, "Nama organisasi wajib diisi"),
			role: z.string().min(1, "Jabatan wajib diisi"),
			startDate: z.date(),
			endDate: z.date().optional().nullable(),
		})
	),
	committeeHistories: z.array(
		z.object({
			id: z.string().optional(),
			eventName: z.string().min(1, "Nama acara wajib diisi"),
			role: z.string().min(1, "Peran wajib diisi"),
			year: z.number().int(),
		})
	),
	projectHistories: z.array(
		z.object({
			id: z.string().optional(),
			projectName: z.string().min(1, "Nama proyek wajib diisi"),
			role: z.enum(projectRoles),
			year: z.number().int(),
			description: z.string().optional().nullable(),
		})
	),
	gkmHistory: z.object({
		participationCount: z.number().int().min(0),
		highestRole: z.enum(gkmRoles),
	}),
	bestEmployeeScore: z.object({ count: z.number().int().min(0) }),
	careerPreference: z.object({
		preferredMentor: z.string().optional().nullable(),
		preferredTraining: z.string().optional().nullable(),
	}),
});
type FormValues = z.infer<typeof formSchema>;

interface MasterDataItem {
	id: string;
	name: string;
	branchId?: string;
	departmentId?: string;
}
interface MasterData {
	branches: MasterDataItem[];
	departments: MasterDataItem[];
	positions: MasterDataItem[];
}

export default function EditFormPage({
	params,
}: {
	params: { employeeId: string };
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [masterData, setMasterData] = useState<MasterData | null>(null);
	const [employeeName, setEmployeeName] = useState("");

	const methods = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			careerHistories: [],
			organizationHistories: [],
			committeeHistories: [],
			projectHistories: [],
			gkmHistory: { participationCount: 0, highestRole: "TIDAK_PERNAH" },
			bestEmployeeScore: { count: 0 },
			careerPreference: { preferredMentor: "", preferredTraining: "" },
		},
	});

	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			try {
				const [formRes, masterRes, employeeRes] = await Promise.all([
					fetch(`/api/admin/forms/${params.employeeId}`),
					fetch("/api/admin/master-data"),
					fetch(`/api/admin/employees/${params.employeeId}`),
				]);

				if (!formRes.ok) throw new Error("Gagal memuat data formulir.");
				if (!masterRes.ok) throw new Error("Gagal memuat data master.");
				if (!employeeRes.ok) throw new Error("Gagal memuat data karyawan.");

				const formData = await formRes.json();
				const masterDataJson = await masterRes.json();
				const employeeData = await employeeRes.json();

				setMasterData(masterDataJson);
				setEmployeeName(employeeData.fullName);

				const processedData = {
					...formData,
					careerHistories: formData.careerHistories.map(
						(h: { startDate: string; endDate: string | null }) => ({
							...h,
							startDate: new Date(h.startDate),
							endDate: h.endDate ? new Date(h.endDate) : null,
						})
					),
					organizationHistories: formData.organizationHistories.map(
						(h: { startDate: string; endDate: string | null }) => ({
							...h,
							startDate: new Date(h.startDate),
							endDate: h.endDate ? new Date(h.endDate) : null,
						})
					),
				};
				methods.reset(processedData);
			} catch (error) {
				toast.error("Gagal Memuat Data", {
					description: (error as Error).message,
				});
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [params.employeeId, methods]);

	const onSubmit = async (data: FormValues) => {
		const promise = fetch(`/api/admin/forms/${params.employeeId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error((await res.json()).message || "Gagal menyimpan data.");
			return res.json();
		});

		toast.promise(promise, {
			loading: "Menyimpan perubahan...",
			success: () => `Data untuk ${employeeName} berhasil diperbarui.`,
			error: (err) => err.message,
		});
	};

	if (isLoading) {
		return (
			<div className="p-10">
				<Skeleton className="h-screen w-full" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<Toaster position="top-center" richColors />
			<div className="space-y-4 mb-8">
				<Button variant="outline" asChild>
					<Link href="/admin/forms">
						<ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
					</Link>
				</Button>
				<h1 className="text-3xl font-bold">Edit Formulir: {employeeName}</h1>
				<p className="text-muted-foreground">
					Perbarui data riwayat dan preferensi untuk karyawan dengan ID:{" "}
					{params.employeeId}
				</p>
			</div>

			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
					<CareerHistorySection masterData={masterData} />
					<OrganizationHistorySection />
					<CommitteeHistorySection />
					<ProjectHistorySection />
					<GkmSection />
					<AccomplishmentSection />
					<CareerPreferenceSection />

					<div className="mt-10 flex items-center justify-end gap-x-6 border-t pt-6 sticky bottom-0 bg-white py-4">
						<Button type="button" variant="ghost" asChild>
							<Link href="/admin/forms">Batal</Link>
						</Button>
						<Button type="submit" disabled={methods.formState.isSubmitting}>
							{methods.formState.isSubmitting
								? "Menyimpan..."
								: "Simpan Perubahan"}
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
