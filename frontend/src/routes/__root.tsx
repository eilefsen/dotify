import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { playerStoreContext, AudioPlayer } from "@/components/player";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

export const Route = createRootRoute({
	component: () => (
		<>
			<Header />
			<LibraryOutlet />
			<Footer />
		</>
	),
});

const LibraryOutlet = observer(() => {
	const player = useContext(playerStoreContext);
	return (
		<main
			className={
				"content fixed left-0 right-0 top-12 overflow-x-hidden pt-2" +
				" " +
				(player.isVisible ? "bottom-0" : "bottom-20 pb-4")
			}
		>
			{player.isVisible ? <AudioPlayer /> : <Outlet />}
		</main>
	);
});
