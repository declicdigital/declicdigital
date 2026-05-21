import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Vendors admin uniquement ──────────────────────────────────────
          // TipTap et recharts ne servent que dans l'admin
          if (
            id.includes('@tiptap') ||
            id.includes('recharts') ||
            id.includes('d3-') ||
            id.includes('victory-')
          ) {
            return 'vendor-admin';
          }

          // ── Core React ────────────────────────────────────────────────────
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react';
          }

          // ── Animation ─────────────────────────────────────────────────────
          if (id.includes('node_modules/motion')) {
            return 'vendor-motion';
          }

          // ── UI utilitaires ────────────────────────────────────────────────
          if (
            id.includes('node_modules/lucide-react') ||
            id.includes('node_modules/class-variance-authority') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/tailwind-merge')
          ) {
            return 'vendor-ui';
          }

          // ── Supabase ──────────────────────────────────────────────────────
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }

          // ── Helmet ────────────────────────────────────────────────────────
          if (id.includes('node_modules/react-helmet-async')) {
            return 'vendor-helmet';
          }

          // ── React Query ───────────────────────────────────────────────────
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }

          // ── DOMPurify ─────────────────────────────────────────────────────
          if (id.includes('node_modules/dompurify')) {
            return 'vendor-sanitize';
          }
        },
      },
    },
  },
}));
