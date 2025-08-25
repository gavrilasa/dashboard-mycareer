// components/employee/questionnaire/QuestionnaireForm.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ControllerRenderProps, useFormContext } from "react-hook-form";

// Types
type FormValues = Record<string, string>;
type FontSize = "text-sm" | "text-base" | "text-lg";
type FontWeight = "font-normal" | "font-medium";
interface Question {
	id: string;
	text: string;
}
interface QuestionnaireFormProps {
	currentCompetencyKey: string;
	subCompetencies: Record<string, Question[]>;
	fontSize: FontSize;
	fontWeight: FontWeight;
}

// Helper Components
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
		<div className="flex flex-row justify-between w-full gap-4">
			{parts.map((part, index) => (
				<span
					key={index}
					className={cn("flex-1 text-center", fontSize, fontWeight)}
				>
					{part.trim()}
				</span>
			))}
		</div>
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
			className="grid grid-cols-5 items-center pt-4 mt-4 border-t"
		>
			{[1, 2, 3, 4, 5].map((value) => (
				<FormItem key={value} className="flex justify-center">
					<FormLabel
						htmlFor={`${field.name}-${value}`}
						className="flex flex-col items-center justify-center space-y-2 cursor-pointer p-2 rounded-full w-12 h-12 hover:bg-slate-100"
					>
						<span className="text-sm font-normal select-none">{value}</span>
						<FormControl>
							<RadioGroupItem
								value={String(value)}
								id={`${field.name}-${value}`}
							/>
						</FormControl>
					</FormLabel>
				</FormItem>
			))}
		</RadioGroup>
	</FormControl>
);

// Main Component
export default function QuestionnaireForm({
	currentCompetencyKey,
	subCompetencies,
	fontSize,
	fontWeight,
}: QuestionnaireFormProps) {
	const { control } = useFormContext<FormValues>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{currentCompetencyKey}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{Object.entries(subCompetencies).map(([subCompetency, questions]) => (
					<div
						key={subCompetency}
						className="space-y-2 p-4 border rounded-md bg-slate-50"
					>
						<h3 className="font-semibold text-base mb-4">{subCompetency}</h3>
						{questions.map((q) => (
							<FormField
								key={q.id}
								control={control}
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
				))}
			</CardContent>
		</Card>
	);
}
