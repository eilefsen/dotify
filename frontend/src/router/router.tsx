import { createBrowserRouter } from "react-router-dom";
import {
	fetchAlbumByID,
	fetchAlbumsByArtist,
	fetchAllAlbums,
	fetchAllArtists,
	fetchAllSongs,
	fetchArtistWithAlbums,
} from "./loaders";
import AlbumContent from "@/components/pages/Album";
import Albums from "@/components/pages/Albums";
import Songs from "@/components/pages/Songs";
import Artists from "@/components/pages/Artists";
import MobileLayout from "@/components/layout/mobile/MobileLayout";
import Login from "@/components/pages/login/Login";
import Admin from "@/components/pages/admin/Admin";
import { Artist } from "@/components/pages/Artist";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MobileLayout />,
		children: [
			{
				path: "/albums/",
				element: <Albums />,
				loader: fetchAllAlbums,
			},
			{
				path: "/album/:id",
				element: <AlbumContent />,
				errorElement: <></>,
				loader: async ({ params }) => {
					const id = parseInt(params.id!);
					return fetchAlbumByID(id);
				},
			},
			{
				path: "/artists",
				element: <Artists />,
				loader: fetchAllArtists,
			},
			{
				path: "/albums/artist/:id",
				element: <Albums />,
				loader: async ({ params }) => {
					const id = parseInt(params.id!);
					return fetchAlbumsByArtist(id);
				},
			},
			{
				path: "/artist/:id",
				element: <Artist />,
				loader: async ({ params }) => {
					const id = parseInt(params.id!);
					return fetchArtistWithAlbums(id);
				},
			},
			{
				path: "/songs/",
				element: <Songs />,
				loader: fetchAllSongs,
			},
			{
				path: "/login/",
				element: <Login />,
			},
			{
				path: "/admin/",
				element: <Admin />,
			},
		],
	},
]);
export default router;
