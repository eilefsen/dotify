import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Playlist, Song } from "@/components/player/types";
import { PendingSongTable, SongTable } from "@/components/songList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LoginForm } from "../login";
import { Pencil } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PopoverClose } from "@radix-ui/react-popover";
import { OverflowMarquee } from "@/components/overflowMarquee";

interface PlaylistWithSongs {
	playlist: Playlist;
	songs: Song[];
}

export const Route = createFileRoute("/playlists/$playlistId")({
	component: PlaylistContent,
	loader: async (params): Promise<PlaylistWithSongs> => {
		const playlistRes = await axios.get(`/api/${params.location.pathname}`, {
			validateStatus: function (status) {
				return status < 500; // Resolve only if the status code is less than 500
			},
		});
		const songsRes = await axios.get(
			`/api/playlists/${params.params.playlistId}/songs`,
			{
				validateStatus: function (status) {
					return status < 500; // Resolve only if the status code is less than 500
				},
			},
		);
		return { playlist: playlistRes.data, songs: songsRes.data };
	},
	pendingComponent: PendingPlaylistContent,
	pendingMs: 100,
	pendingMinMs: 200,
});

function PendingPlaylistContent() {
	return (
		<div className="w-full overflow-hidden py-2">
			<div className="flex items-center px-4">
				<div className="h-full w-full px-4">
					<Skeleton className="mb-1.5 mt-3 h-7 w-44" />
				</div>
			</div>
			<PendingSongTable />
		</div>
	);
}

export function PlaylistContent() {
	const loginResult = useQuery({
		queryKey: ["loginStatus"],
		enabled: false,
		initialData: false,
	});

	const router = useRouter();

	useEffect(() => {
		router.invalidate();
	}, [loginResult.data]);

	const data = useLoaderData({ strict: true, from: "/playlists/$playlistId" });

	if (!loginResult.data) {
		return <LoginForm />;
	}

	return (
		<div className="w-full overflow-hidden py-2">
			<div className="flex items-center gap-2 px-4">
				<OverflowMarquee>
					<h2 className="text-3xl font-bold">{data.playlist.name}</h2>
				</OverflowMarquee>
				<EditNamePopover playlist={data.playlist} />
			</div>
			<SongTable songs={data.songs} albumIndexing={false} />
		</div>
	);
}

interface EditNamePopoverProps {
	playlist: Playlist;
}

function EditNamePopover(props: EditNamePopoverProps) {
	interface FormData {
		name: string;
	}

	const form = useForm();
	const router = useRouter();
	const mutation = useMutation({
		mutationKey: ["editPlaylistName", props.playlist],
		mutationFn: (data: FormData) => {
			return axios.put(`/api/playlists/${props.playlist.id}/edit-name`, data);
		},
		onSuccess: () => {
			router.invalidate();
		},
	});
	function onSubmit(values: any) {
		mutation.mutate(values);
	}
	return (
		<Popover>
			<PopoverTrigger>
				<Pencil size={20} />
			</PopoverTrigger>
			<PopoverContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="mx-auto w-full space-y-4 text-left "
						autoComplete="off"
					>
						<div className="flex justify-between gap-2">
							<FormField
								control={form.control}
								name="name"
								defaultValue={props.playlist.name}
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel hidden>Name</FormLabel>
											<FormControl>
												<Input
													maxLength={100}
													className="bg-secondary"
													{...field}
													placeholder="Playlist Name"
												/>
											</FormControl>
											<FormDescription hidden>
												This is the name of the playlist you are editing
											</FormDescription>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<PopoverClose asChild>
								<Button className="self-end" type="submit">
									Submit
								</Button>
							</PopoverClose>
						</div>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	);
}
