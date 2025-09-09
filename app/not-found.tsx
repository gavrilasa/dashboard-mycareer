// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
			<Frown className="w-16 h-16 text-gray-500 mb-4" />
			<h1 className="text-3xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
			<p className="text-gray-600 max-w-md mb-6">
				Maaf, halaman yang kamu cari tidak tersedia.
			</p>
			<Link href="/">
				<Button className="cursor-pointer" size="lg">
					Kembali ke Beranda
				</Button>
			</Link>
		</div>
	);
}
