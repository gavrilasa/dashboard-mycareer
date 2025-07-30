// app/login/page.tsx
"use client";

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

export default function LoginPage() {
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
		setError(null); // Reset error state on new submission

		try {
			const res = await signIn("credentials", {
				redirect: false,
				employeeId,
				password,
				callbackUrl,
			});

			if (res?.error) {
				setError("Login Failed. Please check your Employee ID and Password.");
			} else if (res?.ok) {
				router.push(callbackUrl);
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
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
								src="/IndofoodCBP-Logo-ND.webp"
								alt="Indofood CBP Noodle Division Logo"
								width={200}
								height={68}
								priority
							/>
						</div>
						<CardTitle className="text-3xl font-bold text-primary">
							Welcome to <br /> My Career Journey
						</CardTitle>
						<CardDescription>
							Enter your Employee ID and password to sign in!
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<Card className="border-none shadow-none">
							<CardContent className="grid gap-4 p-0">
								<div className="grid gap-3">
									<Label htmlFor="employeeId">Employee ID</Label>
									<Input
										id="employeeId"
										type="text"
										placeholder="Enter your employee ID"
										required
										value={employeeId}
										onChange={(e) => setEmployeeId(e.target.value)}
										disabled={isLoading}
										className="py-5"
									/>
								</div>
								<div className="grid gap-3">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="********"
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
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
							</CardContent>
							<CardFooter className="p-0">
								<Button
									type="submit"
									size="lg"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading && (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									)}
									Log In
								</Button>
							</CardFooter>
						</Card>
					</form>
				</div>
			</div>
			<div className="hidden lg:block">
				<div className="object-cover w-full h-full bg-center bg-cover bg-[url(/authImage.webp)] dark:brightness-[0.2] dark:grayscale" />
			</div>
		</div>
	);
}
