// app/(auth)/login/page.tsx

"use client";

import React, { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function LoginContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	const [employeeId, setEmployeeId] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const res = await signIn("credentials", {
				redirect: false,
				employeeId,
				password,
				callbackUrl,
			});

			if (res?.error) {
				setError(res.error);
			} else if (res?.ok) {
				router.push(callbackUrl);
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
			console.log(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen lg:grid lg:grid-cols-2">
			<div className="flex items-center justify-center h-full p-6 py-12">
				<div className="w-full max-w-md mx-auto">
					<CardHeader className="px-0">
						<div className="mb-4">
							<Image
								src="https://res.cloudinary.com/dah2v3xbg/image/upload/v1754410463/IndofoodCBP-Logo-ND_s8xafd.webp"
								alt="Indofood CBP Noodle Division Logo"
								width={200}
								height={68}
								priority
							/>
						</div>
						<CardTitle className="text-3xl font-bold text-primary">
							Selamat Datang di <br /> My Career Journey
						</CardTitle>
						<CardDescription>
							Masukkan Nomor Induk Karyawan dan Kata Sandi untuk Masuk.
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<Card className="border-none shadow-none">
							<CardContent className="grid gap-4 p-0">
								<div className="grid gap-3">
									<Label htmlFor="employeeId">Nomor Induk Karyawan</Label>
									<Input
										id="employeeId"
										type="text"
										placeholder="NIK"
										required
										value={employeeId}
										onChange={(e) => setEmployeeId(e.target.value)}
										disabled={isLoading}
										className="py-5"
									/>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="password">Kata Sandi</Label>
									<Input
										id="password"
										type="password"
										placeholder="Masukkan Kata Sandi"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={isLoading}
										className="py-5"
									/>
								</div>
								{error && (
									<Alert variant="destructive">
										<AlertCircle className="w-4 h-4" />
										<AlertTitle>Gagal Masuk</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
							</CardContent>
							<CardFooter className="p-0 pt-4">
								<Button
									type="submit"
									size="lg"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading && (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									)}
									Masuk
								</Button>
							</CardFooter>
						</Card>
					</form>
				</div>
			</div>
			<div className="hidden lg:block">
				<div className="object-cover w-full h-full bg-center bg-cover bg-[url(https://res.cloudinary.com/dah2v3xbg/image/upload/v1754410772/authImage_1_it6mni.webp)] dark:brightness-[0.2] dark:grayscale" />
			</div>
		</div>
	);
}

// Komponen utama halaman sekarang menyediakan Suspense Boundary
export default function LoginPage() {
	return (
		<Suspense fallback={<Skeleton className="w-full h-screen" />}>
			<LoginContent />
		</Suspense>
	);
}
