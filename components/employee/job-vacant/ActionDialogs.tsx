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
	incompleteDetails: {
		form: boolean;
		questionnaire: boolean;
	};
}

export function FormIncompleteAlert({
	open,
	onOpenChange,
	incompleteDetails,
}: FormIncompleteAlertProps) {
	const { form, questionnaire } = incompleteDetails;

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Profil Belum Lengkap</AlertDialogTitle>
					<AlertDialogDescription>
						Anda harus melengkapi data berikut sebelum dapat menyatakan minat:
						<ul className="list-disc pl-5 mt-2 space-y-1">
							{form && <li>Formulir Data Diri</li>}
							{questionnaire && <li>Kuesioner Kompetensi</li>}
						</ul>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="grid-cols-1 gap-2 sm:flex">
					<AlertDialogCancel>Tutup</AlertDialogCancel>
					{questionnaire && (
						<AlertDialogAction asChild>
							<Link href="/questionnaire">Isi Kuesioner</Link>
						</AlertDialogAction>
					)}
					{form && (
						<AlertDialogAction asChild>
							<Link href="/form">Lengkapi Form</Link>
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
