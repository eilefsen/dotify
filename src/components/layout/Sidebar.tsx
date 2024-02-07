import {useContext} from "react";
import {CoverImg, iconsContext, playerStoreContext} from "@/components/player";
import {SongTitle} from "../player/status";


export default function Sidebar() {
    const player = useContext(playerStoreContext);
    const icons = useContext(iconsContext);

    return (
        <div className={`fixed left-0 bottom-0 h-screen w-52 bg-black border-r border-neutral-50`}>
            <SidebarButton text="Albums" icon={icons.album} onClick={() => {}} />
            <div className="absolute bottom-0">
                <SongInfo />
            </div>

        </div>
    );
}

interface sidebarButtonProps {
    text: string;
    icon: React.ReactNode;
    onClick: React.MouseEventHandler;
}

function SidebarButton({text, icon, onClick}: sidebarButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-2 h-9 px-3 py-5 bg-neutral-950 hover:bg-neutral-900 border-neutral-800 border-b"
        >
            {icon}
            {text}
        </button>
    );

}

function SongInfo() {
    const player = useContext(playerStoreContext);
    return (
        <div className="song-info w-full h-auto">
            <CoverImg
                src={player.currentSong.album.imgSrc}
                alt={player.currentSong.album.title}
            />
            <div className="px-5 pb-1 w-full h-20 flex items-center">
                <SongTitle
                    title={player.currentSong.title}
                    artist={player.currentSong.artist}
                />
            </div>
        </div>
    );
}
