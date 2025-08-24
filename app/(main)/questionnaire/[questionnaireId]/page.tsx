"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	useForm,
	FormProvider,
	ControllerRenderProps,
	FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	ArrowLeft,
	ArrowRight,
	AlertCircle,
	Send,
	Bold,
	Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
interface Question {
	id: string;
	text: string;
}
type GroupedQuestions = Record<string, Record<string, Question[]>>;
interface QuestionnaireData {
	id: string;
	title: string;
	description: string | null;
	groupedQuestions: GroupedQuestions;
	totalQuestions: number;
}
type FormValues = Record<string, string>;
type DynamicFormSchema = z.ZodObject<Record<string, z.ZodString>>;
type FontSize = "text-sm" | "text-base" | "text-lg";
type FontWeight = "font-normal" | "font-medium";

// --- Keterangan Content ---
const questionnaireInfo: Record<string, { title: string; points: string[] }> = {
	"Kuisioner Mapping Kompetensi Managerial OPR STAFF": {
		title: "Petunjuk Pengisian Kuesioner Manajerial (Staff)",
		points: [
			"Kuesioner ini bertujuan untuk memetakan kompetensi manajerial Anda.",
			"Pilihlah angka dari 1 (Sangat Tidak Sesuai) hingga 5 (Sangat Sesuai) yang paling menggambarkan diri Anda.",
			"Jawablah semua pertanyaan dengan jujur berdasarkan pengalaman dan kapabilitas Anda.",
		],
	},
	"Kuisioner Mapping Kompetensi Managerial SPV": {
		title: "Petunjuk Pengisian Kuesioner Manajerial (SPV)",
		points: [
			"Fokus kuesioner ini adalah kompetensi manajerial di level penyelia.",
			"Pilihlah skala 1-5 yang paling sesuai dengan perilaku dan kemampuan Anda dalam memimpin tim.",
			"Tidak ada jawaban benar atau salah. Kejujuran Anda sangat dihargai.",
		],
	},
	"Kuisioner Mapping Kompetensi Accounting": {
		title: "Petunjuk Pengisian Kuesioner Teknis (Akunting)",
		points: [
			"Kuesioner ini mengukur pemahaman dan keahlian teknis Anda di bidang akunting.",
			"Pilihlah skala 1-5 berdasarkan tingkat penguasaan Anda pada setiap pernyataan.",
			"Hasil ini akan digunakan untuk merancang program pengembangan yang relevan.",
		],
	},
	// Tambahkan keterangan untuk kuesioner lain di sini
};

// --- Helper Components ---

const FormattedQuestionLabel = ({
	text,
	fontSize,
	fontWeight,
}: {
	text: string;
	fontSize: FontSize;
	fontWeight: FontWeight;
}) => {
	const parts = text.split(";");
	return (
		<FormLabel
			className={cn(
				"flex flex-col items-start gap-2 leading-relaxed text-left",
				fontSize,
				fontWeight
			)}
		>
			{parts.map((part, index) => (
				<span key={index}>{part.trim()}</span>
			))}
		</FormLabel>
	);
};

const RatingScale = ({
	field,
}: {
	field: ControllerRenderProps<FormValues, string>;
}) => (
	<FormControl>
		<RadioGroup
			onValueChange={field.onChange}
			defaultValue={field.value}
			className="flex items-center pt-2"
		>
			{[1, 2, 3, 4, 5].map((value) => (
				<FormItem key={value}>
					<FormLabel
						htmlFor={`${field.name}-${value}`}
						className="flex flex-col items-center justify-center space-y-1 cursor-pointer px-4 py-2 rounded-md hover:bg-slate-100"
					>
						<FormControl>
							<RadioGroupItem
								value={String(value)}
								id={`${field.name}-${value}`}
							/>
						</FormControl>

						<span className="text-sm font-medium select-none">{value}</span>
					</FormLabel>
				</FormItem>
			))}
		</RadioGroup>
	</FormControl>
);

