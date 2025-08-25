// components/employee/questionnaire/QuestionnaireNavigation.tsx

"use client";

import { Button } from "@/components/ui/button";
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
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface QuestionnaireNavigationProps {
	currentStep: number;
	totalSteps: number;
	isLastStep: boolean;
	onNext: () => void;
	onPrevious: () => void;
	onSubmit: () => void;
}

export default function QuestionnaireNavigation({
	currentStep,
	totalSteps,
	isLastStep,
	onNext,
	onPrevious,
	onSubmit,
}: QuestionnaireNavigationProps) {
	const { formState } = useFormContext();
	const progressValue =
		totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

	return (
		<div className="mt-8 flex justify-between items-center">
			<Button
				type="button"
				variant="outline"
				onClick={onPrevious}
				disabled={currentStep === 0}
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Sebelumnya
			</Button>

			<div className="flex-1 mx-4 md:mx-8">
				<Progress value={progressValue} />
				<p className="text-sm text-center text-muted-foreground mt-2">
					Kompetensi {currentStep + 1} dari {totalSteps}
				</p>
			</div>

			{!isLastStep ? (
				<Button type="button" onClick={onNext}>
					Selanjutnya
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			) : (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" size="lg" disabled={formState.isSubmitting}>
							<Send className="mr-2 h-4 w-4" />
							Kirim Jawaban
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Konfirmasi Pengiriman</AlertDialogTitle>
							<AlertDialogDescription>
								Apakah Anda yakin ingin mengirim jawaban ini? Jawaban tidak
								dapat diubah setelah dikirim.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Batal</AlertDialogCancel>
							<AlertDialogAction onClick={onSubmit}>
								Ya, Kirim Jawaban
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
