// app/page.tsx
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") {
			return;
		}

		if (status === "authenticated") {
			if (session?.user?.role === "EMPLOYEE") {
				router.replace("/form");
			} else {
				router.replace("/admin");
			}
		} else {
			router.replace("/login");
		}
	}, [status, session, router]);

	return (
		<div className="flex items-center justify-center w-full min-h-screen">
			<Skeleton className="h-48 w-full max-w-md" />
		</div>
	);
}
