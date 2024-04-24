import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginForm,
});

const formSchema = z.object({
	username: z.string().min(2).max(250),
	password: z.string().min(2).max(250),
});

export function LoginForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const router = useRouter();
	const navigate = useNavigate({ from: "/login" });

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["login"],
		mutationFn: async (val: z.infer<typeof formSchema>) => {
			const loginres = await axios.post("/api/auth/login", val);
			const adminres = await axios.post(`/api/auth/adminstatus`, {
				validateStatus: () => true,
			});
			return {
				login: loginres.status == 200,
				admin: adminres.status == 200,
			};
		},
		onSuccess: (data) => {
			form.reset();
			console.info("Logged in!");
			queryClient.setQueryData(["loginStatus"], data.login);
			queryClient.setQueryData(["adminLoginStatus"], data.admin);
			navigate({ to: router.state.redirect?.from });
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
				className="mx-auto space-y-2 border-neutral-600 text-left"
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
