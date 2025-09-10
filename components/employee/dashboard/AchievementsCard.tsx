// components/employee/dashboard/AchievementsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import { GkmHistory, BestEmployeeScore } from "@prisma/client";

interface AchievementsCardProps {
	gkm: GkmHistory | null;
	bestEmployee: BestEmployeeScore | null;
}

const AchievementItem = ({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value: number | undefined;
}) => (
	<div className="flex flex-col items-center justify-center p-4 text-center bg-gray-50 rounded-lg">
		<Icon className="w-8 h-8 mb-2 text-primary" />
		<p className="text-2xl font-bold">{value || 0}</p>
		<p className="text-sm text-muted-foreground">{label}</p>
	</div>
);

export const AchievementsCard = ({
	gkm,
	bestEmployee,
}: AchievementsCardProps) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center">
					<Trophy className="w-6 h-6 mr-3 text-primary" />
					<CardTitle>Rekap Prestasi</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<AchievementItem
						icon={Award}
						label="Partisipasi GKM"
						value={gkm?.participationCount}
					/>
					<AchievementItem
						icon={Trophy}
						label="Karyawan Teladan"
						value={bestEmployee?.count}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
