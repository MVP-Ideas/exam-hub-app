'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { toast } from 'sonner';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import useLoginUser from '@/hooks/auth/useLoginUser';

const loginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' }),
});

type Props = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export function LoginForm({ isLoading, setIsLoading }: Props) {
	const router = useRouter();
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const { loginUser } = useLoginUser();

	const onSubmit = async (data: z.infer<typeof loginSchema>) => {
		console.log('Login data', data);
		setIsLoading(true);

		try {
			await loginUser(data);

			toast.success('Login successful');
			router.push('/');
		} catch (error) {
			console.error('Login error', error);
		}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-center text-2xl font-bold">Welcome Back</h1>
			<p className="text-muted-foreground text-center text-sm">
				Sign in to your Exam Hub account to continue
			</p>

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
								<FormControl>
									<Input
										icon={<MailIcon size={16} />}
										placeholder="Email"
										type="email"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-col gap-2 w-full items-center justify-between">
									<FormControl>
										<Input
											icon={<LockIcon size={16} />}
											type="password"
											placeholder="Password"
											{...field}
											className="w-full"
										/>
									</FormControl>

									{/* Forgot Password Link */}
									<div className="text-end w-full text-xs">
										<Link
											href="forgot-password"
											className="text-primary hover:underline hover:text-primary/80"
										>
											Forgot Password?
										</Link>
									</div>
								</div>
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Login</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
				</form>
			</Form>
		</div>
	);
}
