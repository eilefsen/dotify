import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
import { useState } from "react";

const formSchema = z.object({
	username: z.string().min(2).max(250),
	password: z.string().min(2).max(250),
});

interface LoginRegisterFormProps {
	onSuccess?: () => void;
	showTitle?: boolean;
	registerOpenedState?: [
		boolean,
		React.Dispatch<React.SetStateAction<boolean>>,
	];
}
export function LoginRegisterForm(props: LoginRegisterFormProps) {
	let registerOpened: boolean;
	let setRegisterOpened: React.Dispatch<React.SetStateAction<boolean>>;
	if (props.registerOpenedState != undefined) {
		[registerOpened, setRegisterOpened] = props.registerOpenedState;
	} else {
		[registerOpened, setRegisterOpened] = useState(false);
	}

	return (
		<>
			{registerOpened ? (
				<RegisterForm
					onLoginClick={() => {
						setRegisterOpened(false);
					}}
					onSuccess={props.onSuccess}
					showTitle={props.showTitle}
				/>
			) : (
				<LoginForm
					onRegisterClick={() => {
						setRegisterOpened(true);
					}}
					onSuccess={props.onSuccess}
					showTitle={props.showTitle}
				/>
			)}
		</>
	);
}

interface LoginFormProps extends LoginRegisterFormProps {
	onRegisterClick?: () => void;
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
		<>
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
										<Input
											placeholder="Username"
											autoComplete="username"
											{...field}
										/>
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
										<Input
											type="password"
											autoComplete="current-password"
											placeholder="Password"
											{...field}
										/>
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
							<Button onClick={props.onRegisterClick} variant="outline">
								Register
							</Button>
						</div>
					</form>
				</div>
			</Form>
		</>
	);
}

interface RegisterFormProps extends LoginRegisterFormProps {
	onLoginClick?: () => void;
}

export function RegisterForm(props: RegisterFormProps) {
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
				{showTitle && (
					<h2 className="text-3xl leading-normal">Register user</h2>
				)}
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
									<Input
										placeholder="Username"
										autoComplete="username"
										{...field}
									/>
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
									<Input
										type="password"
										placeholder="Password"
										autoComplete="new-password"
										{...field}
									/>
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
						<Button onClick={props.onLoginClick} variant="outline">
							Login
						</Button>
					</div>
				</form>
			</div>
		</Form>
	);
}
