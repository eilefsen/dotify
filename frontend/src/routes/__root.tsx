import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { playerStoreContext, AudioPlayer } from "@/components/player";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import axios from "axios";
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
	const queryClient = useQueryClient();
	useQuery({
		queryKey: ["loginStatus"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/status`, {
				validateStatus: () => true,
			});
			const ok = res.status == 200;
			if (ok) {
				console.info("Your access token is valid!");
			}
			return ok;
		},
		initialData: false,
		retry: false,
		enabled: true,
	});
	useQuery({
		queryKey: ["refresh"],
		queryFn: async () => {
			const res = await axios.post(`/api/auth/refresh`, {
				withCredentials: true,
			});
			const ok = res.status == 200;
			if (ok) {
				queryClient.setQueryData(["loginStatus"], true);
				console.info("Access token refreshed!");
			}
			return ok;
		},
		refetchInterval: (query) => {
			const status = query.state.status;
			if (status == "error") {
				return false;
			}
			return 240000;
		},
		retry: false,
		enabled: true,
	});

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
