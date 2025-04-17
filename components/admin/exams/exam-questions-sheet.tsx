import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import {
	Edit,
	Link,
	MoveLeftIcon,
	PlusIcon,
	Trash2Icon,
	UploadIcon,
	XIcon,
} from 'lucide-react';

export default function ExamQuestionsSheet() {
	// Available question types
	const questionTypes = [
		{ value: 'multiple-choice', label: 'Multiple Choice' },
		{ value: 'drag-and-drop', label: 'Drag and Drop' },
		{ value: 'multiple-answers', label: 'Multiple Answers' },
	];

	// Sample questions data
	const [questions, setQuestions] = useState([
		{
			id: 1,
			title:
				'Which Azure service is used for hosting and managing serverless functions?',
			type: 'multiple-choice',
			points: 5,
			options: [
				'Azure Functions',
				'Azure Virtual Machines',
				'Azure Kubernetes Service',
				'Azure Logic Apps',
			],
			explanation:
				"Azure Functions is Microsoft's serverless compute service that enables you to run code triggered by events without provisioning or managing infrastructure.",
		},
		{
			id: 2,
			title: 'What is the primary purpose of Azure DevOps?',
			type: 'multiple-choice',
			points: 3,
			options: [
				'CI/CD and project management',
				'Virtual machine hosting',
				'Database management',
				'Network configuration',
			],
			explanation:
				'Azure DevOps provides developer services for allowing teams to plan work, collaborate on code development, and build and deploy applications.',
		},
		{
			id: 3,
			title: 'Which of the following best describes Azure Storage?',
			type: 'drag-and-drop',
			points: 4,
			options: [
				'A cloud solution for storing data in blobs, files, queues, and tables',
				'A managed database service',
				'A virtual machine storage service',
				'A backup service for on-premises data',
			],
			explanation:
				"Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios, providing highly available, secure, durable, and scalable storage for various data types.",
		},
	]);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const currentQuestion = questions[currentQuestionIndex];

	// State for current question editing
	const [questionText, setQuestionText] = useState(currentQuestion.title);
	const [questionType, setQuestionType] = useState(currentQuestion.type);
	const [options, setOptions] = useState(currentQuestion.options);
	const [explanation, setExplanation] = useState(currentQuestion.explanation);
	const [points, setPoints] = useState(currentQuestion.points);

	// Update form when changing questions
	const handleQuestionChange = (index) => {
		// Save current changes first
		saveCurrentQuestionChanges();

		// Then switch to new question
		setCurrentQuestionIndex(index);
		const question = questions[index];
		setQuestionText(question.title);
		setQuestionType(question.type);
		setOptions(question.options);
		setExplanation(question.explanation);
		setPoints(question.points);
	};

	// Save changes to current question
	const saveCurrentQuestionChanges = () => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex] = {
			...updatedQuestions[currentQuestionIndex],
			title: questionText,
			type: questionType,
			options: options,
			explanation: explanation,
			points: points,
		};
		setQuestions(updatedQuestions);
	};

	// Add a new question
	const addNewQuestion = () => {
		// Save current changes first
		saveCurrentQuestionChanges();

		// Add new question
		const newQuestion = {
			id: questions.length + 1,
			title: 'New question',
			type: 'multiple-choice',
			points: 1,
			options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			explanation: '',
		};

		setQuestions([...questions, newQuestion]);
		setCurrentQuestionIndex(questions.length);
		setQuestionText(newQuestion.title);
		setQuestionType(newQuestion.type);
		setOptions(newQuestion.options);
		setExplanation(newQuestion.explanation);
		setPoints(newQuestion.points);
	};

	// Helper function to get type label from value
	const getTypeLabel = (typeValue) => {
		const type = questionTypes.find((t) => t.value === typeValue);
		return type ? type.label : typeValue;
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="w-full">
					<Edit />
					Edit Questions
				</Button>
			</SheetTrigger>
			<SheetContent
				showClose={false}
				side="right"
				className="overflow-y-auto p-0 flex flex-row min-w-screen md:min-w-[90vw] lg:min-w-[60vw]"
			>
				{/* Sidebar for question navigation */}
				<div className="w-64 bg-muted/50 border-r min-h-screen overflow-y-auto">
					<div className="p-4">
						<SheetClose asChild className="mb-4">
							<Button
								variant="ghost"
								className="w-full text-left border"
								onClick={() => setCurrentQuestionIndex(0)}
							>
								<MoveLeftIcon />
								<p>Back to Exam</p>
							</Button>
						</SheetClose>
						<div className="space-y-1">
							{questions.map((question, index) => (
								<div
									key={question.id}
									className={cn(
										'w-full cursor-pointer text-left px-3 py-2 rounded-md text-sm',
										currentQuestionIndex === index
											? 'bg-primary/20 text-primary'
											: 'hover:bg-gray-200'
									)}
									onClick={() => handleQuestionChange(index)}
								>
									<div className="font-medium">Question {index + 1}</div>
									<div className="text-xs text-gray-500 truncate">
										{question.title}
									</div>
									<div className="text-xs text-gray-400">
										{getTypeLabel(question.type)} • {question.points} pts
									</div>
								</div>
							))}
						</div>
						<Button
							variant="outline"
							className="w-full mt-4 flex items-center justify-center gap-2 text-sm"
							onClick={addNewQuestion}
						>
							<PlusIcon />
							Add Question
						</Button>
					</div>
				</div>

				{/* Main content area */}
				<div className="flex-1 p-6 overflow-y-auto">
					<SheetHeader className="mb-6 p-0 flex flex-row gap-4 items-center justify-start">
						<SheetTitle className="text-xl">
							Question {currentQuestionIndex + 1}
						</SheetTitle>

						<Button variant="ghost">
							<Trash2Icon
								className="text-destructive"
								onClick={() => console.log('Delete question')}
								size={20}
							/>
						</Button>
					</SheetHeader>
					<div className="space-y-6">
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<h3 className="font-medium">Question Text</h3>
								<div className="flex items-center gap-4">
									{/* Question Type Select */}
									<div className="flex items-center">
										<Select
											value={questionType}
											onValueChange={(value) => setQuestionType(value)}
										>
											<SelectTrigger className="w-36 h-8 text-xs">
												<SelectValue placeholder="Question Type" />
											</SelectTrigger>
											<SelectContent>
												{questionTypes.map((type) => (
													<SelectItem
														key={type.value}
														value={type.value}
														className="text-sm"
													>
														{type.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Points Input */}
									<div className="flex items-center gap-1">
										<span className="text-xs text-gray-500">Points:</span>
										<Input
											type="number"
											value={points}
											onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
											className="w-14 h-8 text-xs text-right"
											min="0"
										/>
									</div>
								</div>
							</div>
							<Textarea
								value={questionText}
								onChange={(e) => setQuestionText(e.target.value)}
								className="min-h-24"
							/>
						</div>

						{/* Render different option formats based on question type */}
						<div className="space-y-2">
							<h3 className="font-medium">
								{questionType === 'multiple-choice'
									? 'Answer Options'
									: questionType === 'drag-and-drop'
										? 'Draggable Items'
										: 'Selectable Options'}
							</h3>

							<div className="border rounded-md">
								{questionType === 'multiple-choice' && (
									<RadioGroup className="p-1">
										{options.map((option, index) => (
											<div
												key={index}
												className="flex items-start border-b last:border-b-0 p-3 justify-center"
											>
												<div className="h-full justify-center flex flex-col">
													<RadioGroupItem
														value={`option-${index}`}
														id={`option-${index}`}
														className="mt-1"
													/>
												</div>

												<div className="ml-3 flex-1">
													<Input
														value={option}
														onChange={(e) => {
															const newOptions = [...options];
															newOptions[index] = e.target.value;
															setOptions(newOptions);
														}}
													/>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-500 h-8 w-8 p-0 ml-2"
													onClick={() => {
														const newOptions = options.filter(
															(_, i) => i !== index
														);
														setOptions(newOptions);
													}}
												>
													<XIcon />
												</Button>
											</div>
										))}
									</RadioGroup>
								)}

								{questionType === 'drag-and-drop' && (
									<div className="p-1">
										{options.map((option, index) => (
											<div
												key={index}
												className="flex items-start border-b last:border-b-0 p-3"
											>
												<div className="flex-shrink-0 mt-1 mr-3">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className="text-gray-400"
													>
														<line x1="8" y1="6" x2="21" y2="6"></line>
														<line x1="8" y1="12" x2="21" y2="12"></line>
														<line x1="8" y1="18" x2="21" y2="18"></line>
														<line x1="3" y1="6" x2="3.01" y2="6"></line>
														<line x1="3" y1="12" x2="3.01" y2="12"></line>
														<line x1="3" y1="18" x2="3.01" y2="18"></line>
													</svg>
												</div>
												<div className="flex-1">
													<Input
														value={option}
														onChange={(e) => {
															const newOptions = [...options];
															newOptions[index] = e.target.value;
															setOptions(newOptions);
														}}
													/>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-500 h-8 w-8 p-0 ml-2"
													onClick={() => {
														const newOptions = options.filter(
															(_, i) => i !== index
														);
														setOptions(newOptions);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<line x1="18" y1="6" x2="6" y2="18"></line>
														<line x1="6" y1="6" x2="18" y2="18"></line>
													</svg>
												</Button>
											</div>
										))}
									</div>
								)}

								{questionType === 'multiple-answers' && (
									<div className="p-1">
										{options.map((option, index) => (
											<div
												key={index}
												className="flex items-start border-b last:border-b-0 p-3"
											>
												<input
													type="checkbox"
													id={`option-${index}`}
													className="mt-1"
												/>
												<div className="ml-3 flex-1">
													<Input
														value={option}
														onChange={(e) => {
															const newOptions = [...options];
															newOptions[index] = e.target.value;
															setOptions(newOptions);
														}}
													/>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="text-gray-500 h-8 w-8 p-0 ml-2"
													onClick={() => {
														const newOptions = options.filter(
															(_, i) => i !== index
														);
														setOptions(newOptions);
													}}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<line x1="18" y1="6" x2="6" y2="18"></line>
														<line x1="6" y1="6" x2="18" y2="18"></line>
													</svg>
												</Button>
											</div>
										))}
									</div>
								)}
							</div>

							<Button
								variant="outline"
								className="w-full flex items-center justify-center gap-2 mt-2"
								onClick={() =>
									setOptions([...options, `Option ${options.length + 1}`])
								}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
								Add Option
							</Button>
						</div>

						<div className="space-y-2">
							<h3 className="font-medium">Explanation (Optional)</h3>
							<Textarea
								value={explanation}
								onChange={(e) => setExplanation(e.target.value)}
								className="min-h-24 border"
							/>
						</div>

						<div className="space-y-2">
							<h3 className="font-medium">Question Resources</h3>
							<div className="border rounded-md p-4 space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="bg-gray-100 p-2 rounded">
											<UploadIcon size={16} />
										</div>
										<div>
											<h4 className="text-sm font-medium">
												Upload Study Materials
											</h4>
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
											<h4 className="text-sm font-medium">
												Add External Links
											</h4>
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
					</div>
					<SheetFooter className="mt-6 p-0 flex flex-row justify-between">
						<div className="flex gap-2">
							<Button variant="outline" type="button">
								Reset
							</Button>
						</div>
						<SheetClose asChild>
							<Button type="submit" onClick={saveCurrentQuestionChanges}>
								Save Question
							</Button>
						</SheetClose>
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
}
