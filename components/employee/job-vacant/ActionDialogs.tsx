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

// Komponen ConfirmationDialog tidak perlu diubah
export function ConfirmationDialog({
	open,
	onOpenChange,
	onConfirm,
	positionName,
	category,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	positionName: string;
	category: string;
}) {
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
					{/* FIX: Menggunakan pesan yang lebih general */}
					<AlertDialogDescription>
						Anda harus melengkapi Formulir Data Diri dan Kuesioner terlebih
						dahulu sebelum dapat menyatakan minat. Silakan lengkapi data Anda.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="grid-cols-1 gap-2 sm:flex">
					<AlertDialogCancel>Tutup</AlertDialogCancel>
					{/* Tombol-tombol aksi tetap ditampilkan secara dinamis */}
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
