import {observer} from 'mobx-react-lite';
import {useContext} from 'react';

import {playerStoreContext} from './context';
import {
    NextSongButton,
    PlayButton,
    PrevSongButton,
    ProgressBar,
} from './controls';
import {SongTitle} from './status';
import {Link} from 'react-router-dom';


export const AudioPlayer = observer(() => {
    const player = useContext(playerStoreContext);

    function onClick() {
        player.isVisible = !player.isVisible;
    }

    return (
        <div className="player px-12 w-full h-full text-xl text-center flex items-center">
            <div className='flex flex-col gap-4 w-full self-center'>
                <Link to={`/album/${player.currentSong.album.id}`}
                    onClick={onClick}
                    className="w-64 h-64 mx-auto"
                >
                    <img
                        src={player.currentSong?.album.imgSrc}
                        alt={player.currentSong?.album.title}
                    />
                </Link>
                <SongTitle title={player.currentSong.title} artist={player.currentSong.artist.name} />
                <ProgressBar />
                <Transport />
            </div>
        </div>
    );
});


function Transport() {
    return (
        <span className="transport-controls flex align-middle mx-auto justify-center gap-4 px-5 pb-2">
            <PrevSongButton />
            <PlayButton />
            <NextSongButton />
        </span>
    );
}
