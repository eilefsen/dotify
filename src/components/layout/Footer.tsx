import {MuteButton, NextSongButton, PlayButton, PrevSongButton, ProgressBar, VolumeSlider} from "@/components/player";

export default function Footer() {
    return (
        <div className="z-20 h-20 fixed bottom-0 left-52 right-0 bg-black flex" >
            <div className="absolute top-0 left-0 right-0 h-1">
                <ProgressBar
                    className='[&_.slider-track]:rounded-none [&_.slider-thumb]:hidden'
                />
            </div>
            <div className="px-6 pt-1 flex w-full">
                <Transport />
                <Volume />
            </div >
        </div>
    );
}

function Transport() {
    return (
        <span className="transport-controls flex align-middle justify-center gap-4 px-5">
            <PrevSongButton />
            <PlayButton />
            <NextSongButton />
        </span>
    );
}

function Volume() {
    return (
        <span className="volume-controls flex gap-3 min-w-32 w-full px-6">
            <MuteButton />
            <VolumeSlider />
        </span>
    );
}
