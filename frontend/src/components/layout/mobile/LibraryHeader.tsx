import { iconsContext, playerStoreContext } from "@/components/player";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useContext } from "react";
import { NavLink } from "react-router-dom";

export function LibraryHeader() {
	const isLoggedIn = useQuery({
		queryKey: ["loginStatus"],
		initialData: false,
		enabled: false,
	});
	return (
		<>
			<div className="library-header fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center gap-2 overflow-x-scroll border-b border-neutral-800 bg-neutral-950 px-2">
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
				</span>
				<LoginButton isLoggedIn={isLoggedIn.data} />
			</div>
		</>
	);
}

interface LoginButtonProps {
	isLoggedIn: boolean;
}
function LoginButton(props: LoginButtonProps) {
	const icons = useContext(iconsContext);
	const queryClient = useQueryClient();
	async function logout() {
		const res = await axios.post("/api/auth/logout");
		if (res.status == 200) {
			console.log("Logged out!");
			queryClient.setQueryData(["loginStatus"], false);
			queryClient.setQueryData(["adminLoginStatus"], false);
		}
		return res;
	}
	const classString =
		"flex h-11 w-32 items-center justify-center rounded-lg border border-white bg-neutral-950 hover:bg-white hover:text-black px-4 py-1 text-xl transition-colors";
	return (
		<>
			{
				// inverted boolean because we want to show the login link when not logged in
				!props.isLoggedIn ? (
					<LibraryBtn className={classString} to="/login">
						{icons.login}
					</LibraryBtn>
				) : (
					<button className={classString} onClick={logout}>
						{icons.logout}
					</button>
				)
			}
		</>
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
					"flex h-11 items-center justify-center rounded-lg border border-neutral-600 px-4 py-1 text-xl",
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
