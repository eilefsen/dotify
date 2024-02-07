import {observer} from 'mobx-react-lite';
import {useContext} from 'react';

import {playerStoreContext} from './context';
import {
    MuteButton,
    NextSongButton,
    PlayButton,
    PrevSongButton,
    ProgressBar,
    VolumeSlider,
} from './controls';
import {SongTitle} from './status';


export const AudioPlayer = observer(() => {
    const player = useContext(playerStoreContext);

    return (
        <div>
            <div className='bg-gray-900 text-gray-400 p-3 relative'>

                <ProgressBar
                    className='[&_.slider-track]:rounded-none'
                />
                <SongTitle title={player.currentSong.title} artist={player.currentSong.artist} />
                <div className="grid grid-cols-2 items-center mt-4">
                    {/* Transport controls */}
                    <span className='flex'>
                        <PrevSongButton />
                        <PlayButton />
                        <NextSongButton />
                    </span>
                    {/* Volume controls */}
                    <span className='flex gap-2 items-center xxl:justify-self-end'>
                        <MuteButton />
                        <VolumeSlider />
                    </span>
                </div >
            </div>
        </div >
    );
});
