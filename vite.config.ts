import { defineConfig, esmExternalRequirePlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

const external = ['react', 'react-dom']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ 
      include: ['src/lib'],
      insertTypesEntry: true,
    }),
    // Rolldown keeps `require()` calls to externals inside bundled CJS code
    // (react/jsx-runtime). Rewrite them to imports so the ES build works
    // without a `require` function.
    esmExternalRequirePlugin({ external }),
  ],
  build: {
    copyPublicDir: false, // Don't copy public assets for library build
    lib: {
      entry: resolve(import.meta.dirname, 'src/lib/index.ts'),
      name: 'GooglePlacesWidgets',
      fileName: (format) => `google-places-widgets.${format}.js`,
    },
    rolldownOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      // `external` is declared via esmExternalRequirePlugin above
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
