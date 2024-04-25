import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/artists")({
	component: () => <div>Hello /admin/artists!</div>,
});

function ArtistAdmin() {
	return <div></div>;
}

