"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import {
	GkmRole,
	ProjectRole,
	CareerHistory,
	OrganizationHistory,
} from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProgressBar } from "@/components/employee/form/ProgressBar";
import { CareerHistoryForm } from "@/components/employee/form/CareerHistoryForm";
import { OrganizationHistoryForm } from "@/components/employee/form/OrganizationHistoryForm";
import { CommitteeHistoryForm } from "@/components/employee/form/CommitteeHistoryForm";
import { ProjectHistoryForm } from "@/components/employee/form/ProjectHistoryForm";
import { GkmHistoryForm } from "@/components/employee/form/GkmHistoryForm";
import { AccomplishmentsForm } from "@/components/employee/form/AccomplishmentsForm";
import { CareerPreferenceForm } from "@/components/employee/form/CareerPreferenceForm";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserPositionProfile {
	branchId: string;
	departmentId: string;
	positionId: string;
}
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

type FetchedHistory = {
	startDate: string;
	endDate: string | null;
};

const projectRoles = Object.values(ProjectRole) as [string, ...string[]];
const gkmRoles = Object.values(GkmRole) as [string, ...string[]];

const formSchema = z.object({
	careerHistories: z.array(
		z.object({
			id: z.string().optional(),
			branchId: z.string().min(1, { message: "Cabang wajib diisi" }),
			departmentId: z.string().min(1, { message: "Departemen wajib diisi" }),
			positionId: z.string().min(1, { message: "Posisi wajib diisi" }),
			startDate: z.date().refine((d) => !isNaN(d.getTime()), {
				message: "Tanggal mulai wajib diisi dan valid",
			}),
			endDate: z.date().optional().nullable(),
		})
	),

	organizationHistories: z.array(
		z.object({
			id: z.string().optional(),
			organization: z
				.string()
				.min(1, { message: "Nama organisasi wajib diisi" }),
			role: z.string().min(1, { message: "Peran organisasi wajib diisi" }),
			startDate: z.date().refine((d) => !isNaN(d.getTime()), {
				message: "Tanggal mulai organisasi wajib dan valid",
			}),
			endDate: z.date().optional().nullable(),
		})
	),

	committeeHistories: z.array(
		z.object({
			id: z.string().optional(),
			eventName: z.string().min(1, { message: "Nama acara wajib diisi" }),
			role: z
				.string()
				.min(1, { message: "Peran dalam kepanitiaan wajib diisi" }),
			year: z.number().int().min(1900, { message: "Tahun minimal 1900" }),
		})
	),

	projectHistories: z.array(
		z.object({
			id: z.string().optional(),
			projectName: z.string().min(1, { message: "Nama proyek wajib diisi" }),
			role: z.enum(projectRoles, {
				message: "Peran proyek tidak valid",
			}),
			year: z
				.number()
				.int()
				.min(1900, { message: "Tahun proyek minimal 1900" }),
			description: z.string().optional().nullable(),
		})
	),

	gkmHistory: z.object({
		participationCount: z.number().int().min(0, {
			message: "Jumlah partisipasi minimal 0",
		}),
		highestRole: z.enum(gkmRoles, {
			message: "Peran GKM tidak valid",
		}),
	}),

	bestEmployeeScore: z.object({
		count: z.number().int().min(0, {
			message: "Jumlah penghargaan minimal 0",
		}),
	}),

	careerPreference: z.object({
		preferredMentor: z.string().optional().nullable(),
		preferredTraining: z.string().optional().nullable(),
	}),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
	{
		id: 1,
		name: "Riwayat Karier",
		component: CareerHistoryForm,
		fields: ["careerHistories"],
	},
	{
		id: 2,
		name: "Riwayat Organisasi",
		component: OrganizationHistoryForm,
		fields: ["organizationHistories"],
	},
	{
		id: 3,
		name: "Riwayat Kepanitiaan",
		component: CommitteeHistoryForm,
		fields: ["committeeHistories"],
	},
	{
		id: 4,
		name: "Riwayat Proyek",
		component: ProjectHistoryForm,
		fields: ["projectHistories"],
	},
	{
		id: 5,
		name: "Riwayat GKM",
		component: GkmHistoryForm,
		fields: ["gkmHistory"],
	},
	{
		id: 6,
		name: "Prestasi",
		component: AccomplishmentsForm,
		fields: ["bestEmployeeScore"],
	},
	{
		id: 7,
		name: "Preferensi Karier",
		component: CareerPreferenceForm,
		fields: ["careerPreference"],
	},
];

export default function EmployeeFormPage() {
	const [currentUserPosition, setCurrentUserPosition] =
		useState<UserPositionProfile | null>(null);
	const [currentStep, setCurrentStep] = useState(1);
	const [masterData, setMasterData] = useState<MasterData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
	const { reset } = methods;

	useEffect(() => {
		async function loadInitialData() {
			setIsLoading(true);
			try {
				const [masterDataRes, formDataRes] = await Promise.all([
					fetch("/api/employee/master-data"),
					fetch("/api/employee/form"),
				]);
				if (!masterDataRes.ok) throw new Error("Gagal memuat data master.");
				if (!formDataRes.ok) throw new Error("Gagal mengambil data riwayat.");

				const masterDataJson = await masterDataRes.json();
				const data = await formDataRes.json();
				setMasterData(masterDataJson);

				const hasExistingData =
					data.careerHistories?.length > 0 ||
					data.organizationHistories?.length > 0 ||
					data.committeeHistories?.length > 0 ||
					data.projectHistories?.length > 0 ||
					data.gkmHistory ||
					data.bestEmployeeScore ||
					data.careerPreference;
				if (hasExistingData) {
					setIsSubmitted(true);
					return;
				}

				const { branchId, departmentId, positionId, ...histories } = data;
				if (branchId && departmentId && positionId) {
					setCurrentUserPosition({ branchId, departmentId, positionId });
				}

				const processedFormData = {
					...histories,
					careerHistories:
						histories.careerHistories?.map(
							(h: CareerHistory & FetchedHistory) => ({
								...h,
								startDate: new Date(h.startDate),
								endDate: h.endDate ? new Date(h.endDate) : null,
							})
						) || [],
					organizationHistories:
						histories.organizationHistories?.map(
							(h: OrganizationHistory & FetchedHistory) => ({
								...h,
								startDate: new Date(h.startDate),
								endDate: h.endDate ? new Date(h.endDate) : null,
							})
						) || [],
				};
				reset(processedFormData);
			} catch (error) {
				toast.error("Gagal Memuat Data", {
					description: (error as Error).message,
				});
			} finally {
				setIsLoading(false);
			}
		}
		loadInitialData();
	}, [reset]);

	const handleNext = async () => {
		const fieldsToValidate = steps[currentStep - 1]
			.fields as (keyof FormValues)[];
		const isValid = await methods.trigger(fieldsToValidate);
		if (isValid) {
			if (currentStep < steps.length) {
				setCurrentStep((prev) => prev + 1);
			}
		} else {
			toast.error("Validasi Gagal", {
				description: "Harap periksa kembali isian Anda pada langkah ini.",
			});
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onFinalSubmit: SubmitHandler<FormValues> = async (data) => {
		const promise = fetch("/api/employee/form", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		}).then(async (res) => {
			if (!res.ok) throw new Error((await res.json()).message);
			return res.json();
		});

		toast.promise(promise, {
			loading: "Menyimpan semua data...",
			success: (res) => {
				setIsSubmitted(true);
				return res.message;
			},
			error: (err) => err.message,
		});
	};

	if (isLoading || !masterData) {
		return (
			<div className="container mx-auto py-10 space-y-8">
				<Skeleton className="h-12 w-1/3" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (isSubmitted) {
		return (
			<div className="container mx-auto py-10 flex items-center justify-center">
				<Card className="w-full max-w-lg text-center">
					<CardHeader>
						<div className="mx-auto bg-green-100 p-3 rounded-full">
							<CheckCircle className="h-10 w-10 text-green-600" />
						</div>
						<CardTitle className="mt-4 text-2xl">Terima Kasih!</CardTitle>
						<CardDescription>
							Anda telah berhasil mengisi formulir data diri. Data Anda telah
							kami simpan.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<Link href="/dashboard">Kembali ke Dashboard</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const CurrentFormComponent = steps[currentStep - 1].component;

	return (
		<FormProvider {...methods}>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Formulir Data Diri</h1>
					<p className="text-muted-foreground">
						Lengkapi data Anda langkah demi langkah.
					</p>
				</div>

				<form
					onSubmit={methods.handleSubmit(onFinalSubmit)}
					className="space-y-0"
				>
					<ProgressBar totalSteps={steps.length} currentStep={currentStep} />
					<div className="py-4">
						<CurrentFormComponent
							masterData={masterData}
							currentUserPosition={currentUserPosition}
							onSkip={handleNext}
						/>
					</div>
					<div className="mt-6 flex justify-between">
						<Button
							type="button"
							variant="outline"
							size="lg"
							onClick={handlePrevious}
							disabled={currentStep === 1}
							className="cursor-pointer gap-2"
						>
							<ChevronLeft /> Sebelumnya
						</Button>
						{currentStep < steps.length ? (
							<Button
								type="button"
								onClick={handleNext}
								className="cursor-pointer gap-2"
							>
								Selanjutnya <ChevronRight />
							</Button>
						) : (
							<Button
								size="lg"
								type="button"
								onClick={() => setIsConfirmOpen(true)}
								disabled={methods.formState.isSubmitting}
							>
								Simpan Semua Perubahan
							</Button>
						)}
					</div>
				</form>
			</div>

			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Konfirmasi Penyimpanan</AlertDialogTitle>
						<AlertDialogDescription>
							Apakah Anda yakin ingin menyimpan semua data ini? Setelah
							disimpan, data tidak dapat diubah kembali.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction onClick={methods.handleSubmit(onFinalSubmit)}>
							Ya, Saya Yakin dan Simpan
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</FormProvider>
	);
}
