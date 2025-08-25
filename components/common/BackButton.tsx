// components/common/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
	onClick?: () => void;
	className?: string;
}

export function BackButton({ onClick, className }: BackButtonProps) {
	const router = useRouter();

	const handleBackClick = () => {
		if (onClick) {
			onClick();
		} else {
			router.back();
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleBackClick}
			className={cn("bg-white shadow-sm rounded-md cursor-pointer", className)}
		>
			<ArrowLeft className="mr-2 h-4 w-4" />
			Kembali
		</Button>
	);
}
