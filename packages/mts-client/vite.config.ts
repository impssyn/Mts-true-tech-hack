import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	server: {
		port: 3000,
		host: true,
	},
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
		tsconfigPaths(),
		svgr(),
	],
	resolve: {
		alias: {
			src: './src/*',
			assets: './src/assets/*',
			components: './src/components/*',
			pages: './src/pages/*',
			shared: './src/07_shared/*',
		},
	},
})
