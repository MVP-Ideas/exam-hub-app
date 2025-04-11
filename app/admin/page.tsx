'use client';

import PlatformMetrics from '@/components/admin/landing/platform-metrics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { Edit, PlusCircle, Settings, Users } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
	const { user } = useAuthStore();

	return (
		<div className="flex flex-col lg:h-screen w-full p-10 gap-6">
			<div className="flex flex-col items-center md:flex-row justify-between w-full h-fit gap-4 md:items-start">
				<div>
					<h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
				</div>
				<div className="flex flex-row gap-4 items-center">
					<Badge className="bg-secondary px-6 py-2">
						<h1 className="font-bold">Admin Mode</h1>
					</Badge>
					<div className="flex flex-row gap-2 text-muted-foreground items-center cursor-pointer hover:bg-muted/20 p-2">
						<Settings size={20} />
						<p className="text-sm font-semibold hidden md:block">Settings</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row gap-4 items-center flex-wrap w-full justify-center md:justify-start">
				<Button variant="secondary" size="lg">
					<div className="flex flex-row gap-3 items-center">
						<PlusCircle size={20} />
						Create Exam
					</div>
				</Button>
				<Link
					href="/admin/exams"
					className="border border-primary/20 rounded-lg py-2 px-4 hover:bg-muted/20"
				>
					<div className="flex flex-row gap-3 items-center">
						<Edit size={16} />
						<p className="text-sm font-semibold">Edit Exam</p>
					</div>
				</Link>
				<Link
					href="/admin/learner-management"
					className="border border-primary/20 rounded-lg py-2 px-4 hover:bg-muted/20"
				>
					<div className="flex flex-row gap-3 items-center">
						<Users size={16} />
						<p className="text-sm font-semibold">Manage Users</p>
					</div>
				</Link>
			</div>
			<PlatformMetrics />
		</div>
	);
}
