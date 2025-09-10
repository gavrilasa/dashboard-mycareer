// components/employee/dashboard/ActionCard.tsx
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface ActionCardProps {
	title: string;
	description: string;
	buttonText: string;
	href: string;
}

export const ActionCard = ({
	title,
	description,
	buttonText,
	href,
}: ActionCardProps) => {
	return (
		<Card className="bg-yellow-50 border-yellow-200">
			<CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
				<div className="p-2 bg-yellow-100 rounded-full">
					<AlertTriangle className="w-6 h-6 text-yellow-600" />
				</div>
				<div>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<Button asChild className="w-full md:w-auto">
					<Link href={href}>
						{buttonText}
						<ArrowRight className="w-4 h-4 ml-2" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
};
