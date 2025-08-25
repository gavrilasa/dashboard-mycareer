// components/common/BackConfirmDialog.tsx

"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: () => void;
}

export default function BackConfirmDialog({
	isOpen,
	onOpenChange,
	onConfirm,
}: BackConfirmDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Anda sudah membuat perubahan. Jika Anda kembali, semua progres pada
						halaman ini akan hilang.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction
						className={cn(buttonVariants({ variant: "destructive" }))}
						onClick={onConfirm}
					>
						Ya, Kembali
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
