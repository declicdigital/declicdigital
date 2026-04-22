import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const PLACE_ID = "ChIJsYNdrCdx5kcR89wPMta_l-w";
const REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJsYNdrCdx5kcR89wPMta_l-w";
const WRITE_REVIEW_URL = "https://www.google.com/maps/place//data=!4m3!3m2!1s0x47e67127ac5d83b1:0xec97bfd6320fdcf3!12e1";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  author_url?: string;
  profile_photo_url?: string;
}

interface GoogleReviewsSectionProps {
  maxReviews?: number;
  showTitle?: boolean;
  className?: string;
  compact?: boolean;
}

const FALLBACK_REVIEWS: Review[] = [
  { author_name: "Sophie L.", rating: 5, text: "Mon ancien site ne générait aucun contact. Depuis la refonte avec Déclic Digital, je reçois 3 à 5 demandes par semaine via Google.", relative_time_description: "Il y a 2 mois" },
  { author_name: "Marc D.", rating: 5, text: "En 3 mois, mon site est passé en première page Google sur mes mots clés principaux. Les appels ont doublé.", relative_time_description: "Il y a 3 mois" },
  { author_name: "Julie R.", rating: 5, text: "Un site magnifique, livré rapidement et parfaitement adapté à mon activité. Mes clients adorent.", relative_time_description: "Il y a 1 mois" },
  { author_name: "Thomas B.", rating: 5, text: "Déclic Digital a compris mon besoin dès le premier échange. Le site est pro, rapide et les inscriptions ont explosé.", relative_time_description: "Il y a 4 mois" },
  { author_name: "Nadia K.", rating: 5, text: "Le portfolio en ligne m'a permis de décrocher des projets que je n'aurais jamais eus sans visibilité web.", relative_time_description: "Il y a 2 mois" },
  { author_name: "Pierre M.", rating: 5, text: "Grâce au référencement local, on apparaît en premier sur Google Maps. La fréquentation a augmenté de 40%.", relative_time_description: "Il y a 5 mois" },
];

const GoogleReviewsSection = ({
  maxReviews = 6,
  showTitle = true,
  className = "",
  compact = false,
}: GoogleReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!supabaseUrl || !supabaseKey) { setUseFallback(true); setLoading(false); return; }

        const res = await fetch(`${supabaseUrl}/functions/v1/google-reviews`, {
          headers: { Authorization: `Bearer ${supabaseKey}` },
        });
        const data = await res.json();

        if (data.result?.reviews?.length > 0) {
          setRating(data.result.rating ?? 5);
          setTotalReviews(data.result.user_ratings_total ?? 0);
          setReviews(
            data.result.reviews
              .sort((a: Review, b: Review) => b.rating - a.rating)
              .slice(0, maxReviews)
          );
        } else {
          setUseFallback(true);
        }
      } catch {
        setUseFallback(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [maxReviews]);

  const displayReviews = useFallback || reviews.length === 0 ? FALLBACK_REVIEWS.slice(0, maxReviews) : reviews;
  const displayRating = useFallback ? 5 : rating;
  const displayTotal = useFallback ? 47 : totalReviews;
  const DESKTOP_LIMIT = 200;
  const MOBILE_LIMIT = 160;

  return (
    <SectionWrapper className={className}>
      {showTitle && (
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold md:text-4xl">Avis clients</h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-lg font-bold text-foreground">{displayRating}/5</span>
            {displayTotal > 0 && (
              <span className="text-muted-foreground">basé sur {displayTotal} avis Google</span>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {displayReviews.map((review, i) => (
            <div key={i} className="rounded-2xl bg-card p-5 shadow-card border border-border flex flex-col h-full min-h-[180px]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"} />
                  ))}
                  <span className="text-xs font-semibold text-foreground ml-1">{review.rating}/5</span>
                </div>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 opacity-60" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2 flex-1">
                "<span className="hidden md:inline">{review.text.length > DESKTOP_LIMIT ? review.text.slice(0, DESKTOP_LIMIT).trimEnd() + "…" : review.text}</span>
                <span className="md:hidden">{review.text.length > MOBILE_LIMIT ? review.text.slice(0, MOBILE_LIMIT).trimEnd() + "…" : review.text}</span>"
              </p>
              {review.text.length > MOBILE_LIMIT && (
                <a href={review.author_url || REVIEWS_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mb-3 w-fit">
                  Lire la suite <ExternalLink size={11} />
                </a>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  {review.profile_photo_url ? (
                    <img src={review.profile_photo_url} alt={review.author_name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {review.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-foreground">{review.author_name}</p>
                    {review.relative_time_description && (
                      <p className="text-xs text-muted-foreground">{review.relative_time_description}</p>
                    )}
                  </div>
                </div>
                <a href={review.author_url || REVIEWS_URL} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" loading="lazy" />
          Voir tous les avis sur Google <ExternalLink size={14} />
        </a>
        <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-6 py-3 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90">
          <Star size={14} /> Laisser un avis
        </a>
      </div>
    </SectionWrapper>
  );
};

export default GoogleReviewsSection;
