import {observer} from 'mobx-react-lite';

interface SongTitleProps {
    title?: string;
    artist?: string;
}

export const SongTitle = observer(function ({title, artist}: SongTitleProps) {
    return (
        <div className='song-title'>
            <p className='text-neutral-200 font-bold'>
                {title || "No Song playing"}
                {artist && (
                    <span className='text-neutral-400 font-normal'>
                        <br />
                        {artist}
                    </span>
                )}
            </p>
        </div >
    );
});
