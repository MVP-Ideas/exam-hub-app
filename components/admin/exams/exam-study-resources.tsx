import { Button } from '@/components/ui/button';
import { Link, UploadIcon } from 'lucide-react';

export default function ExamStudyResources() {
	return (
		<div className="flex w-full flex-col gap-4 bg-background p-5 rounded-lg border border-muted-foreground/20">
			<h2 className="text-lg font-bold">Study Resources</h2>

			<div className="border rounded-md p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-gray-100 p-2 rounded">
							<UploadIcon size={16} />
						</div>
						<div>
							<h4 className="text-sm font-medium">Upload Study Materials</h4>
							<p className="text-xs text-gray-500">
								Image, PDFs, slides, documents (max 50MB)
							</p>
						</div>
					</div>
					<Button variant="outline" size="sm">
						Upload
					</Button>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-gray-100 p-2 rounded">
							<Link size={16} />
						</div>
						<div>
							<h4 className="text-sm font-medium">Add External Links</h4>
							<p className="text-xs text-gray-500">
								Reference websites, videos, articles
							</p>
						</div>
					</div>
					<Button variant="outline" size="sm">
						Add link
					</Button>
				</div>
			</div>
		</div>
	);
}