// --- Main Page Component ---
export default function FillQuestionnairePage() {
	const router = useRouter();
	const params = useParams();
	const questionnaireId = params.questionnaireId as string;

	const [data, setData] = useState<QuestionnaireData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formSchema, setFormSchema] = useState<DynamicFormSchema | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);

	const [fontSize, setFontSize] = useState<FontSize>("text-sm");
	const [fontWeight, setFontWeight] = useState<FontWeight>("font-normal");
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const form = useForm<FormValues>({
		resolver: formSchema ? zodResolver(formSchema) : undefined,
		mode: "onChange",
	});

	const {
		formState: { isDirty },
	} = form;

	useEffect(() => {
		if (!questionnaireId) return;
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const res = await fetch(
					`/api/employee/questionnaires/${questionnaireId}`
				);
				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.message || "Gagal memuat kuesioner.");
				}
				const questionnaireData: QuestionnaireData = await res.json();
				setData(questionnaireData);
				setIsInfoOpen(true);

				const shape: Record<string, z.ZodString> = {};
				Object.values(questionnaireData.groupedQuestions).forEach(
					(subCompetencies) => {
						Object.values(subCompetencies).forEach((questions) => {
							questions.forEach((q) => {
								shape[q.id] = z.string().min(1, { message: "Wajib diisi." });
							});
						});
					}
				);
				setFormSchema(z.object(shape) as DynamicFormSchema);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [questionnaireId]);

	const competencyKeys = useMemo(
		() => (data ? Object.keys(data.groupedQuestions) : []),
		[data]
	);
	const isLastStep = currentStep === competencyKeys.length - 1;
	const progressValue =
		competencyKeys.length > 0
			? ((currentStep + 1) / competencyKeys.length) * 100
			: 0;

	const handleBackClick = () => {
		if (isDirty) {
			setIsBackConfirmOpen(true);
		} else {
			router.back();
		}
	};

	const handleNext = async () => {
		const currentCompetencyKey = competencyKeys[currentStep];
		const subCompetencies = data?.groupedQuestions[currentCompetencyKey];
		if (!subCompetencies) return;

		const fieldsToValidate = Object.values(subCompetencies).flatMap(
			(questions) => questions.map((q) => q.id)
		);
		const isValid = await form.trigger(
			fieldsToValidate as FieldPath<FormValues>[]
		);

		if (isValid && !isLastStep) {
			setCurrentStep((prev) => prev + 1);
		} else if (!isValid) {
			toast.error("Validasi Gagal", {
				description: "Harap lengkapi semua jawaban pada halaman ini.",
			});
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const onSubmit = async (values: FormValues) => {
		const payload = {
			questionnaireId,
			answers: Object.entries(values).map(([questionId, value]) => ({
				questionId,
				value,
			})),
		};
		const promise = fetch("/api/employee/questionnaires/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (res) => {
			if (!res.ok)
				throw new Error(
					(await res.json()).message || "Gagal mengirim jawaban."
				);
			return res.json();
		});

		toast.promise(promise, {
			loading: "Mengirim jawaban Anda...",
			success: (data) => {
				setTimeout(() => {
					router.push("/questionnaire");
					setTimeout(
						() =>
							toast.success("Terima kasih!", {
								description: "Jawaban Anda telah berhasil diproses.",
							}),
						500
					);
				}, 1500);
				return data.message;
			},
			error: (err: Error) => err.message,
		});
	};

	if (isLoading || !data) {
		return (
			<div className="container mx-auto py-10">
				<Skeleton className="w-full h-96" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-10">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Gagal Memuat</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	const currentCompetencyKey = competencyKeys[currentStep];
	const currentSubCompetencies = data.groupedQuestions[currentCompetencyKey];
	const currentInfo = questionnaireInfo[data.title] || {
		title: "Keterangan",
		points: ["Tidak ada keterangan khusus untuk kuesioner ini."],
	};

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="container mx-auto py-10 space-y-6">
				<div className="flex justify-between items-center">
					<div className="flex-1">
						<Button
							variant="ghost"
							onClick={handleBackClick}
							className="mb-4 pl-1"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Kembali
						</Button>
						<h1 className="text-3xl font-bold">{data.title}</h1>
						<p className="text-muted-foreground">{data.description}</p>
					</div>
					<div className="flex items-center gap-2 bg-white border rounded-lg p-1 shadow-sm">
						<div className="flex items-center border-r pr-1">
							<Button
								variant={fontSize === "text-sm" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => setFontSize("text-sm")}
							>
								<Type className="!h-[0.875rem] !w-[0.875rem]" />
							</Button>
							<Button
								variant={fontSize === "text-base" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => setFontSize("text-base")}
							>
								<Type className="!h-4 !w-4" />
							</Button>
							<Button
								variant={fontSize === "text-lg" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => setFontSize("text-lg")}
							>
								<Type className="!h-[1.125rem] !w-[1.125rem]" />
							</Button>
						</div>

						<div className="border-r pr-1">
							<Button
								variant={fontWeight === "font-medium" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() =>
									setFontWeight((prev) =>
										prev === "font-normal" ? "font-medium" : "font-normal"
									)
								}
							>
								<Bold className="h-4 w-4" />
							</Button>
						</div>

						<Button
							variant="ghost"
							className="h-8"
							onClick={() => setIsInfoOpen(true)}
						>
							Keterangan
						</Button>
					</div>
				</div>

				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card>
							<CardHeader>
								<CardTitle>{currentCompetencyKey}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.entries(currentSubCompetencies).map(
									([subCompetency, questions]) => (
										<div
											key={subCompetency}
											className="space-y-2 p-4 border rounded-md bg-slate-50"
										>
											<h3 className="font-semibold text-base mb-4">
												{subCompetency}
											</h3>
											{questions.map((q) => (
												<FormField
													key={q.id}
													control={form.control}
													name={q.id}
													render={({ field }) => (
														<FormItem className="rounded-md">
															<FormattedQuestionLabel
																text={q.text}
																fontSize={fontSize}
																fontWeight={fontWeight}
															/>
															<RatingScale field={field} />
															<FormMessage />
														</FormItem>
													)}
												/>
											))}
										</div>
									)
								)}
							</CardContent>
						</Card>

						<div className="mt-8 flex justify-between items-center">
							<Button
								type="button"
								variant="outline"
								onClick={handlePrevious}
								disabled={currentStep === 0}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Sebelumnya
							</Button>

							<div className="flex-1 mx-4 md:mx-8">
								<Progress value={progressValue} />
								<p className="text-sm text-center text-muted-foreground mt-2">
									Kompetensi {currentStep + 1} dari {competencyKeys.length}
								</p>
							</div>

							{!isLastStep ? (
								<Button type="button" onClick={handleNext}>
									Selanjutnya
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							) : (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											type="button"
											size="lg"
											disabled={form.formState.isSubmitting}
										>
											<Send className="mr-2 h-4 w-4" />
											Kirim Jawaban
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Konfirmasi Pengiriman</AlertDialogTitle>
											<AlertDialogDescription>
												Apakah Anda yakin ingin mengirim jawaban ini? Jawaban
												tidak dapat diubah setelah dikirim.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Batal</AlertDialogCancel>
											<AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
												Ya, Kirim Jawaban
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</form>
				</FormProvider>
			</div>

			<AlertDialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
						<AlertDialogDescription>
							Anda sudah mengisi beberapa jawaban. Jika Anda kembali, semua
							progres pada kuesioner ini akan hilang.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							className={cn(buttonVariants({ variant: "destructive" }))}
							onClick={() => router.back()}
						>
							Ya, Kembali
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{currentInfo.title}</AlertDialogTitle>
						<AlertDialogDescription asChild>
							<ul className="list-disc space-y-2 pl-4 pt-2 text-sm">
								{currentInfo.points.map((point, index) => (
									<li key={index}>{point}</li>
								))}
							</ul>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction onClick={() => setIsInfoOpen(false)}>
							Saya Mengerti
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
