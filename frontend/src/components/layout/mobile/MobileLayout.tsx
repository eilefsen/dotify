import {AudioPlayer, playerStoreContext} from "@/components/player";
import {observer} from "mobx-react-lite";
import {useContext} from "react";
import {Outlet} from "react-router-dom";
import {LibraryHeader} from "./LibraryHeader";
import {LibraryFooter} from "./MobileFooter";

export default function Layout() {
    return (
        <>
            <LibraryHeader />
            <LibraryOutlet />
            <LibraryFooter />
        </>
    );
}

const LibraryOutlet = observer(() => {
    const player = useContext(playerStoreContext);
    return (
        <main className="content overflow-scroll pt-2 fixed top-12 left-0 bottom-20 right-0">
            {player.isVisible ? <AudioPlayer /> : <Outlet />}
        </main>
    );
});
