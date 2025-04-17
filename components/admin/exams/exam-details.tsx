'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { DIFFICULTY_OPTIONS } from '@/lib/constants/difficulty';
import { cn } from '@/lib/utils';
import useExamCategories from '@/hooks/exams/useExamCategories';
import { Control } from 'react-hook-form';
import { z } from 'zod';
import { createExamSchema } from '@/lib/stores/exam-store';

type FormValues = z.infer<typeof createExamSchema>;

export default function ExamDetails({
	control,
}: {
	control: Control<FormValues>;
}) {
	const { categories } = useExamCategories(true);

	return (
		<div className="flex flex-col gap-4 bg-background p-5 rounded-lg border border-muted-foreground/20">
			<h2 className="text-lg font-bold">Exam Details</h2>

			<FormField
				control={control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Exam Title</FormLabel>
						<FormControl>
							<Input
								className="bg-background"
								placeholder="Enter Exam Title"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea
								className="h-40 resize-none"
								placeholder="Enter Description"
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<div className="flex flex-row gap-4 w-full justify-between">
				<FormField
					control={control}
					name="category"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Category</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<button
											type="button"
											className={cn(
												'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value
												? categories?.find((c) => c.id === field.value)?.name
												: 'Select Category'}
											<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
										</button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									align="start"
									className="p-0 w-[var(--radix-popover-trigger-width)]"
								>
									<Command>
										<CommandInput placeholder="Search categories..." />
										<CommandEmpty>No category found.</CommandEmpty>
										<CommandGroup>
											{categories?.map((category) => (
												<CommandItem
													key={category.id}
													value={category.name}
													onSelect={() => field.onChange(category.id)}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															category.id === field.value
																? 'opacity-100'
																: 'opacity-0'
														)}
													/>
													{category.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="difficulty"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Difficulty</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Difficulty" />
									</SelectTrigger>
									<SelectContent>
										{DIFFICULTY_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="flex flex-row gap-4 w-full justify-between">
				<FormField
					control={control}
					name="timeLimit"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Time Limit (minutes)</FormLabel>
							<FormControl>
								<Input
									className="bg-background"
									type="number"
									placeholder="e.g. 60"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="passingScore"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Passing Score (%)</FormLabel>
							<FormControl>
								<Input
									className="bg-background"
									type="number"
									placeholder="e.g. 70"
									{...field}
									onChange={(e) => field.onChange(Number(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
