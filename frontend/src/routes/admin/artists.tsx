import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import Artists from "../artists";
import { Artist } from "@/components/player/types";

export const Route = createFileRoute("/admin/artists")({
	component: ArtistAdmin,
	loader: async (params) => {
		const res = await axios.get(`/api/artists`);
		return res.data;
	},
});

function ArtistAdmin() {
	const artists: Artist[] = useLoaderData({ from: "/admin/artists" });
	return (
		<div>
			<Artists />
		</div>
	);
}

interface ArtistFormData {}

function ArtistForm() {
	const form = useForm();

	const mutation = useMutation({
		mutationKey: ["editArtist"],
		mutationFn: (data: ArtistFormData) => {
			return axios.post("/api/admin/artist", data);
		},
		onSuccess: () => {
			form.reset();
		},
	});

	function onSubmit(values: any) {
		mutation.mutate(values);
	}
	return <div></div>;
}

