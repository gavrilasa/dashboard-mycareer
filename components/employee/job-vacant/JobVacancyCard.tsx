"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface Opportunity {
	id: string;
	description: string | null;
	jobRole: { name: string } | null;
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
		<Card className="flex flex-col gap-2">
			<CardHeader>
				<CardTitle>{opportunity.jobRole?.name || "Tanpa Judul"}</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<p className="text-sm text-muted-foreground">
					{opportunity.description || "Tidak ada deskripsi tambahan."}
				</p>
			</CardContent>
			<CardFooter className="justify-end">
				<Button
					onClick={() => onInterestClick(opportunity.id)}
					disabled={isSubmitting}
				>
					Saya Tertarik
				</Button>
			</CardFooter>
		</Card>
	);
}
