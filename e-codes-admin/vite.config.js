import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // esbuild: {
  //   loader: 'jsx',           // 👈 treat .js as JSX
  //   include: /src\/.*\.js$/, // 👈 only apply to your source .js files
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // if (id.includes('node_modules')) {
          //   return 'vendor';
          // }
          if (id.includes('node_modules')) {
            let vendor;
            ['firebase', 'react-dom'].forEach((pkg) => {
              if (id.includes(pkg)) {
                vendor = pkg.split('')[0] + pkg.split('')[3] + pkg.split('')[5];
              }
            })
            return vendor;
          }
          return null;
        }
      }
    }
  }
})
