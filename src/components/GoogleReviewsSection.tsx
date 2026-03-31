import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ReviewCard, { type ReviewData } from "./ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import SectionWrapper from "./SectionWrapper";

const GOOGLE_PLACE_ID = "ChIJsYNdrCdx5kcR89wPMta_l-w";
const FALLBACK_REVIEWS_URL = "https://share.google/8Ifh8V9cpPGinQXkY";
const FALLBACK_WRITE_REVIEW_URL = "https://share.google/8Ifh8V9cpPGinQXkY";

const MOCK_REVIEWS: ReviewData[] = [
  { author: "Sophie L.", rating: 5, text: "Mon ancien site ne générait aucun contact. Depuis la refonte avec Déclic Digital, je reçois 3 à 5 demandes par semaine via Google.", time: "Il y a 2 mois" },
  { author: "Marc D.", rating: 5, text: "En 3 mois, mon site est passé en première page Google sur mes mots clés principaux. Les appels ont doublé.", time: "Il y a 3 mois" },
  { author: "Julie R.", rating: 5, text: "Un site magnifique, livré rapidement et parfaitement adapté à mon activité. Mes clients adorent.", time: "Il y a 1 mois" },
  { author: "Thomas B.", rating: 5, text: "Déclic Digital a compris mon besoin dès le premier échange. Le site est pro, rapide et les inscriptions ont explosé.", time: "Il y a 4 mois" },
  { author: "Nadia K.", rating: 5, text: "Le portfolio en ligne m'a permis de décrocher des projets que je n'aurais jamais eus sans visibilité web.", time: "Il y a 2 mois" },
  { author: "Pierre M.", rating: 5, text: "Grâce au référencement local, on apparaît en premier sur Google Maps. La fréquentation a augmenté de 40%.", time: "Il y a 5 mois" },
];

interface GoogleReviewsSectionProps {
  maxReviews?: number;
  showTitle?: boolean;
  className?: string;
  compact?: boolean;
}

const GoogleReviewsSection = ({
  maxReviews = 6,
  showTitle = true,
  className = "",
  compact = false,
}: GoogleReviewsSectionProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(5);
  const [totalReviews, setTotalReviews] = useState(47);
  const [loading, setLoading] = useState(true);
  const [reviewsUrl, setReviewsUrl] = useState(FALLBACK_REVIEWS_URL);
  const [writeReviewUrl, setWriteReviewUrl] = useState(FALLBACK_WRITE_REVIEW_URL);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("google-reviews");
        if (!error && data && !data.fallback && data.reviews) {
          const apiReviewsUrl = data.googleMapsLinks?.reviewsUri || FALLBACK_REVIEWS_URL;
          const apiWriteReviewUrl = data.googleMapsLinks?.writeAReviewUri || FALLBACK_WRITE_REVIEW_URL;
          setReviewsUrl(apiReviewsUrl);
          setWriteReviewUrl(apiWriteReviewUrl);
          const mapped: ReviewData[] = data.reviews.slice(0, maxReviews).map((r: any) => ({
            author: r.authorAttribution?.displayName || r.author_name || "Client",
            rating: r.rating || 5,
            text: r.text?.text || r.text || "",
            time: r.relativePublishTimeDescription || r.relative_time_description || "",
            reviewUrl: r.googleMapsUri || apiReviewsUrl,
          }));
          setReviews(mapped);
          if (data.rating) setRating(data.rating);
          if (data.userRatingCount) setTotalReviews(data.userRatingCount);
        } else {
          setReviews(MOCK_REVIEWS.slice(0, maxReviews));
        }
      } catch {
        setReviews(MOCK_REVIEWS.slice(0, maxReviews));
      }
      setLoading(false);
    };
    fetchReviews();
  }, [maxReviews]);

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
            <span className="text-lg font-bold text-foreground">{rating}/5</span>
            <span className="text-muted-foreground">
              basé sur {totalReviews} avis Google
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className={`grid gap-6 ${compact ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {[...Array(compact ? 2 : 3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`grid gap-6 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
        >
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" loading="lazy" />
          Voir tous les avis sur Google
          <ExternalLink size={14} />
        </a>
        <a
          href={writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg btn-glow transition-opacity ${className.includes("blue") || className.includes("rose") || className.includes("alt") ? "bg-[#f6f1e9] hover:bg-[#ede6d8] text-[hsl(263,36%,18%)]" : "gradient-primary text-white shadow-glow"}`}
        >
          <Star size={14} />
          Laisser un avis
        </a>
      </div>
    </SectionWrapper>
  );
};

export default GoogleReviewsSection;
