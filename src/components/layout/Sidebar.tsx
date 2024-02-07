import {useContext} from "react";
import {NavLink} from "react-router-dom";

import {CoverImg, iconsContext, playerStoreContext} from "@/components/player";
import {SongTitle} from "../player/status";


export default function Sidebar() {
    const player = useContext(playerStoreContext);
    const icons = useContext(iconsContext);

    return (
        <div className={`fixed left-0 bottom-0 h-screen w-52 bg-black border-r border-neutral-50`}>
            <div className="brand flex justify-center items-center h-20 border-b border-white">
                <h1 className="text-5xl">Dotify</h1>
            </div>
            <SidebarButton text="Albums" icon={icons.album} to="/albums/" />
            <SidebarButton text="Songs" icon={icons.song} to="/songs/" />
            <SidebarButton text="Playlists" icon={icons.playlist} to="/playlists/" />
            <div className="absolute bottom-0">
                <SongInfo />
            </div>

        </div>
    );
}

interface sidebarButtonProps {
    text: string;
    icon: React.ReactNode;
    to: string;
}

function SidebarButton({text, icon, to}: sidebarButtonProps) {
    const btnCn = "w-full flex items-center gap-2 h-9 px-3 py-5 bg-neutral-950 hover:bg-neutral-900 border-neutral-800 border-b";

    return (
        <NavLink to={to} className={btnCn}>
            {icon}{text}
        </NavLink>
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
