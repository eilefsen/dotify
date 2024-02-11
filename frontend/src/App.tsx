import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import Layout from './components/layout';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {grasshopper_songs} from './testData';
import {icons} from './icons';
import Albums from './components/pages/Albums';
import AlbumContent from './components/pages/Album';
import Songs from './components/pages/Songs';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/albums/",
                element: <Albums />,
                loader: async () => {
                    return fetch(`/api/albums`);
                }
            },
            {
                path: "/album/:id",
                element: <AlbumContent />,
                loader: async ({params}) => {
                    return fetch(`/api/album/${params.id}`);
                }
            },
            {
                path: "/songs/",
                element: <Songs />,
                loader: async () => {
                    return fetch(`/api/songs`);
                }
            },
        ],
    },
]);

function App() {
    const player = new PlayerStore([]);

    return (
        <iconsContext.Provider value={icons}>
            <playerStoreContext.Provider value={player}>
                <RouterProvider router={router} />
            </playerStoreContext.Provider>
        </iconsContext.Provider>
    );
}

export default App;
