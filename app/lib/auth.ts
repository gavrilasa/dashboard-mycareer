// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import { generatePassword } from "@/app/lib/utils/password"; // Asumsi ini fungsi Anda

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				nomorIndukKaryawan: { label: "NIK", type: "text" },
				tanggalLahir: { label: "Tanggal Lahir (YYYY-MM-DD)", type: "text" },
			},
			authorize: async (credentials) => {
				// Guard clause untuk memastikan credentials ada
				if (!credentials) {
					throw new Error("Kredensial tidak diberikan.");
				}

				const nik = credentials.nomorIndukKaryawan as string;
				const tanggalLahirInput = credentials.tanggalLahir as string; // Mengubah nama variabel

				if (!nik || !tanggalLahirInput) {
					throw new Error("NIK dan Tanggal Lahir diperlukan.");
				}

				// 1. Cari pengguna di database berdasarkan NIK
				const user = await prisma.user.findUnique({
					where: { nomorIndukKaryawan: nik },
					include: {
						DataKaryawan: {
							select: {
								tanggalLahir: true,
								personnelArea: true, // Untuk branch
								personnelSubarea: true, // Untuk dept
							},
						},
					},
				});

				if (!user) {
					throw new Error("NIK tidak ditemukan.");
				}

				// Cek jika data karyawan tidak ada atau tanggal lahir tidak ada
				if (!user.DataKaryawan || !user.DataKaryawan.tanggalLahir) {
					throw new Error("Data karyawan tidak lengkap.");
				}

				const dbTanggalLahir = user.DataKaryawan.tanggalLahir
					.toISOString()
					.split("T")[0]; // Format YYYY-MM-DD dari DB

				// 2. Verifikasi kata sandi
				const expectedPassword = generatePassword(nik, dbTanggalLahir);

				// Pastikan ini adalah perbandingan hash yang aman.
				// Jika generatePassword mengembalikan plain text, Anda perlu library hashing
				if (expectedPassword !== user.password) {
					throw new Error("NIK atau Tanggal Lahir salah.");
				}

				// 3. Jika autentikasi berhasil, kembalikan objek user
				// Pastikan nilai branch dan dept bisa undefined jika memang demikian dari DB
				return {
					id: user.nomorIndukKaryawan,
					name: user.name,
					email: user.email,
					role: user.role,
					nik: user.nomorIndukKaryawan,
					branch: user.DataKaryawan.personnelArea, // Ini akan menjadi string | undefined
					dept: user.DataKaryawan.personnelSubarea, // Ini akan menjadi string | undefined
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				// NextAuth.js User interface sekarang sudah diperbarui di next-auth.d.ts
				// sehingga properti ini akan sesuai
				token.role = user.role;
				token.nik = user.nik;
				token.branch = user.branch;
				token.dept = user.dept;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				// DefaultSession["user"] digabungkan dengan tipe kustom di next-auth.d.ts
				// Ini akan secara otomatis memiliki properti role, nik, branch, dept
				session.user.role = token.role as string; // Perlu assert as string karena tipe di token adalah string | undefined
				session.user.nik = token.nik as string; // Jika Anda yakin ini tidak akan pernah undefined
				session.user.branch = token.branch; // Tidak perlu assert lagi
				session.user.dept = token.dept; // Tidak perlu assert lagi
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/login",
	},
});
