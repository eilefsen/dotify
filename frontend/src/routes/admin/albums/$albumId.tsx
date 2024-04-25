import { ReactNode, createFileRoute } from "@tanstack/react-router";
import { Album, Artist } from "@/components/player/types";
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
import { useMutation } from "@tanstack/react-query";
import { useLoaderData, useParams } from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AlbumAndArtists {
	album: Album;
	allAlbums: Album[];
	artists: Artist[];
}

export const Route = createFileRoute("/admin/albums/$albumId")({
	component: AlbumForm,
	loader: async (params) => {
		const albumRes = await axios.get(`/api/albums`);
		const artistsRes = await axios.get(`/api/artists_no_img`);

		let album;
		for (const a of albumRes.data as Album[]) {
			if (a.id == params.params.albumId) {
				album = a;
				break;
			}
		}

		return {
			album: album,
			allAlbums: albumRes.data,
			artists: artistsRes.data,
		};
	},
});

interface AlbumFormData {
	Title: string;
	Artist: string;
}

export function AlbumForm() {
	const loaderData: AlbumAndArtists = useLoaderData({
		from: "/admin/albums/$albumId",
	});
	console.log(loaderData.artists);

	const params = useParams({ from: "/admin/albums/$albumId" });
	const form = useForm();
	const mutation = useMutation({
		mutationKey: ["editAlbum"],
		mutationFn: (data: AlbumFormData) => {
			console.log(data);

			const album = {
				title: data.Title,
				artist: {
					id: Number(data.Artist),
				},
			};
			console.log(album);

			return axios.post(`/api/admin/albums/${params.albumId}`, album);
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

	const selectItems: ReactNode[] = [];
	for (const artist of loaderData.artists) {
		const el = (
			<SelectItem value={artist.id.toString()} key={artist.id}>
				{artist.name}
			</SelectItem>
		);
		selectItems.push(el);
	}

	return (
		<div className="mx-auto w-full">
			<h2 className="w-fit text-2xl">Edit Album</h2>
			<img
				className="w-3/5"
				src={loaderData.album.imgSrc}
				alt={loaderData.album.title}
			/>

			<Form {...form}>
				<span className="text-red-500">{errorMsg}</span>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="Title"
						defaultValue={loaderData.album.title}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} placeholder={loaderData.album.title} />
									</FormControl>
									<FormDescription hidden>
										This is the title of the album you are editing
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<div className="flex justify-between">
						<FormField
							control={form.control}
							name="Artist"
							defaultValue={loaderData.album.artist.id.toString()}
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Artist</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Artist" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>{selectItems}</SelectContent>
										</Select>
										<FormDescription hidden>
											This is the artist of the album you are editing
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<Button className="self-end" type="submit">
							Submit
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
