import { NavBar } from "../navbar";
import { MiniPlayer } from "../player/miniplayer";

export function Footer() {
	return (
		<div className="fixed bottom-0 left-0 right-0 border-t border-t-border bg-secondary shadow-sm shadow-black -shadow-y-0.5 shadow-blur-3 pb-safe">
			<MiniPlayer />
			<NavBar />
		</div>
	);
}
