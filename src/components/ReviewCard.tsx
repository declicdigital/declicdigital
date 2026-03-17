import { Star, ExternalLink } from "lucide-react";

export interface ReviewData {
  author: string;
  rating: number;
  text: string;
  time: string;
  reviewUrl?: string;
}

const DESKTOP_LIMIT = 200;
const MOBILE_LIMIT = 160;

const FALLBACK_URL = "https://search.google.com/local/reviews?placeid=ChIJsYNdrCdx5kcR89wPMta_l-w";

const ReviewCard = ({ review }: { review: ReviewData }) => {
  const needsTruncation = review.text.length > MOBILE_LIMIT;
  const reviewUrl = review.reviewUrl || FALLBACK_URL;

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card border border-border flex flex-col h-full min-h-[180px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, j) => (
            <Star
              key={j}
              size={14}
              className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}
            />
          ))}
          <span className="text-xs font-semibold text-foreground ml-1">{review.rating}/5</span>
        </div>
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="h-4 w-4 opacity-60"
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-2 flex-1">
        "
        <span className="hidden md:inline">
          {review.text.length > DESKTOP_LIMIT
            ? review.text.slice(0, DESKTOP_LIMIT).trimEnd() + "…"
            : review.text}
        </span>
        <span className="md:hidden">
          {review.text.length > MOBILE_LIMIT
            ? review.text.slice(0, MOBILE_LIMIT).trimEnd() + "…"
            : review.text}
        </span>
        "
      </p>

      {needsTruncation && (
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mb-3 w-fit"
        >
          Lire la suite
          <ExternalLink size={11} />
        </a>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div>
          <p className="font-semibold text-sm text-foreground">{review.author}</p>
          {review.time && <p className="text-xs text-muted-foreground">{review.time}</p>}
        </div>
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
          title="Voir sur Google"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default ReviewCard;
