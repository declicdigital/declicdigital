import { useEffect, useState } from "react";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GOOGLE_MAPS_CID = "17048305841118108915";
const GOOGLE_MAPS_PLACE_URL = `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}`;
const GOOGLE_WRITE_REVIEW_URL = "https://www.google.com/maps/place//data=!4m3!3m2!1s0x47e67127ac5d83b1:0xec97bfd6320fdcf3!12e1";
const MAPS_EMBED_URL = `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}&output=embed`;

const getEmbedUrlFromPlaceUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const cid = parsed.searchParams.get("cid");
    return cid ? `https://www.google.com/maps?cid=${cid}&output=embed` : MAPS_EMBED_URL;
  } catch {
    return MAPS_EMBED_URL;
  }
};

interface MapEmbedProps {
  title?: string;
  subtitle?: string;
}

const MapEmbed = ({ title, subtitle }: MapEmbedProps) => {
  const [placeUrl, setPlaceUrl] = useState(GOOGLE_MAPS_PLACE_URL);
  const [writeReviewUrl, setWriteReviewUrl] = useState(GOOGLE_WRITE_REVIEW_URL);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("google-reviews");
        if (!error && data && !data.fallback && data.googleMapsLinks) {
          if (data.googleMapsLinks.placeUri) setPlaceUrl(data.googleMapsLinks.placeUri);
          if (data.googleMapsLinks.writeAReviewUri) setWriteReviewUrl(data.googleMapsLinks.writeAReviewUri);
        }
      } catch {
        // Keep fallback links
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      {title && <h3 className="text-xl font-bold text-center mb-2">{title}</h3>}
      {subtitle && <p className="text-sm text-muted-foreground text-center mb-4">{subtitle}</p>}
      <div className="rounded-2xl overflow-hidden shadow-card border border-border">
        <iframe
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={MAPS_EMBED_URL}
          title="Déclic Digital - 57 Rue d'Alleray, Paris 15e"
        />
      </div>
      <div className="flex justify-center gap-3 mt-4">
        <a
          href={placeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          <MapPin size={14} />
          Voir notre fiche Google
          <ExternalLink size={12} />
        </a>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-4 py-2 text-sm font-semibold text-white shadow-glow"
        >
          <Star size={14} />
          Laisser un avis
        </a>
      </div>
    </div>
  );
};

export default MapEmbed;
