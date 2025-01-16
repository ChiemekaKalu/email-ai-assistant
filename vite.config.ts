import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { crx } from '@crxjs/vite-plugin';
import { ManifestV3Export } from '@crxjs/vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Email AI Assistant",
  version: "1.0.0",
  description: "AI-powered email management and summarization",
  permissions: [
    "activeTab",
    "storage",
    "https://mail.google.com/*"
  ],
  action: {
    default_popup: "index.html"
  },
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  content_scripts: [
    {
      matches: ["https://mail.google.com/*"],
      js: ["src/content/gmail.ts"]
    }
  ],
  background: {
    service_worker: "src/background/index.ts",
    type: "module" as const
  },
  web_accessible_resources: [
    {
      matches: ["https://mail.google.com/*"],
      resources: [
        "assets/*",
        "icons/*"
      ],
      use_dynamic_url: true
    }
  ]
};

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name ? assetInfo.name : '';
          if (info.endsWith('.png')) {
            return 'icons/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});