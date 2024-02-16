import {createBrowserRouter} from "react-router-dom";
import {fetchAlbumByID, fetchAlbumsByArtist, fetchAllAlbums, fetchAllArtists, fetchAllSongs} from "./loaders";
import Layout from "@/components/layout";
import AlbumContent from "@/components/pages/Album";
import Albums from "@/components/pages/Albums";
import Songs from "@/components/pages/Songs";
import Artists from "@/components/pages/Artists";
import Upload from "@/components/pages/Upload";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
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
                loader: async ({params}) => {
                    const id = parseInt(params.id!);
                    return fetchAlbumByID(id);
                }
            },
            {
                path: "/artists",
                element: <Artists />,
                loader: fetchAllArtists,
            },
            {
                path: "/albums/artist/:id",
                element: <Albums />,
                loader: async ({params}) => {
                    const id = parseInt(params.id!);
                    return fetchAlbumsByArtist(id);
                }
            },
            {
                path: "/songs/",
                element: <Songs />,
                loader: fetchAllSongs,
            },
        ],
    },
]);
export default router;
