import {createBrowserRouter} from "react-router-dom";
import {fetchAlbumByID, fetchAlbumsByArtist, fetchAllAlbums, fetchAllSongs} from "./loaders";
import Layout from "@/components/layout";
import AlbumContent from "@/components/pages/Album";
import Albums from "@/components/pages/Albums";
import Songs from "@/components/pages/Songs";

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
                path: "/artist/:name",
                element: <Albums />,
                loader: async ({params}) => {
                    const name = params.name as string;
                    return fetchAlbumsByArtist(name);
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
