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
import { toast } from "sonner";

interface CareerPath {
	id: string;
	fromPosition: { name: string };
	toPosition: { name: string };
}

interface DeleteCareerPathAlertProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	pathToDelete: CareerPath | null;
	onSuccess: () => void;
}

export function DeleteCareerPathAlert({
	open,
	onOpenChange,
	pathToDelete,
	onSuccess,
}: DeleteCareerPathAlertProps) {
	const handleDelete = async () => {
		if (!pathToDelete) return;
		const promise = fetch(`/api/admin/career-path/${pathToDelete.id}`, {
			method: "DELETE",
		}).then(async (res) => {
			if (!res.ok && res.status !== 204) {
				throw new Error((await res.json()).message || "Gagal menghapus data.");
			}
		});

		toast.promise(promise, {
			loading: "Menghapus...",
			success: () => {
				onSuccess(); // Panggil fungsi onSuccess untuk refresh data
				return "Jenjang karier berhasil dihapus.";
			},
			error: (err) => err.message,
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
					<AlertDialogDescription>
						Tindakan ini akan menghapus jenjang karier dari{" "}
						<span className="font-semibold">
							{pathToDelete?.fromPosition.name}
						</span>{" "}
						ke{" "}
						<span className="font-semibold">
							{pathToDelete?.toPosition.name}
						</span>{" "}
						secara permanen.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Batal</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-red-600 hover:bg-red-700"
					>
						Hapus
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
