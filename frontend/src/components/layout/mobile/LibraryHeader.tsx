import {playerStoreContext} from "@/components/player";
import {observer} from "mobx-react-lite";
import {useContext} from "react";
import {NavLink} from "react-router-dom";

export function LibraryHeader() {
    return (
        <>
            <div className="library-header fixed top-0 left-0 right-0 h-14 z-20 bg-neutral-950 border-neutral-800 border-b flex gap-2 overflow-x-scroll px-2 items-center justify-center">
                <LibraryBtn to="/albums" label="Albums" />
                <LibraryBtn to="/artists" label="Artists" />
                <LibraryBtn to="/songs" label="Songs" />
            </div>
        </>
    );
}

interface LibraryBtnProps {
    to: string;
    label: string;
}

const LibraryBtn = observer(({to, label}: LibraryBtnProps) => {
    const player = useContext(playerStoreContext);
    function onClick() {
        player.isVisible = false;
    }
    return (
        <NavLink to={to}
            onClick={onClick}
            className={({isActive}) => {
                const base = "rounded-lg border-neutral-600 w-full justify-center border px-4 py-1 h-11 text-xl flex items-center";
                if (isActive) {
                    return base + " bg-white text-neutral-800";
                } else {
                    return base + " bg-neutral-800 text-white";
                }
            }}
        >{label}</NavLink>
    );
});
