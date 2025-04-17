import { Checkbox } from '@/components/ui/checkbox';
import { EyeIcon, TestTube, TimerIcon } from 'lucide-react';

const settings = [
	{
		title: 'Time Limit Enforcement',
		description: 'Enforce time limit for the exam.',
		icon: <TimerIcon />,
	},
	{
		title: 'Show Results Immediately',
		description: 'Results will be shown immediately after the exam.',
		icon: <EyeIcon />,
	},
	{
		title: 'Randomize Questions',
		description: 'Questions will be presented in a random order.',
		icon: <TestTube />,
	},
];

export default function ExamSettings() {
	return (
		<div className="flex flex-col gap-4 bg-background p-5 rounded-lg border border-muted-foreground/20">
			<h2 className="text-lg font-bold">Exam Settings</h2>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{settings.map((setting, index) => (
					<div
						key={index}
						className="border w-full p-2 rounded-lg flex flex-row justify-between gap-4 items-center"
					>
						<div className="bg-muted p-2 rounded-md">{setting.icon}</div>
						<div className="flex flex-col items-start flex-1">
							<h4 className="text-sm font-bold">{setting.title}</h4>
							<p className="text-xs text-muted-foreground">
								{setting.description}
							</p>
						</div>
						<Checkbox className="bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}
