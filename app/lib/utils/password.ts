// utils/password.ts
import bcrypt from "bcryptjs"; // Anda perlu menginstal 'bcryptjs': npm install bcryptjs

export function generatePassword(nik: string, tanggalLahir: string): string {
	// Pastikan tanggalLahir dalam format YYYY-MM-DD
	const plainTextPassword = `${nik}${tanggalLahir}`;
	// Hashing password di sini.
	// Idealnya, password di DB juga sudah di-hash.
	// Untuk tujuan perbandingan di authorize, Anda perlu hash inputnya.
	// Atau, jika password di DB adalah plain text, ini sangat tidak aman.

	// Contoh sederhana (TIDAK UNTUK PRODUKSI JIKA PASSWORD DI DB TIDAK DI-HASH)
	// return plainTextPassword; // Ini jika password di DB juga plain text (SANGAT TIDAK AMAN)

	// Contoh dengan hashing (DIREKOMENDASIKAN)
	// Jika password di DB sudah di-hash, Anda perlu hash inputnya juga
	// atau menggunakan bcrypt.compare di auth.ts
	const salt = bcrypt.genSaltSync(10); // Gunakan salt yang sama atau simpan salt di DB
	return bcrypt.hashSync(plainTextPassword, salt);
}

// Fungsi untuk memverifikasi password (jika password di DB di-hash)
export async function verifyPassword(
	plainText: string,
	hashedPasswordFromDb: string
): Promise<boolean> {
	return bcrypt.compare(plainText, hashedPasswordFromDb);
}
