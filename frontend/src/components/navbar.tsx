import { Disc3Icon, GuitarIcon, ListMusic } from "lucide-react";
import { TabButton } from "./tabButton";
import { cn } from "@/lib/utils";

interface NavbarProps {
	className?: string;
}
export function NavBar(props: NavbarProps) {
	return (
		<div
			className={cn("flex w-full justify-around gap-2 pt-0.5", props.className)}
		>
			<TabButton to="/albums">
				<Disc3Icon />
				Albums
			</TabButton>
			<TabButton to="/artists">
				<GuitarIcon />
				Artists
			</TabButton>
			<TabButton to="/playlists">
				<ListMusic />
				Playlists
			</TabButton>
		</div>
	);
}
