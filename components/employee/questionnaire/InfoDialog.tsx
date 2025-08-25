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
						<ul className="pt-2 pl-4 space-y-2 text-sm list-disc">
							{content.points.map((point, index) => (
								<li key={index} className="text-slate-600">
									{point}
								</li>
							))}
						</ul>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={() => onOpenChange(false)}
						className="cursor-pointer"
					>
						Saya Mengerti
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
