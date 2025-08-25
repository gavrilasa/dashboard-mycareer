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
		<div className="flex items-center justify-between mt-8">
			<Button
				type="button"
				variant="outline"
				onClick={onPrevious}
				disabled={currentStep === 0}
				className="cursor-pointer"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Sebelumnya
			</Button>

			<div className="flex-1 mx-4 md:mx-8">
				<Progress value={progressValue} />
			</div>

			{!isLastStep ? (
				<Button type="button" onClick={onNext} className="cursor-pointer">
					Selanjutnya
					<ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			) : (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							type="button"
							size="lg"
							disabled={formState.isSubmitting}
							className="cursor-pointer"
						>
							<Send className="w-4 h-4 mr-2" />
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
							<AlertDialogCancel className="cursor-pointer">
								Batal
							</AlertDialogCancel>
							<AlertDialogAction onClick={onSubmit} className="cursor-pointer">
								Ya, Kirim Jawaban
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
