'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BeatLoader } from 'react-spinners';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import useSignUpUser from '@/hooks/auth/useSignUpUser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const signUpSchema = z
	.object({
		email: z
			.string()
			.nonempty({ message: 'Your email cannot be empty' })
			.email({ message: 'Invalid email address' }),

		password: z
			.string()
			.nonempty({ message: 'Your password cannot be empty' })
			.min(8, { message: 'Your password length must be at least 8.' })
			.regex(/[A-Z]/, {
				message: 'Your password must contain at least one uppercase letter.',
			})
			.regex(/[a-z]/, {
				message: 'Your password must contain at least one lowercase letter.',
			})
			.regex(/[0-9]/, {
				message: 'Your password must contain at least one number.',
			}),
		name: z
			.string()
			.nonempty({ message: 'Your name cannot be empty' })
			.min(2, { message: 'Your name must be at least 2 characters long.' })
			.max(50, { message: 'Your name must be at most 50 characters long.' }),

		confirmPassword: z
			.string()
			.nonempty({ message: 'Your password cannot be empty' })
			.min(8, { message: 'Your password length must be at least 8.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'], // target the field for the error
	});

type Props = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export function SignUpForm({ isLoading, setIsLoading }: Props) {
	const router = useRouter();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	const { signUpUser } = useSignUpUser();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
			confirmPassword: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsLoading(true);

		try {
			await signUpUser(data);
			toast.success('Account created successfully!');

			router.push('/');
		} catch {
			toast.error('Account creation failed. Try again.');
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
				Create an account
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Email Field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Name Field */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">Name</FormLabel>
								<FormControl>
									<Input placeholder="Name" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex flex-row w-full items-start gap-2 justify-between">
						{/* Password Field */}
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="flex items-center gap-2">
										Password
									</FormLabel>
									<FormControl>
										<Input
											className="text-foreground"
											type={isPasswordVisible ? 'text' : 'password'}
											endIcon={
												<Button
													type="button"
													size="icon"
													className="pointer-events-auto h-6 w-6 hover:bg-transparent border-0"
													variant="ghost"
													onClick={() => setIsPasswordVisible((prev) => !prev)}
													aria-label={
														!isPasswordVisible
															? 'Show password'
															: 'Hide password'
													}
												>
													{isPasswordVisible ? (
														<Eye className="h-4 w-4" />
													) : (
														<EyeOff className="h-4 w-4" />
													)}
												</Button>
											}
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Confirm Password Field */}
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="flex items-center gap-2">
										Confirm Password
									</FormLabel>
									<FormControl>
										<Input
											type={isConfirmPasswordVisible ? 'text' : 'password'}
											placeholder="Confirm Password"
											endIcon={
												<Button
													type="button"
													size="icon"
													className="pointer-events-auto h-6 w-6 hover:bg-transparent border-0"
													variant="ghost"
													onClick={() =>
														setIsConfirmPasswordVisible((prev) => !prev)
													}
													aria-label={
														!isConfirmPasswordVisible
															? 'Show password'
															: 'Hide password'
													}
												>
													{isConfirmPasswordVisible ? (
														<Eye className="h-4 w-4" />
													) : (
														<EyeOff className="h-4 w-4" />
													)}
												</Button>
											}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Create Account</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
				</form>
			</Form>
		</div>
	);
}
