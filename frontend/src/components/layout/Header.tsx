import { iconsContext, playerStoreContext } from "@/components/player";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useContext } from "react";
import { Link } from "@tanstack/react-router";

export function Header() {
	return (
		<>
			<div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center gap-2 overflow-hidden border-b border-primary bg-secondary px-2">
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
			className="flex h-11 items-center justify-center rounded-lg border border-primary bg-primary px-2 py-1 text-xl text-primary-foreground transition hover:brightness-95 "
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
		"flex h-11 items-center justify-center rounded-lg border p-1 text-xl",
		props.className,
	);
	return (
		<Link
			activeProps={{
				className: cn(
					baseCN,
					"bg-primary text-primary-foreground border-primary",
				),
			}}
			inactiveProps={{
				className: cn(
					baseCN,
					"bg-muted text-foreground border-muted-foreground",
				),
			}}
			to={props.to}
			onClick={onClick}
		>
			{props.children}
		</Link>
	);
});
