import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import Layout from './components/layout';
import {
    createBrowserRouter,
    Router,
    RouterProvider,
} from 'react-router-dom';

import {songs} from './testData';
import {icons} from './icons';
import Albums from './components/pages/Albums';
import Songs from './components/pages/Songs';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/albums/",
                element: <Albums />,
            },
            {
                path: "/songs/",
                element: <Songs />,
            },
        ],
    },
]);

function App() {
    const player = new PlayerStore(songs);

    return (
        <iconsContext.Provider value={icons}>
            <playerStoreContext.Provider value={player}>
                <RouterProvider router={router} />
            </playerStoreContext.Provider>
        </iconsContext.Provider>
    );
}

export default App;
