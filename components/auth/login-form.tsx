"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BeatLoader } from "react-spinners";
// import { useAuth } from "@/hooks";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type Props = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export function LoginForm({ isLoading, setIsLoading }: Props) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const { handleLoginLocal } = useAuth();

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    console.log(data);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
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
                <div className="flex w-full flex-col items-center justify-between gap-2">
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
        </form>
      </Form>
    </div>
  );
}
