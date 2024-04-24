import { iconsContext, playerStoreContext } from "@/components/player";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useContext } from "react";
import { Link } from "@tanstack/react-router";

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
	const baseCN = cn(
		"flex h-11 items-center justify-center rounded-lg border border-neutral-600 p-1 text-xl",
		props.className,
	);
	return (
		<Link
			activeProps={{
				className: cn(baseCN, "bg-white text-neutral-800"),
			}}
			inactiveProps={{
				className: cn(baseCN, "bg-neutral-800 text-white"),
			}}
			to={props.to}
			onClick={onClick}
		>
			{props.children}
		</Link>
	);
});
