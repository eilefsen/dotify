import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import {
    RouterProvider,
} from 'react-router-dom';

import {icons} from './icons';
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
