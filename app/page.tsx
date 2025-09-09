// app/page.tsx
"use client";

import Link from "next/link";

/**
 * Halaman utama yang menampilkan profil pengguna yang sedang login.
 */
export default function HomePage() {
	// Tampilkan pesan loading saat sesi sedang divalidasi
	if (status === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-lg text-gray-600">Memuat data sesi...</p>
			</div>
		);
	}

	// Jika pengguna belum login, arahkan ke halaman login
	if (status === "unauthenticated") {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
				<div className="p-10 text-center bg-white rounded-lg shadow-md">
					<h1 className="text-2xl font-bold text-gray-800">Akses Ditolak</h1>
					<p className="mt-2 text-gray-600">
						Anda harus login untuk melihat halaman ini.
					</p>
					<Link
						href="/login"
						className="inline-block mt-6 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
					>
						Ke Halaman Login
					</Link>
				</div>
			</div>
		);
	}

	return <></>;
}
