"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RelocationCardProps {
	onSave: () => void; // Callback untuk me-refresh data setelah menyimpan
}

export function RelocationCard({ onSave }: RelocationCardProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSavePreference = async (isWilling: boolean) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/employee/update-relocation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isWillingToRelocate: isWilling }),
			});

			if (!response.ok) {
				throw new Error("Gagal menyimpan preferensi.");
			}

			toast.success("Preferensi Disimpan", {
				description: "Pilihan Anda telah berhasil disimpan.",
			});
			onSave(); // Panggil callback untuk refresh
		} catch (error) {
			toast.error("Gagal Menyimpan", {
				description:
					error instanceof Error ? error.message : "Terjadi kesalahan.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center w-full py-10">
			<Card className="w-full max-w-lg text-center">
				<CardHeader>
					<CardTitle className="text-2xl">
						Selamat Datang di Job Vacant
					</CardTitle>
					<CardDescription>
						Sebelum melanjutkan, harap informasikan kesediaan Anda untuk
						penempatan di luar kota/cabang. Pilihan ini akan memengaruhi alur
						pemilihan minat karier Anda.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="font-semibold">Apakah Anda bersedia untuk relokasi?</p>
				</CardContent>
				<CardFooter className="grid grid-cols-2 gap-4">
					<Button
						variant="outline"
						size="lg"
						onClick={() => handleSavePreference(false)}
						disabled={isLoading}
					>
						Tidak
					</Button>
					<Button
						size="lg"
						onClick={() => handleSavePreference(true)}
						disabled={isLoading}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Ya, Saya Bersedia
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
