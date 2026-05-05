import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";

const PLACE_ID = "ChIJsYNdrCdx5kcR89wPMta_l-w";
const REVIEWS_URL = "https://search.google.com/local/reviews?placeid=ChIJsYNdrCdx5kcR89wPMta_l-w";
const WRITE_REVIEW_URL = "https://share.google/8Ifh8V9cpPGinQXkY";

// URL et clé du projet Supabase qui héberge la Edge Function google-reviews
const SUPABASE_URL = "https://iskxljribvfypkyappku.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3hsanJpYnZmeXBreWFwcGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjQ0MzMsImV4cCI6MjA5MjI0MDQzM30.OgWh7kKknHgdG4JMTFbNC_XdZhncnEqzJQA0GbRI_uY";

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
  backgroundColor?: string;
}

const GoogleReviewsSection = ({
  maxReviews = 6,
  showTitle = true,
  className = "",
  compact = false,
  backgroundColor,
}: GoogleReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/google-reviews`, {
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          setUseFallback(true);
          setLoading(false);
          return;
        }

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

  const displayReviews = useFallback || reviews.length === 0 ? [] : reviews;
  const displayRating = rating;
  const displayTotal = totalReviews;
  const DESKTOP_LIMIT = 200;
  const MOBILE_LIMIT = 160;

  const cardBg = backgroundColor === "#E9F2F4" ? "#F6F1E9" : "#E9F2F4";

  if (!loading && displayReviews.length === 0) return null;

  return (
    <section
      className={`py-12 md:py-16 ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="container">
        {showTitle && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl" style={{ color: "#2B1E3F" }}>
              Avis clients
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-lg font-bold" style={{ color: "#2B1E3F" }}>{displayRating}/5</span>
              {displayTotal > 0 && (
                <span style={{ color: "#2B1E3F", opacity: 0.6 }}>
                  basé sur {displayTotal} avis Google
                </span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border h-48 animate-pulse"
                style={{ backgroundColor: cardBg, borderColor: "rgba(43,30,63,0.1)" }} />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {displayReviews.map((review, i) => (
              <div key={i} className="rounded-2xl p-5 border flex flex-col h-full min-h-[180px]"
                style={{
                  backgroundColor: cardBg,
                  borderColor: "rgba(43,30,63,0.1)",
                  boxShadow: "0 4px 24px rgba(43,30,63,0.06)",
                }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                    ))}
                    <span className="text-xs font-semibold ml-1" style={{ color: "#2B1E3F" }}>{review.rating}/5</span>
                  </div>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 opacity-60" />
                </div>
                <p className="text-sm leading-relaxed mb-2 flex-1" style={{ color: "#2B1E3F", opacity: 0.7 }}>
                  "<span className="hidden md:inline">
                    {review.text.length > DESKTOP_LIMIT ? review.text.slice(0, DESKTOP_LIMIT).trimEnd() + "..." : review.text}
                  </span>
                  <span className="md:hidden">
                    {review.text.length > MOBILE_LIMIT ? review.text.slice(0, MOBILE_LIMIT).trimEnd() + "..." : review.text}
                  </span>"
                </p>
                {review.text.length > MOBILE_LIMIT && (
                  <a href={review.author_url || REVIEWS_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium hover:underline mb-3 w-fit"
                    style={{ color: "#4361EE" }}>
                    Lire la suite <ExternalLink size={11} />
                  </a>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t"
                  style={{ borderColor: "rgba(43,30,63,0.1)" }}>
                  <div className="flex items-center gap-2">
                    {review.profile_photo_url ? (
                      <img src={review.profile_photo_url} alt={review.author_name}
                        className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: "rgba(67,97,238,0.15)", color: "#4361EE" }}>
                        {review.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#2B1E3F" }}>{review.author_name}</p>
                      {review.relative_time_description && (
                        <p className="text-xs" style={{ color: "#2B1E3F", opacity: 0.5 }}>
                          {review.relative_time_description}
                        </p>
                      )}
                    </div>
                  </div>
                  <a href={review.author_url || REVIEWS_URL} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#2B1E3F", opacity: 0.4 }}>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: cardBg, color: "#2B1E3F", borderColor: "rgba(43,30,63,0.2)" }}>
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" loading="lazy" />
            Voir tous les avis sur Google <ExternalLink size={14} />
          </a>
          <a href={WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full gradient-primary btn-glow px-6 py-3 text-sm font-bold shadow-glow transition-opacity hover:opacity-90"
            style={{ color: "#2B1E3F" }}>
            <Star size={14} /> Laisser un avis
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
