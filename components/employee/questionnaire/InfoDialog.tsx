// components/employee/questionnaire/InfoDialog.tsx

"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InfoDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	content: { title: string; points: string[] };
}

export default function InfoDialog({
	isOpen,
	onOpenChange,
	content,
}: InfoDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{content.title}</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<ul className="list-disc space-y-2 pl-4 pt-2 text-sm">
							{content.points.map((point, index) => (
								<li key={index}>{point}</li>
							))}
						</ul>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={() => onOpenChange(false)}>
						Saya Mengerti
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
