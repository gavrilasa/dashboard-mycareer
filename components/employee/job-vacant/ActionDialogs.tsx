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
import Link from "next/link";

interface ConfirmationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	positionName: string;
	category: string;
}

export function ConfirmationDialog({
	open,
	onOpenChange,
	onConfirm,
	positionName,
	category,
}: ConfirmationDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Konfirmasi Minat Karier</AlertDialogTitle>
					<AlertDialogDescription>
						Apakah Anda yakin ingin memilih <strong>{positionName}</strong>{" "}
						sebagai minat karier Anda untuk kategori <strong>{category}</strong>
						?
						<br />
						<span className="mt-2 block font-semibold text-destructive">
							Pilihan ini tidak dapat diubah kembali.
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						Ya, Saya Yakin
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface FormIncompleteAlertProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function FormIncompleteAlert({
	open,
	onOpenChange,
}: FormIncompleteAlertProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Formulir Belum Lengkap</AlertDialogTitle>
					<AlertDialogDescription>
						Anda harus melengkapi Formulir Data Diri terlebih dahulu sebelum
						dapat menyatakan minat. Silakan lengkapi form Anda.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Tutup</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Link href="/form">Lengkapi Form</Link>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
