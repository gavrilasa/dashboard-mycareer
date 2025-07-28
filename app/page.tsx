// app/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

/**
 * Komponen untuk menampilkan satu baris informasi pengguna.
 */
function InfoRow({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) {
	return (
		<div className="flex justify-between py-3 border-b border-gray-200">
			<dt className="text-sm font-medium text-gray-500">{label}</dt>
			<dd className="text-sm font-semibold text-gray-900">
				{value || "Tidak ada"}
			</dd>
		</div>
	);
}

/**
 * Halaman utama yang menampilkan profil pengguna yang sedang login.
 */
export default function HomePage() {
	const { data: session, status } = useSession();

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

	// Jika pengguna sudah login, tampilkan semua informasi
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="p-6 bg-indigo-600">
					<h1 className="text-2xl font-bold text-white">Profil Pengguna</h1>
					<p className="text-indigo-200 mt-1">Informasi detail akun Anda.</p>
				</div>

				<div className="p-6">
					<dl>
						<InfoRow label="Nama Lengkap" value={session?.user?.name} />
						<InfoRow label="Email" value={session?.user?.email} />
						<InfoRow label="ID Karyawan" value={session?.user?.employeeId} />
						<InfoRow label="Role" value={session?.user?.role?.toUpperCase()} />
						<InfoRow label="ID Cabang" value={session?.user?.branchId} />
						<InfoRow
							label="ID Departemen"
							value={session?.user?.departmentId}
						/>
					</dl>
				</div>

				<div className="p-6 bg-gray-50 border-t border-gray-200">
					<button
						onClick={() => signOut({ callbackUrl: "/login" })}
						className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
