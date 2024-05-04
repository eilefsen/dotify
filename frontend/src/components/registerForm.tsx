import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	FormField,
	Form,
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

export function RegisterForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["register"],
		mutationFn: async (val: z.infer<typeof formSchema>) => {
			const registerRes = await axios.post("/api/auth/register", val);
			console.log(registerRes.status);
			return registerRes.status == 200;
		},
		onSuccess: (data) => {
			form.reset();
			console.info("User registered!");
			queryClient.setQueryData(["loginStatus"], data);
			queryClient.invalidateQueries({ queryKey: ["adminLoginStatus"] });
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutation.mutate(values);
	}

	let errorMsg;
	let successMsg;

	if (mutation.isError) {
		errorMsg = (
			<span className="text-xl font-bold text-red-600">
				Could not register user
			</span>
		);
	}
	if (mutation.isSuccess) {
		successMsg = (
			<span className="text-xl font-bold text-foreground">
				Successfully created user
			</span>
		);
	}

	return (
		<Form {...form}>
			<div className="px-2">
				<h2 className="text-3xl leading-normal">Register user</h2>
				{errorMsg}
				{successMsg}
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
						<Button type="submit">Register</Button>
					</div>
				</form>
			</div>
		</Form>
	);
}
