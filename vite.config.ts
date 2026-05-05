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
    // Augmente le seuil d'avertissement chunk size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Gros fichiers de données — chargés en lazy
          if (id.includes("cityGuideContent")) return "city-guide";
          if (id.includes("tradeGuideContent")) return "trade-guide";
          if (id.includes("cityContent")) return "city-content";
          if (id.includes("cities")) return "cities";
          if (id.includes("trades")) return "trades";
          if (id.includes("blogPosts")) return "blogPosts";

          // Pages admin — jamais dans le bundle principal
          if (id.includes("/pages/Admin")) return "admin";
          if (id.includes("/components/admin")) return "admin";

          // Vendors
          if (id.includes("node_modules/react-dom")) return "vendor-react";
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-router")) return "vendor-react";
          if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion")) return "vendor-motion";
          if (id.includes("node_modules/@supabase")) return "vendor-supabase";
          if (id.includes("node_modules/react-helmet-async")) return "vendor-helmet";
          if (id.includes("node_modules/@tanstack")) return "vendor-query";
          if (id.includes("node_modules/@tiptap")) return "vendor-editor";
          if (id.includes("node_modules/recharts")) return "vendor-charts";
          if (id.includes("node_modules/dompurify")) return "vendor-sanitize";
          if (id.includes("node_modules/lucide-react")) return "vendor-ui";
        },
      },
    },
  },
}));
