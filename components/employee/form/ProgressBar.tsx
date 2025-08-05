"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import React from "react";

interface ProgressBarProps {
	totalSteps: number;
	currentStep: number;
}

export function ProgressBar({ totalSteps, currentStep }: ProgressBarProps) {
	return (
		<Card className="shadow-sm">
			<CardContent className="py-0">
				<div className="flex items-center w-full">
					{Array.from({ length: totalSteps }, (_, index) => {
						const stepIndex = index + 1;
						const isCompleted = currentStep > stepIndex;
						const isCurrent = currentStep === stepIndex;
						const isLastStep = index === totalSteps - 1;

						return (
							<React.Fragment key={`progress-step-${stepIndex}`}>
								<div
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm transition-colors flex-shrink-0",
										isCompleted
											? "bg-primary text-primary-foreground"
											: isCurrent
											? "border-2 border-primary text-primary"
											: "bg-gray-200 text-gray-500"
									)}
								>
									{isCompleted ? <Check className="h-5 w-5" /> : stepIndex}
								</div>

								{!isLastStep && (
									<div
										className={cn(
											"h-1.5 flex-1 mx-2 transition-colors rounded-full",
											isCompleted ? "bg-primary" : "bg-gray-200"
										)}
									/>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
