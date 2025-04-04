'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BeatLoader } from 'react-spinners';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon, PersonStanding } from 'lucide-react';

import useSignUpUser from '@/hooks/auth/useSignUpUser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const signUpSchema = z.object({
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
		.max(50, { message: 'Your name must not exceed 50 characters' }),
});

type Props = {
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
};

export function SignUpForm({ isLoading, setIsLoading }: Props) {
	const router = useRouter();

	const { signUpUser } = useSignUpUser();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsLoading(true);

		try {
			await signUpUser(data);
			toast.success('Account created successfully!');

			router.push('/');
		} catch {}
		setIsLoading(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-center text-2xl font-bold">Create an account</h1>
			<p className="text-muted-foreground text-center text-sm">
				Enter your information to get started with Exam Hub
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-2"
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
								<FormControl>
									<Input
										icon={<PersonStanding size={16} />}
										placeholder="Name"
										type="text"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between"></div>
								<FormControl>
									<Input
										icon={<LockIcon size={16} />}
										type="password"
										placeholder="Password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
