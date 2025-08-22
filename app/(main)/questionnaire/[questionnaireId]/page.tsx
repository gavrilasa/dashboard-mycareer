"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { ArrowLeft, AlertCircle } from "lucide-react";

// Tipe data untuk struktur pertanyaan yang diterima dari API
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
// Definisikan tipe untuk nilai-nilai form
type FormValues = Record<string, string>;

// Definisikan tipe untuk schema yang akan dibuat secara dinamis
type DynamicFormSchema = z.ZodObject<Record<string, z.ZodString>>;

// Komponen untuk input skala 1-5 (dengan tipe yang benar)
const RatingScale = ({
	field,
}: {
	field: ControllerRenderProps<FormValues, string>;
}) => (
	<FormControl>
		<RadioGroup
			onValueChange={field.onChange}
			defaultValue={field.value}
			className="flex items-center space-x-4 pt-2"
		>
			{[1, 2, 3, 4, 5].map((value) => (
				<FormItem key={value} className="flex flex-col items-center space-y-2">
					<FormControl>
						<RadioGroupItem
							value={String(value)}
							id={`${field.name}-${value}`}
						/>
					</FormControl>
					<FormLabel
						htmlFor={`${field.name}-${value}`}
						className="cursor-pointer text-sm font-normal"
					>
						{value}
					</FormLabel>
				</FormItem>
			))}
		</RadioGroup>
	</FormControl>
);

export default function FillQuestionnairePage() {
	const router = useRouter();
	const params = useParams();
	const questionnaireId = params.questionnaireId as string;

	const [data, setData] = useState<QuestionnaireData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formSchema, setFormSchema] = useState<DynamicFormSchema | null>(null);

	const form = useForm<FormValues>({
		resolver: formSchema ? zodResolver(formSchema) : undefined,
	});

	// Efek untuk mengambil data kuesioner dan membangun skema validasi
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

				// Membuat skema validasi Zod secara dinamis
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
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Terjadi kesalahan yang tidak diketahui.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [questionnaireId]);

	const onSubmit = async (formData: FormValues) => {
		const payload = {
			questionnaireId,
			answers: Object.entries(formData).map(([questionId, value]) => ({
				questionId,
				value,
			})),
		};

		const promise = fetch("/api/employee/questionnaires/submit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error(
					(await res.json()).message || "Gagal mengirim jawaban."
				);
			}
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

	if (isLoading) {
		return <Skeleton className="w-full h-96" />;
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Gagal Memuat</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<>
			<Toaster position="top-center" richColors />
			<div className="space-y-6">
				<div>
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mb-4 pl-1"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Kembali
					</Button>
					<h1 className="text-3xl font-bold">{data?.title}</h1>
					<p className="text-muted-foreground">{data?.description}</p>
				</div>

				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{data &&
							Object.entries(data.groupedQuestions).map(
								([competency, subCompetencies]) => (
									<Card key={competency}>
										<CardHeader>
											<CardTitle>{competency}</CardTitle>
										</CardHeader>
										<CardContent className="space-y-6">
											{Object.entries(subCompetencies).map(
												([subCompetency, questions]) => (
													<div
														key={subCompetency}
														className="space-y-4 p-4 border rounded-md"
													>
														<h3 className="font-semibold">{subCompetency}</h3>
														{questions.map((q) => (
															<FormField
																key={q.id}
																control={form.control}
																name={q.id}
																render={({ field }) => (
																	<FormItem className="p-3 rounded-md hover:bg-muted/50">
																		<FormLabel>{q.text}</FormLabel>
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
								)
							)}

						<div className="flex justify-end">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										type="button"
										size="lg"
										disabled={form.formState.isSubmitting}
									>
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
						</div>
					</form>
				</FormProvider>
			</div>
		</>
	);
}
