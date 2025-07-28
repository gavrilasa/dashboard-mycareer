// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const error = searchParams.get("error");

	const [employeeId, setEmployeeId] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);

		const res = await signIn("credentials", {
			redirect: false,
			employeeId: employeeId,
			password: password,
			callbackUrl,
		});

		if (res?.error) {
			setIsLoading(false);
			router.refresh();
		} else if (res?.ok) {
			router.push(callbackUrl);
		} else {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
				<h2 className="text-3xl font-bold text-center text-gray-900">
					MyCareer Login
				</h2>
				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* Input untuk ID Karyawan (Username) */}
					<div>
						<label
							htmlFor="employeeId"
							className="block text-sm font-medium text-gray-700"
						>
							ID Karyawan
						</label>
						<input
							id="employeeId"
							name="employeeId"
							type="text"
							required
							value={employeeId}
							onChange={(e) => setEmployeeId(e.target.value)}
							className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="Contoh: EMP001"
						/>
					</div>
					{/* Input untuk Password (ID + Tanggal Lahir) */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="ID Karyawan + Tanggal Lahir (DDMMYYYY)"
						/>
					</div>

					{error && (
						<div className="p-3 text-sm font-semibold text-red-800 bg-red-100 border border-red-300 rounded-md">
							Login Gagal. Periksa kembali ID Karyawan dan Password Anda.
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
						>
							{isLoading ? "Memproses..." : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
