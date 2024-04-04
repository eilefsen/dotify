import { Button } from "@/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Input, InputFile } from "@/components/ui/input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UploadProps {}
export function Upload(props: UploadProps) {
	return (
		<>
			<UploadForm />
		</>
	);
}

import { useForm, Form } from "react-hook-form";

type Inputs = {
	file: File;
};

function UploadForm() {
	const form = useForm<Inputs>();

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["login"],
		mutationFn: (val: Inputs) => {
			return axios.post("/api/auth/login", val);
		},
		onSuccess: () => {
			form.reset();
			console.info("Logged in!");
			queryClient.setQueryData(["loginStatus"], true);
		},
	});

	function onSubmit(values: Inputs) {
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
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel hidden>File</FormLabel>
							<FormControl>
								<InputFile
									name={field.name}
									value={field.value}
									itemRef={field.ref}
								/>
							</FormControl>
							<FormDescription hidden>Input a music file here</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
