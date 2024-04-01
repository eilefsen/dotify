import "./App.css";
import {
	PlayerStore,
	iconsContext,
	playerStoreContext,
} from "./components/player";
import { RouterProvider } from "react-router-dom";

import { icons } from "./icons";
import router from "./router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
	const player = new PlayerStore([]);
	const queryClient = useQueryClient();
	const result = useQuery({
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
	});

	return (
		<iconsContext.Provider value={icons}>
			<playerStoreContext.Provider value={player}>
				<RouterProvider router={router} />
			</playerStoreContext.Provider>
		</iconsContext.Provider>
	);
}

export default App;
