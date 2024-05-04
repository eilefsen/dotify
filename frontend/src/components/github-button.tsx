import { useContext } from "react";
import { iconsContext } from "./player";

export function GithubButton() {
	const icons = useContext(iconsContext);
	return (
		<a
			className="flex h-11 items-center justify-center rounded-lg border border-primary bg-primary px-2 py-1 text-xl text-primary-foreground transition hover:brightness-95 "
			href="https://github.com/eilefsen/dotify"
			target="_blank"
		>
			{icons.github}
		</a>
	);
}
