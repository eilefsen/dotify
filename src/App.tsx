import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {songs} from './testData';
import Layout from './components/layout/Sidebar';

import {icons} from './icons';


function App() {
    const player = new PlayerStore(songs);

    return (
        <iconsContext.Provider value={icons}>
            <playerStoreContext.Provider value={player}>
                <Layout />
            </playerStoreContext.Provider>
        </iconsContext.Provider>
    );
}

export default App;
