import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink, Star, Clock, Phone } from "lucide-react";

const GOOGLE_MAPS_CID = "17048305841118108915";
const GOOGLE_BUSINESS_LINK = `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}`;
const GOOGLE_WRITE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJsYNdrCdx5kcR89wPMta_l-w";
const MAPS_EMBED_URL = `https://www.google.com/maps?cid=${GOOGLE_MAPS_CID}&output=embed`;

interface LocationSectionProps {
  backgroundColor?: string;
}

const LocationSection = ({ backgroundColor }: LocationSectionProps) => {
  const [mapVisible, setMapVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardBg = backgroundColor === "#E9F2F4" ? "#F6F1E9" : "#E9F2F4";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // commence à charger 200px avant que la section soit visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: "#2B1E3F" }}>Notre agence</h2>
          <p className="mt-4 max-w-2xl mx-auto" style={{ color: "#2B1E3F", opacity: 0.7 }}>
            Basés à Paris 15e, nous accompagnons les TPE et indépendants dans toute l'Île-de-France.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">

          {/* Carte — chargée uniquement quand dans le viewport */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: "rgba(43,30,63,0.1)", height: "400px" }}
          >
            {mapVisible ? (
              <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={MAPS_EMBED_URL}
                title="Déclic Digital - 57 Rue d'Alleray, Paris 15e"
              />
            ) : (
              /* Placeholder pendant que l'observer attend */
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "#E8E4DC" }}
              >
                <div className="flex flex-col items-center gap-2" style={{ color: "#2B1E3F", opacity: 0.3 }}>
                  <MapPin size={28} />
                  <span className="text-sm font-medium">Chargement de la carte...</span>
                </div>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: "#2B1E3F" }}>Déclic Digital</h3>
              <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Agence de création de sites web et SEO</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium" style={{ color: "#2B1E3F" }}>57 Rue d'Alleray</p>
                  <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>75015 Paris, France</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+33602228939" className="font-medium hover:text-primary transition-colors" style={{ color: "#2B1E3F" }}>
                  06 02 22 89 39
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm" style={{ color: "#2B1E3F", opacity: 0.6 }}>Lun - Ven : 9h - 19h</p>
              </div>
            </div>

            <div className="rounded-xl p-4 border" style={{ backgroundColor: cardBg, borderColor: "rgba(43,30,63,0.1)" }}>
              <div className="flex items-center gap-2 mb-2">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" loading="lazy" />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold" style={{ color: "#2B1E3F" }}>5/5</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={GOOGLE_BUSINESS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: cardBg, color: "#2B1E3F", borderColor: "rgba(43,30,63,0.2)" }}
              >
                <MapPin size={14} />
                Voir sur Google Maps
                <ExternalLink size={12} />
              </a>
              <a
                href={GOOGLE_WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary btn-glow px-5 py-2.5 text-sm font-bold shadow-glow transition-opacity hover:opacity-90"
                style={{ color: "#2B1E3F" }}
              >
                <Star size={14} />
                Laisser un avis
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
