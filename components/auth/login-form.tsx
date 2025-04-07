'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
			<h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
				Login to your account
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
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									Password
								</FormLabel>
								<div className="flex flex-col gap-2 w-full items-center justify-between">
									<FormControl>
										<Input
											type="password"
											placeholder="Password"
											{...field}
											className="w-full"
										/>
									</FormControl>

									{/* Forgot Password Link */}
									{/* <div className="text-end w-full text-xs">
										<Link
											href="forgot-password"
											className="text-primary hover:underline hover:text-primary/80"
										>
											Forgot Password?
										</Link>
									</div> */}
								</div>
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button disabled={isLoading} type="submit" className="w-full">
						{!isLoading && <p>Login</p>}
						{isLoading && <BeatLoader size={8} color="white" />}
					</Button>
					<div className="flex items-center justify-center">
						<p className="text-muted-foreground text-center text-xs under">
							Don&apos;t have an account?{' '}
							<Link
								href="/sign-up"
								className="text-primary hover:text-primary/80 underline"
							>
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
}
