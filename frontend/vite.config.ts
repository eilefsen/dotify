import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Dotify",
				short_name: "Dotify",
				start_url: "/",
				background_color: "#000000",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/images/mac/mac-120x120.png",
						sizes: "120x120",
						type: "image/png",
					},
					{
						src: "/images/mac/mac-196x196.png",
						sizes: "196x196",
						type: "image/png",
					},
					{
						src: "/images/mac/mac-310x310.png",
						sizes: "310x310",
						type: "image/png",
					},
					{
						src: "/images/mac/mac-1024x1024.png",
						sizes: "1024x1024",
						type: "image/png",
					},
				],
			},
		}),
	],
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
