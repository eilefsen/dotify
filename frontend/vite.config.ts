import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	optimizeDeps: {
		exclude: ["react-icons"],
	},
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
});
