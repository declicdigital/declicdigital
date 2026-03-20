import { useEffect, useState } from "react";
import { MapPin, ExternalLink, Star, Clock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionWrapper from "./SectionWrapper";

const GOOGLE_PLACE_ID = "ChIJsYNdrCdx5kcR89wPMta_l-w";
const MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.5!2d2.2975!3d48.8386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${GOOGLE_PLACE_ID}!2sD%C3%A9clic%20Digital!5e0!3m2!1sfr!2sfr!4v1`;
const FALLBACK_MAPS_LINK = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;

const LocationSection = () => {
  const [placeUrl, setPlaceUrl] = useState(FALLBACK_MAPS_LINK);
  const [writeReviewUrl, setWriteReviewUrl] = useState(FALLBACK_MAPS_LINK);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("google-reviews");
        if (!error && data && !data.fallback && data.googleMapsLinks) {
          if (data.googleMapsLinks.placeUri) setPlaceUrl(data.googleMapsLinks.placeUri);
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
          Basés à Paris 15e, nous accompagnons les PME et indépendants dans toute l'Île-de-France.
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
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
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
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
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
