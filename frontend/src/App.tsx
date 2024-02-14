import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import Layout from './components/layout';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {icons} from './icons';
import Albums from './components/pages/Albums';
import AlbumContent from './components/pages/Album';
import Songs from './components/pages/Songs';
import router from './router';


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
