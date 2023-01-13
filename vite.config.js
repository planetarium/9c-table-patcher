import {defineConfig} from 'vite'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import {sveltekit} from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    nodePolyfills({protocolImports: true}),
    sveltekit(),
  ]
});
