// src/components/StickyBar.tsx
// Sticky bar globale affichée en haut de toutes les pages
// Se charge depuis site_settings key="sticky_bar"

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type StickyBarConfig = {
  enabled: boolean;
  text: string;
  cta_label: string;
  cta_href: string;
  bg_color: string;
  text_color: string;
};

export default function StickyBar() {
  const [config, setConfig] = useState<StickyBarConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "sticky_bar")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value && (data.value as StickyBarConfig).enabled) {
          setConfig(data.value as StickyBarConfig);
        }
      });
  }, []);

  if (!config || !config.enabled || dismissed || !config.text) return null;

  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 z-[9990]"
      style={{
        background: config.bg_color,
        color: config.text_color,
        minHeight: "44px",
      }}
    >
      {/* Spacer left pour centrer */}
      <div className="w-6 shrink-0 hidden sm:block" />

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center gap-3 flex-wrap">
        <p className="text-sm font-medium text-center">{config.text}</p>
        {config.cta_label && config.cta_href && (
          <a
            href={config.cta_href}
            className="text-xs font-semibold px-3 py-1 rounded-lg shrink-0 transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.25)", color: config.text_color }}
          >
            {config.cta_label}
          </a>
        )}
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-1 rounded-md transition-opacity hover:opacity-70"
        style={{ color: config.text_color }}
        aria-label="Fermer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
