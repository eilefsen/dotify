import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const formSchema = z.object({
	username: z.string().min(2).max(250),
	password: z.string().min(2).max(250),
});

interface LoginFormProps {
	onSuccess?: () => void;
}

export function LoginForm(props: LoginFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["login"],
		mutationFn: (val: z.infer<typeof formSchema>) => {
			return axios.post("/api/auth/login", val);
		},
		onSuccess: () => {
			form.reset();
			if (props.onSuccess) {
				props.onSuccess();
			}
			console.info("Logged in!");
			queryClient.setQueryData(["loginStatus"], true);
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutation.mutate(values);
	}

	let errorMsg;

	if (mutation.isError) {
		errorMsg = (
			<span className="text-xl font-bold text-red-600">
				Wrong username or password
			</span>
		);
	}

	return (
		<Form {...form}>
			<h2 className="text-3xl">Log in</h2>
			{errorMsg}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} />
							</FormControl>
							<FormDescription hidden>Input your Username here</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormDescription hidden>Input your Password here</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
