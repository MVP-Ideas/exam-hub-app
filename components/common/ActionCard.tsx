import { Button } from '../ui/button';

type Props = {
	logo: React.ReactNode;
	title: string;
	description: string;
	buttonText: string;
	onClick: () => void;
};

export default function ActionCard({
	logo,
	title,
	description,
	buttonText,
	onClick,
}: Props) {
	return (
		<div className="flex flex-row gap-4 w-full rounded-lg px-6 py-3 border border-primary/20 justify-between items-center">
			<div className="flex flex-row gap-4 items-center">
				<div className="bg-muted p-2 rounded-md">{logo}</div>
				<div className="flex flex-col items-start">
					<h1 className="text-sm font-bold">{title}</h1>
					<p className="text-xs text-muted-foreground">{description}</p>
				</div>
			</div>
			<Button
				type="button"
				onClick={onClick}
				variant="outline"
				className="w-fit"
			>
				{buttonText}
			</Button>
		</div>
	);
}
