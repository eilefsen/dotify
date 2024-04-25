import { ArtistWithImg } from "@/components/player/types";
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
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useLoaderData,
	useParams,
} from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/admin/artists/$artistId")({
	component: ArtistForm,
	loader: async (params) => {
		const res = await axios.get(`/api/artist_only/${params.params.artistId}`);
		return res.data;
	},
});

interface ArtistFormData {
	Name: string;
	Website: string;
}

export function ArtistForm() {
	const currentArtist: ArtistWithImg = useLoaderData({
		from: "/admin/artists/$artistId",
	});

	const params = useParams({ from: "/admin/artists/$artistId" });
	const form = useForm();
	const mutation = useMutation({
		mutationKey: ["editArtist"],
		mutationFn: (data: ArtistFormData) => {
			console.log(data);
			return axios.post(`/api/admin/artists/${params.artistId}`, data);
		},
		onSuccess: () => {
			form.reset();
		},
	});
	function onSubmit(values: any) {
		mutation.mutate(values);
	}

	let errorMsg;
	if (mutation.isError) {
		errorMsg = "Failed to make changes";
	}

	return (
		<div className="mx-auto w-full">
			<h2 className="w-fit text-2xl">Edit Artist</h2>
			<img
				className="w-3/5"
				src={currentArtist.imgSrc}
				alt={currentArtist.name}
			/>

			<Form {...form}>
				<span className="text-red-500">{errorMsg}</span>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="Name"
						defaultValue={""}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder={currentArtist.name} />
									</FormControl>
									<FormDescription hidden>
										This is the name of the artist you are editing
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="Website"
						defaultValue={""}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input {...field} placeholder={currentArtist.website} />
									</FormControl>
									<FormDescription hidden>
										This is the website of the artist you are editing
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
}

