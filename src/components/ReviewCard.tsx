import { Star } from "lucide-react";

export interface ReviewData {
  author: string;
  rating: number;
  text: string;
  time: string;
}

const ReviewCard = ({ review }: { review: ReviewData }) => (
  <div className="rounded-2xl bg-card p-6 shadow-card border border-border flex flex-col h-full">
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, j) => (
        <Star
          key={j}
          size={16}
          className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"}
        />
      ))}
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
      "{review.text}"
    </p>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-sm text-foreground">{review.author}</p>
        <p className="text-xs text-muted-foreground">{review.time}</p>
      </div>
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="h-4 w-4 opacity-60"
      />
    </div>
  </div>
);

export default ReviewCard;
