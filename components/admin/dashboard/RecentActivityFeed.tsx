// components/admin/dashboard/RecentActivityFeed.tsx

"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, FileText, ClipboardCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale"; // Import locale for Indonesian time format

// --- Type Definitions ---
type ActivityType =
	| "NEW_EMPLOYEE"
	| "FORM_COMPLETED"
	| "QUESTIONNAIRE_COMPLETED";

interface Activity {
	id: string;
	type: ActivityType;
	timestamp: string;
	description: string;
	employeeName: string | null;
}

interface RecentActivityFeedProps {
	activities: Activity[];
	isLoading: boolean;
}

// --- Helper Components ---
const ActivityIcon = ({ type }: { type: ActivityType }) => {
	switch (type) {
		case "NEW_EMPLOYEE":
			return <UserPlus className="h-5 w-5 text-blue-500" />;
		case "FORM_COMPLETED":
			return <FileText className="h-5 w-5 text-green-500" />;
		case "QUESTIONNAIRE_COMPLETED":
			return <ClipboardCheck className="h-5 w-5 text-purple-500" />;
		default:
			return null;
	}
};

const LoadingSkeleton = () => (
	<div className="space-y-4">
		{[...Array(5)].map((_, i) => (
			<div key={i} className="flex items-center space-x-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-3 w-1/4" />
				</div>
			</div>
		))}
	</div>
);

// --- Main Component ---
export function RecentActivityFeed({
	activities,
	isLoading,
}: RecentActivityFeedProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Aktivitas Terbaru</CardTitle>
				<CardDescription>
					Daftar aktivitas terakhir yang terjadi di sistem.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<LoadingSkeleton />
				) : activities && activities.length > 0 ? (
					<div className="space-y-6">
						{activities.map((activity) => (
							<div key={activity.id} className="flex items-start space-x-4">
								<div className="flex-shrink-0 bg-slate-100 rounded-full p-2">
									<ActivityIcon type={activity.type} />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-gray-800 truncate">
										{activity.description}
									</p>
									<p className="text-xs text-gray-500">
										{formatDistanceToNow(new Date(activity.timestamp), {
											addSuffix: true,
											locale: id, // Use Indonesian locale
										})}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
						Tidak ada aktivitas terbaru.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
