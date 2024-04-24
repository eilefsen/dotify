import { AudioPlayer, playerStoreContext } from "@/components/player";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryFooter } from "./MobileFooter";

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
		<main
			className={
				"content fixed left-0 right-0 top-12 overflow-x-hidden pt-2" +
				" " +
				(player.isVisible ? "bottom-0" : "bottom-20")
			}
		>
			{player.isVisible ? <AudioPlayer /> : <Outlet />}
		</main>
	);
});
