import { Album, Artist, ArtistNoID } from "@/components/player/types";
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
import {
	SelectItem,
	SelectGroup,
	SelectLabel,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import {
	ReactNode,
	createFileRoute,
	useLoaderData,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { memo } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/admin/artists/$artistId")({
	component: ArtistForm,
	loader: async (params) => {
		const albumRes = await axios.get(`/api/albums`);
		const artistRes = await axios.get(
			`/api/artist_only/${params.params.artistId}`,
		);

		return {
			albums: albumRes.data,
			artist: artistRes.data,
		};
	},
});

interface ArtistFormData {
	Name: string;
	Website: string;
	Image: string;
}

interface LoaderData {
	artist: Artist;
	albums: Album[];
}

interface ImageSelectGroupsProps {
	albums: Album[];
}
function ImageSelectGroups(props: ImageSelectGroupsProps) {
	const imageSelectGroups: ReactNode[] = [];

	const artists = [
		...new Map(
			props.albums.map((item) => [item.artist.id, item.artist]),
		).values(),
	];

	for (const artist of artists) {
		// pick out albums matching artist of group
		const imageSelectItems: ReactNode[] = [];
		for (const a of props.albums) {
			if (a.artist.id == artist.id) {
				const el = (
					<SelectItem value={a.imgSrc} key={a.id}>
						{a.title}
					</SelectItem>
				);
				imageSelectItems.push(el);
			}
		}

		const group = (
			<SelectGroup
				className="border-neutral-700 [&:not(:last-child)]:border-b"
				key={artist.id}
			>
				<SelectLabel>{artist.name}</SelectLabel>
				{imageSelectItems}
			</SelectGroup>
		);
		imageSelectGroups.push(group);
	}
	return <>{imageSelectGroups}</>;
}

const PureImageSelectGroups = memo(ImageSelectGroups);

export function ArtistForm() {
	const loaderData: LoaderData = useLoaderData({
		from: "/admin/artists/$artistId",
	});
	const params = useParams({ from: "/admin/artists/$artistId" });
	const form = useForm();

	const router = useRouter();

	const mutation = useMutation({
		mutationKey: ["editArtist"],
		mutationFn: async (data: ArtistFormData) => {
			console.log(data);

			const artist: ArtistNoID = {
				name: data.Name,
				website: data.Website,
				imgSrc: data.Image,
			};
			console.log(artist);

			const res = await axios.put(
				`/api/admin/artists/${params.artistId}`,
				artist,
			);
			return res;
		},
		onSuccess: () => {
			router.invalidate();
		},
	});
	function onSubmit(values: any) {
		mutation.mutate(values);
	}

	let errorMsg;
	if (mutation.isError) {
		errorMsg = "Failed to make changes";
	}
	let successMsg;
	if (mutation.isSuccess) {
		successMsg = "Success!";
	}

	return (
		<div className="mx-auto w-full">
			<h2 className="w-fit text-2xl">Edit Artist</h2>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="Image"
						defaultValue={loaderData.artist.imgSrc}
						render={({ field }) => {
							return (
								<FormItem>
									<img className="w-3/5" src={field.value} />
									<FormLabel>Image</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<PureImageSelectGroups albums={loaderData.albums} />
										</SelectContent>
									</Select>
									<FormDescription hidden>
										This is the title of the album you are editing
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="Name"
						defaultValue={loaderData.artist.name}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder={loaderData.artist.name} />
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
						defaultValue={loaderData.artist.website}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input {...field} placeholder={loaderData.artist.website} />
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
			<div className="pt-2 text-center">
				<span className="text-red-500">{errorMsg}</span>
				<span className="text-white">{successMsg}</span>
			</div>
		</div>
	);
}
