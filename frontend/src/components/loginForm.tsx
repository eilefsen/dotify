import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
	username: z.string().min(2).max(250),
	password: z.string().min(2).max(250),
});

interface LoginFormProps {
	onSuccess?: () => void;
	showTitle?: boolean;
}

export function LoginForm(props: LoginFormProps) {
	let showTitle;
	if (props.showTitle == undefined) {
		showTitle = true;
	} else {
		showTitle = props.showTitle;
	}

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
		mutationFn: async (val: z.infer<typeof formSchema>) => {
			const loginres = await axios.post("/api/auth/login", val);
			console.log(loginres.status);
			return loginres.status == 200;
		},
		onSuccess: (data) => {
			form.reset();
			console.info("Logged in!");
			queryClient.setQueryData(["loginStatus"], data);
			queryClient.invalidateQueries({ queryKey: ["adminLoginStatus"] });
			if (props.onSuccess) {
				props.onSuccess();
			}
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutation.mutate(values);
	}

	let errorMsg;

	if (mutation.isError) {
		console.log(mutation.error);
		errorMsg = (
			<span className="text-xl font-bold text-red-600">
				Wrong username or password
			</span>
		);
	}

	return (
		<Form {...form}>
			<div className="px-2">
				{showTitle && <h2 className="text-3xl leading-normal">Login</h2>}
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
								<FormDescription hidden>
									Input your Username here
								</FormDescription>
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
								<FormDescription hidden>
									Input your Password here
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-2">
						<Button type="submit">Login</Button>
						<Link to="/register">
							<Button variant="outline">Register</Button>
						</Link>
					</div>
				</form>
			</div>
		</Form>
	);
}
