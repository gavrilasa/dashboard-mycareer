import { getServerSession, type Session, type User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Mengambil session saat ini dari server.
 * Ini adalah fungsi utama untuk mendapatkan detail session di seluruh aplikasi.
 * @returns Promise yang resolve ke objek session atau null.
 */
export const auth = (): Promise<Session | null> => {
	return getServerSession(authOptions);
};

/**
 * Tipe spesifik untuk user yang digunakan dalam logika otorisasi.
 * Pastikan tipe User di next-auth.d.ts Anda memiliki properti ini.
 */
type UserForAuthorization = User & {
	role?: string | null;
	employeeId?: string | null;
};

/**
 * Memeriksa apakah seorang pengguna memiliki hak akses berdasarkan peran atau kepemilikan.
 * @param user Objek user dari session (session.user).
 * @param options Opsi untuk otorisasi.
 * @param options.allowedRoles Array berisi peran yang diizinkan.
 * @param options.targetEmployeeId ID dari resource karyawan yang sedang diakses.
 * @returns `true` jika diizinkan, sebaliknya `false`.
 */
export function isAuthorized(
	user: UserForAuthorization | undefined,
	options: {
		allowedRoles?: string[];
		targetEmployeeId?: string;
	}
): boolean {
	// Pengguna harus ada untuk bisa memiliki hak akses.
	if (!user?.role) {
		return false;
	}

	// Izinkan akses jika peran pengguna ada di dalam daftar peran yang diizinkan.
	if (options.allowedRoles && options.allowedRoles.includes(user.role)) {
		return true;
	}

	// Izinkan akses jika pengguna mengakses data miliknya sendiri.
	if (
		options.targetEmployeeId &&
		user.employeeId === options.targetEmployeeId
	) {
		return true;
	}

	// Tolak akses secara default.
	return false;
}
