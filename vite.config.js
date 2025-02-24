/* eslint-disable no-undef */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"

import { resolve } from "path";
// import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
	plugins: [react(), tailwindcss()], //webExtension({ additionalInputs: ["src/scripts/content-script.jsx"], manifest: "public/manifest.json" })],
	build: {
		outDir: "build",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				"service-worker": resolve(__dirname, "src/scripts/service-worker.js"),
				// note to future self: add line for each individual content script to import
				// 'content-script': resolve(__dirname, 'src/scripts/content-script.jsx')
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
