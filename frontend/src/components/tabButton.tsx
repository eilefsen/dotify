import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useContext } from "react";
import { playerStoreContext } from "./player";

interface TabButton extends PropsWithChildren {
	to: string;
	className?: string;
}

export const TabButton = observer((props: TabButton) => {
	const player = useContext(playerStoreContext);
	function onClick() {
		player.setNotVisible();
	}
	const baseCN = cn(
		"flex flex-col items-center justify-center rounded-lg border p-1 text-sm",
		props.className,
	);
	return (
		<Link
			activeProps={{
				className: cn(baseCN, "text-primary"),
			}}
			inactiveProps={{
				className: cn(baseCN, "text-foreground"),
			}}
			to={props.to}
			onClick={onClick}
		>
			{props.children}
		</Link>
	);
});
