// components/employee/dashboard/InterestsCard.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";

interface CareerInterest {
	type: string;
	jobRoleName?: string | null;
}

interface InterestsCardProps {
	careerInterests: CareerInterest[];
}

const InterestRow = ({
	label,
	value,
}: {
	label: string;
	value?: string | null;
}) => (
	<div className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
		<span className="text-gray-600">{label}</span>
		<span className="font-semibold text-right text-primary">
			{value || "Belum Dipilih"}
		</span>
	</div>
);

export const InterestsCard = ({ careerInterests }: InterestsCardProps) => {
	const interestsMap = careerInterests.reduce((acc, interest) => {
		acc[interest.type] = interest.jobRoleName;
		return acc;
	}, {} as Record<string, string | null | undefined>);

	const isEmpty = careerInterests.length === 0;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center">
					<Target className="w-6 h-6 mr-3 text-primary" />
					<CardTitle>Minat Karir Anda</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				{isEmpty ? (
					<div className="text-center">
						<p className="mb-4 text-sm text-gray-600">
							Anda belum memilih minat karir. Tunjukkan aspirasi Anda agar dapat
							kami bantu wujudkan.
						</p>
						<Button asChild>
							<Link href="/job-vacant">
								Lihat Peluang Karir
								<ArrowRight className="w-4 h-4 ml-2" />
							</Link>
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						<InterestRow
							label="Sejalur (Jangka Pendek)"
							value={interestsMap["ALIGN_SHORT_TERM"]}
						/>
						<InterestRow
							label="Sejalur (Jangka Panjang)"
							value={interestsMap["ALIGN_LONG_TERM"]}
						/>
						<InterestRow
							label="Lintas Jalur (Jangka Pendek)"
							value={interestsMap["CROSS_SHORT_TERM"]}
						/>
						<InterestRow
							label="Lintas Jalur (Jangka Panjang)"
							value={interestsMap["CROSS_LONG_TERM"]}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
