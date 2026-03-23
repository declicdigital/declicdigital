import { MapPin, Star, ExternalLink } from "lucide-react";

const GOOGLE_PLACE_ID = "ChIJsYNdrCdx5kcR89wPMta_l-w";
const GOOGLE_MAPS_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=D%C3%A9clic+Digital+57+Rue+d%27Alleray+Paris+75015&query_place_id=${GOOGLE_PLACE_ID}`;
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1313!2d2.2975!3d48.8386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671272a1d87b1%3A0xec97d6d632cf0df3!2sD%C3%A9clic+Digital!5e0!3m2!1sfr!2sfr";

interface MapEmbedProps {
  title?: string;
  subtitle?: string;
}

const MapEmbed = ({ title, subtitle }: MapEmbedProps) => (
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
        href={GOOGLE_MAPS_PLACE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        <MapPin size={14} />
        Voir notre fiche Google
        <ExternalLink size={12} />
      </a>
      <a
        href="https://share.google/8Ifh8V9cpPGinQXkY"
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

export default MapEmbed;
