import { iconsContext, playerStoreContext } from "@/components/player";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useContext } from "react";
import { NavLink } from "react-router-dom";

export function Header() {
	return (
		<>
			<div className="library-header fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center gap-2 overflow-hidden border-b border-neutral-800 bg-neutral-950 px-2">
				<span className="flex w-full gap-2">
					<LibraryBtn className="w-full" to="/albums">
						Albums
					</LibraryBtn>
					<LibraryBtn className="w-full" to="/artists">
						Artists
					</LibraryBtn>
					<LibraryBtn className="w-full" to="/songs">
						Songs
					</LibraryBtn>
					<GithubButton />
				</span>
			</div>
		</>
	);
}

function GithubButton() {
	const icons = useContext(iconsContext);
	return (
		<a
			className="flex h-11 items-center justify-center rounded-lg border border-neutral-300 bg-white px-2  py-1 text-xl text-black transition-colors hover:bg-black hover:text-white "
			href="https://github.com/eilefsen/dotify"
		>
			{icons.github}
		</a>
	);
}

interface LibraryBtnProps extends PropsWithChildren {
	to: string;
	className?: string;
}

const LibraryBtn = observer((props: LibraryBtnProps) => {
	const player = useContext(playerStoreContext);
	function onClick() {
		player.isVisible = false;
	}
	return (
		<NavLink
			to={props.to}
			onClick={onClick}
			className={({ isActive }) => {
				const base = cn(
					"flex h-11 items-center justify-center rounded-lg border border-neutral-600 p-1 text-xl",
					props.className,
				);
				if (isActive) {
					return base + " bg-white text-neutral-800";
				} else {
					return base + " bg-neutral-800 text-white";
				}
			}}
		>
			{props.children}
		</NavLink>
	);
});
