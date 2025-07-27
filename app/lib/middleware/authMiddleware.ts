// app/middleware/authMiddleware.ts

// Mengimpor NextRequest dan NextResponse dari next/server untuk menangani permintaan dan respons HTTP.
import { NextRequest, NextResponse } from "next/server";
// Mengimpor fungsi auth dari file auth.ts di root proyek Anda.
// Fungsi ini digunakan untuk mendapatkan sesi pengguna yang sedang login.
import { auth } from "@/app/lib/auth";

// Mendefinisikan interface untuk opsi yang dapat diteruskan ke middleware requireAuth.
interface AuthOptions {
	// Array string yang berisi peran-peran yang diizinkan untuk mengakses route ini.
	// Contoh: ['hr', 'hd', 'employee']
	allowedRoles?: string[];
	// Boolean yang menunjukkan apakah karyawan diizinkan mengakses data mereka sendiri.
	// Ini relevan untuk route dinamis seperti /datakaryawan/[nomorIndukKaryawan].
	allowEmployeeSelfAccess?: boolean;
	// Nama parameter di URL yang berisi ID karyawan (misal: 'nomorIndukKaryawan').
	// Digunakan jika allowEmployeeSelfAccess adalah true.
	paramNameForEmployeeId?: string;
}

/**
 * Middleware untuk autentikasi dan otorisasi API route.
 * Memverifikasi sesi pengguna dan memeriksa izin berdasarkan peran.
 *
 * @param req Objek NextRequest yang mewakili permintaan HTTP masuk.
 * @param params Objek yang berisi parameter dinamis dari URL route (misal: { nomorIndukKaryawan: '12345' }).
 * @param options Opsi konfigurasi untuk middleware ini, termasuk peran yang diizinkan dan penanganan akses diri karyawan.
 * @returns NextResponse jika ada error (Unauthorized/Forbidden), atau null jika otorisasi berhasil.
 */
export async function requireAuth(
	req: NextRequest,
	params: { [key: string]: string | string[] | undefined }, // Parameter dinamis dari URL
	options?: AuthOptions
): Promise<NextResponse | null> {
	// Mendapatkan sesi pengguna saat ini.
	const session = await auth();

	// 1. Pemeriksaan Sesi Dasar: Memverifikasi apakah pengguna telah login.
	// Jika sesi tidak ada atau tidak ada user di sesi, kembalikan respons 401 Unauthorized.
	if (!session || !session.user) {
		return NextResponse.json(
			{ error: "Unauthorized", message: "Mohon login terlebih dahulu" },
			{ status: 401 }
		);
	}

	// Mengambil peran dan NIK dari sesi pengguna yang login.
	const userRole = session.user.role;
	const userNik = session.user.nik;

	// 2. Pemeriksaan Otorisasi Berdasarkan Peran (RBAC).
	// Jika opsi allowedRoles ditentukan DAN peran pengguna tidak termasuk dalam allowedRoles.
	if (options?.allowedRoles && !options.allowedRoles.includes(userRole)) {
		// Cek apakah opsi allowEmployeeSelfAccess diatur dan peran pengguna adalah 'employee'.
		if (
			options.allowEmployeeSelfAccess &&
			userRole === "employee" &&
			options.paramNameForEmployeeId
		) {
			// Mengambil nilai parameter dinamis yang diharapkan berisi NIK karyawan dari objek params.
			const requestedNik = params[options.paramNameForEmployeeId];

			// Memastikan requestedNik adalah string dan cocok dengan NIK pengguna yang login.
			if (typeof requestedNik === "string" && userNik === requestedNik) {
				// Karyawan diizinkan mengakses datanya sendiri, lanjutkan permintaan.
				return null;
			}
		}
		// Jika bukan akses diri yang diizinkan atau peran memang tidak diizinkan,
		// kembalikan respons 403 Forbidden.
		return NextResponse.json(
			{
				error: "Forbidden",
				message: "Anda tidak memiliki izin untuk mengakses resource ini.",
			},
			{ status: 403 }
		);
	}

	// Jika semua pemeriksaan lolos (pengguna terautentikasi dan terotorisasi),
	// kembalikan null untuk mengizinkan permintaan dilanjutkan ke route handler.
	return null;
}
