import {observer} from 'mobx-react-lite';

interface SongTitleProps {
    title?: string;
    artist?: string;
}

export const SongTitle = observer(function ({title, artist}: SongTitleProps) {
    return (
        <div className='song-title'>
            <div className='text-neutral-200 font-bold'>
                {title ?? "No Song playing"}
            </div>
            {artist && (
                <div className='text-neutral-400 font-bold text-xs'>
                    {artist}
                </div>
            )}
        </div >
    );
});
