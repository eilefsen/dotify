import { Album, AlbumWithSongs, Artist, Song } from "@/components/player/types";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
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
import { useForm } from "react-hook-form";

interface AlbumAndArtists {
	album: AlbumWithSongs;
	allAlbums: Album[];
	artists: Artist[];
}

export const Route = createFileRoute("/admin/albums/$albumId")({
	component: AlbumAdmin,
	loader: async (params) => {
		const albumsRes = await axios.get(`/api/albums`);
		const artistsRes = await axios.get(`/api/artists_no_img`);
		const singleAlbumRes = await axios.get(
			`/api/albums/${params.params.albumId}`,
		);

		return {
			album: singleAlbumRes.data,
			allAlbums: albumsRes.data,
			artists: artistsRes.data,
		};
	},
});

function AlbumAdmin() {
	const loaderData: AlbumAndArtists = useLoaderData({
		from: "/admin/albums/$albumId",
	});

	return (
		<div>
			<AlbumForm {...loaderData} />
			<SongsAdmin songs={loaderData.album.songs} />
		</div>
	);
}

interface AlbumFormData {
	Title: string;
	Artist: string;
}

interface AlbumFormProps extends AlbumAndArtists {}

export function AlbumForm(props: AlbumFormProps) {
	const params = useParams({ from: "/admin/albums/$albumId" });
	const form = useForm();
	const mutation = useMutation({
		mutationKey: ["editAlbum", params.albumId],
		mutationFn: (data: AlbumFormData) => {
			const album = {
				title: data.Title,
				artist: {
					id: Number(data.Artist),
				},
			};

			return axios.put(`/api/admin/albums/${params.albumId}`, album);
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
	for (const artist of props.artists) {
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
			<img className="w-3/5" src={props.album.imgSrc} alt={props.album.title} />

			<Form {...form}>
				<span className="text-red-500">{errorMsg}</span>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="Title"
						defaultValue={props.album.title}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} placeholder={props.album.title} />
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
							defaultValue={props.album.artist.id.toString()}
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

interface SongsAdminProps {
	songs: Song[];
}
function SongsAdmin(props: SongsAdminProps) {
	const songForms: ReactNode = [];
	for (const song of props.songs) {
		const el = (
			<SongForm
				song={song}
				className="rounded-xl border-b border-border bg-hover px-4 py-2 pb-4"
				key={song.id}
			/>
		);
		songForms.push(el);
	}
	return (
		<Accordion type="single" collapsible className="w-full pt-2">
			<AccordionItem value="item-1">
				<AccordionTrigger>Songs</AccordionTrigger>
				<AccordionContent className="flex flex-col gap-y-4">
					{songForms}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

interface SongFormProps {
	song: Song;
	className?: string;
}
interface SongFormData {
	track: number;
	title: string;
}
function SongForm(props: SongFormProps) {
	const form = useForm();
	const router = useRouter();
	const mutation = useMutation({
		mutationKey: ["editSong", props.song.id],
		mutationFn: (data: SongFormData) => {
			return axios.put(`/api/admin/songs/${props.song.id}`, data);
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
		<div className={props.className}>
			<Form {...form}>
				<span className="text-red-500">{errorMsg}</span>
				<span className="text-foreground">{successMsg}</span>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-[30rem] space-y-4 text-left "
				>
					<FormField
						control={form.control}
						name="title"
						defaultValue={props.song.title}
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											className="bg-secondary"
											{...field}
											placeholder={props.song.title}
										/>
									</FormControl>
									<FormDescription hidden>
										This is the title of the song you are editing
									</FormDescription>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<div className="flex justify-between">
						<FormField
							control={form.control}
							name="track"
							defaultValue={props.song.track}
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Track</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												className="w-16 bg-secondary"
												placeholder={props.song.track.toString()}
											/>
										</FormControl>
										<FormDescription hidden>
											This is the track of the song you are editing
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
