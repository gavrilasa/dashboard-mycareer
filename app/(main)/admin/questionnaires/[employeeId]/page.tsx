"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider, FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertCircle,
	ArrowLeft,
	Bold,
	Type,
	Baseline,
	CaseUpper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionnaireForm from "@/components/employee/questionnaire/QuestionnaireForm";
import QuestionnaireNavigation from "@/components/employee/questionnaire/QuestionnaireNavigation";
import InfoDialog from "@/components/employee/questionnaire/InfoDialog";
import BackConfirmDialog from "@/components/common/BackConfirmDialog";
import questionnaireInfo from "@/data/questionnaireInfo";

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

	const onSubmit = form.handleSubmit(async (values) => {
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
	});

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
	const infoKey = data.title.includes("Manajerial")
		? "Managerial"
		: "Kompetensi";
	const currentInfo = questionnaireInfo[infoKey];

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
								<Type className="h-4 w-4" />
							</Button>
							<Button
								variant={fontSize === "text-base" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => setFontSize("text-base")}
							>
								<Baseline className="h-4 w-4" />
							</Button>
							<Button
								variant={fontSize === "text-lg" ? "default" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => setFontSize("text-lg")}
							>
								<CaseUpper className="h-4 w-4" />
							</Button>
						</div>
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
					<form onSubmit={onSubmit}>
						<QuestionnaireForm
							currentCompetencyKey={currentCompetencyKey}
							subCompetencies={currentSubCompetencies}
							fontSize={fontSize}
							fontWeight={fontWeight}
						/>
						<QuestionnaireNavigation
							currentStep={currentStep}
							totalSteps={competencyKeys.length}
							isLastStep={isLastStep}
							onNext={handleNext}
							onPrevious={handlePrevious}
							onSubmit={onSubmit}
						/>
					</form>
				</FormProvider>
			</div>

			<BackConfirmDialog
				isOpen={isBackConfirmOpen}
				onOpenChange={setIsBackConfirmOpen}
				onConfirm={() => router.back()}
			/>
			<InfoDialog
				isOpen={isInfoOpen}
				onOpenChange={setIsInfoOpen}
				content={currentInfo}
			/>
		</>
	);
}
