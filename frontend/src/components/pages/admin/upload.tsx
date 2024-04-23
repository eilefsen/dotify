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
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export function Upload() {
	return (
		<>
			<UploadForm />
		</>
	);
}

import { useForm } from "react-hook-form";

type AlbumUpload = {
	Image: File;
	Audio: FileList;
};

export function UploadForm() {
	const form = useForm();
	const [progress, setProgress] = useState(-1);

	const mutation = useMutation({
		mutationKey: ["audioFilesUpload"],
		mutationFn: (data: AlbumUpload) => {
			const formData = new FormData();
			for (const audioFile of data.Audio) {
				formData.append("audioFiles[]", audioFile);
			}
			formData.append("image", data.Image);
			return axios.post("/api/admin/upload", formData, {
				onUploadProgress: (progressEvent) => {
					let percentCompleted = Math.floor(
						(progressEvent.loaded * 100) / progressEvent.total!,
					);
					setProgress(percentCompleted);
				},
			});
		},
		onSuccess: () => {
			form.reset();
		},
	});

	function onSubmit(values: any) {
		mutation.mutate(values);
	}
	let progressBarClassName = "opacity-0";

	if (progress > -1 && progress < 100) {
		progressBarClassName = "";
	}

	let errorMsg;

	if (mutation.isError) {
		errorMsg = "Failed to upload";
	}
	return (
		<div className="mx-auto w-fit">
			<Form {...form}>
				<h2 className="w-fit text-2xl">Submit new Music</h2>
				<span className="text-red-500">{errorMsg}</span>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="Audio"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel hidden>Audio</FormLabel>
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
										This is the audio files of the album you are submitting
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="Image"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel hidden>Image</FormLabel>
									<FormControl>
										<InputFile
											name={field.name}
											onBlur={field.onBlur}
											disabled={field.disabled}
											accept=".jpg"
											id="image"
											value={field.value?.fileName}
											onChange={(event) => {
												field.onChange(event.target.files![0]);
											}}
										/>
									</FormControl>
									<FormDescription hidden>
										This is the image for the album you are submitting
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<Progress
				className={"transition-opacity " + progressBarClassName}
				value={progress}
			/>
		</div>
	);
}
