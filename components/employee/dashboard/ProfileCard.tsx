// components/employee/dashboard/ProfileCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, Building, MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Profile {
	employeeId?: string;
	fullName?: string;
	position?: string;
	department?: string;
	branch?: string;
	contact?: {
		phone?: string | null;
		address?: string | null;
	};
}

interface ProfileCardProps {
	profile: Profile;
}

const InfoRow = ({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ElementType;
	label: string;
	value?: string | null;
}) => {
	if (!value) return null;
	return (
		<div className="flex items-start text-sm">
			<Icon className="w-4 h-4 mt-0.5 mr-3 text-gray-500 flex-shrink-0" />
			<div className="flex flex-col">
				<span className="text-gray-500">{label}</span>
				<span className="font-medium text-gray-800">{value}</span>
			</div>
		</div>
	);
};

export const ProfileCard = ({ profile }: ProfileCardProps) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center">
					<User className="w-6 h-6 mr-3 text-primary" />
					<div>
						<CardTitle className="text-xl">{profile.fullName}</CardTitle>
						<p className="text-sm text-muted-foreground">
							NIK: {profile.employeeId}
						</p>
					</div>
				</div>
			</CardHeader>
			{/* MODIFIKASI: Menambahkan kelas grid responsif */}
			<CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<InfoRow icon={Briefcase} label="Posisi" value={profile.position} />
				<InfoRow
					icon={Building}
					label="Departemen"
					value={profile.department}
				/>
				<InfoRow icon={MapPin} label="Cabang" value={profile.branch} />

				{/* Kontak akan tetap dalam satu kolom jika ada */}
				{(profile.contact?.phone || profile.contact?.address) && (
					<div className="col-span-1 lg:col-span-2">
						<Separator className="my-2" />
						<div className="grid grid-cols-1 gap-4 pt-2 lg:grid-cols-2 lg:gap-6">
							<InfoRow
								icon={Phone}
								label="Nomor Telepon"
								value={profile.contact.phone}
							/>
							<InfoRow
								icon={Mail}
								label="Alamat"
								value={profile.contact.address}
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
