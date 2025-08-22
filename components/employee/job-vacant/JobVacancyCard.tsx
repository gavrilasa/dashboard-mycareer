"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Definisikan tipe untuk props agar sesuai dengan data dari API
export interface Opportunity {
	id: string;
	title: string;
	description: string | null;
	branch: { name: string } | null;
	department: { name: string } | null;
	position: { name: string } | null;
}

interface JobVacancyCardProps {
	opportunity: Opportunity;
	onInterestClick: (opportunityId: string) => void;
	isSubmitting: boolean;
}

export function JobVacancyCard({
	opportunity,
	onInterestClick,
	isSubmitting,
}: JobVacancyCardProps) {
	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>{opportunity.position?.name || opportunity.title}</CardTitle>
				<CardDescription>
					{opportunity.department?.name} - {opportunity.branch?.name}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-sm text-muted-foreground">
					{opportunity.description || "Tidak ada deskripsi tambahan."}
				</p>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() => onInterestClick(opportunity.id)}
					disabled={isSubmitting}
				>
					Saya Tertarik
				</Button>
			</CardFooter>
		</Card>
	);
}
