import "./App.css";
import {
	PlayerStore,
	iconsContext,
	playerStoreContext,
} from "./components/player";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
	routeTree,
});
// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

import { icons } from "./icons";
import { useScrollBlock } from "./lib/hooks";
import { ThemeProvider } from "./components/theme-provider";

function App() {
	const player = new PlayerStore([]);

	const [blockScroll, _] = useScrollBlock();

	blockScroll();

	return (
		<iconsContext.Provider value={icons}>
			<playerStoreContext.Provider value={player}>
				<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
					<RouterProvider router={router} />
				</ThemeProvider>
			</playerStoreContext.Provider>
		</iconsContext.Provider>
	);
}

export default App;
