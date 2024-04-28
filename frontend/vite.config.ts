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
				name: "Music Player for the web",
				short_name: "Dotify",
				start_url: "/",
				background_color: "#000000",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/images/apple-touch-icon-120x120.png",
						sizes: "120x120",
						type: "image/png",
					},
					{
						src: "/images/icon-512x512.png",
						sizes: "512x512",
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
