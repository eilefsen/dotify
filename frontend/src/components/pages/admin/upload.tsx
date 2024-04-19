import { Button } from "@/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { InputFile } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { File } from "buffer";

export function Upload() {
	return (
		<>
			<UploadForm />
		</>
	);
}

import { useForm } from "react-hook-form";

type AudioUpload = {
	files: FileList;
};

export function UploadForm() {
	const form = useForm();

	const mutation = useMutation({
		mutationKey: ["audioFilesUpload"],
		mutationFn: (data: AudioUpload) => {
			const formData = new FormData();
			for (const file of data.files) {
				formData.append("files[]", file);
			}
			return axios.post("/api/admin/upload", formData);
		},
		onSuccess: () => {
			form.reset();
		},
	});

	function onSubmit(values: any) {
		mutation.mutate(values);
	}

	let errorMsg;
	return (
		<Form {...form}>
			<h2 className="-mb-0.5 text-2xl">Submit new Music</h2>
			{errorMsg}
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
			>
				<FormField
					control={form.control}
					name="files"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel hidden>Image</FormLabel>
								<FormControl>
									<InputFile
										name={field.name}
										onBlur={field.onBlur}
										disabled={field.disabled}
										accept=".mp3"
										id="audio"
										value={field.value?.fileName}
										onChange={(event) => {
											field.onChange(event.target.files!);
										}}
										multiple
									/>
								</FormControl>
								<FormDescription hidden>
									This is the audio files you are submitting
								</FormDescription>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
