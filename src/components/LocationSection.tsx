import { useEffect, useState } from "react";
import { MapPin, ExternalLink, Star, Clock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionWrapper from "./SectionWrapper";

const GOOGLE_MAPS_CID = "17048305841118108915";
const GOOGLE_BUSINESS_LINK = `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}`;
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

const LocationSection = () => {
  const [placeUrl, setPlaceUrl] = useState(GOOGLE_BUSINESS_LINK);
  const [writeReviewUrl, setWriteReviewUrl] = useState(GOOGLE_WRITE_REVIEW_URL);
  const [mapEmbedUrl, setMapEmbedUrl] = useState(MAPS_EMBED_URL);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("google-reviews");
        if (!error && data && !data.fallback && data.googleMapsLinks) {
          if (data.googleMapsLinks.placeUri) {
            setPlaceUrl(data.googleMapsLinks.placeUri);
            setMapEmbedUrl(getEmbedUrlFromPlaceUrl(data.googleMapsLinks.placeUri));
          }
          if (data.googleMapsLinks.writeAReviewUri) setWriteReviewUrl(data.googleMapsLinks.writeAReviewUri);
        }
      } catch {}
    };
    fetchLinks();
  }, []);

  return (
    <SectionWrapper className="bg-section-blue">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold md:text-4xl">Notre agence</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Basés à Paris 15e, nous accompagnons les TPE et indépendants dans toute l'Île-de-France.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-card border border-border">
          <iframe
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={MAPS_EMBED_URL}
            title="Déclic Digital - 57 Rue d'Alleray, Paris 15e"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Déclic Digital</h3>
            <p className="text-sm text-muted-foreground">Agence de création de sites web et SEO</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">57 Rue d'Alleray</p>
                <p className="text-sm text-muted-foreground">75015 Paris, France</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <a href="tel:+33602228939" className="font-medium text-foreground hover:text-primary transition-colors">
                06 02 22 89 39
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">Lun - Ven : 9h - 19h</p>
            </div>
          </div>

          <div className="rounded-xl bg-background p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" loading="lazy" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">5/5</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <MapPin size={14} />
              Voir sur Google Maps
              <ExternalLink size={12} />
            </a>
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary btn-glow px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-opacity"
            >
              <Star size={14} />
              Laisser un avis
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default LocationSection;
