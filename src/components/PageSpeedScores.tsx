import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scores {
  performance: number | null;
  accessibility: number | null;
  "best-practices": number | null;
  seo: number | null;
}

const CATEGORIES = [
  { key: "performance" as const, label: "Perf" },
  { key: "accessibility" as const, label: "Access" },
  { key: "best-practices" as const, label: "Practices" },
  { key: "seo" as const, label: "SEO" },
];

const getColor = (score: number) => {
  if (score >= 90) return { stroke: "#0cce6b", bg: "rgba(12,206,107,0.12)" };
  if (score >= 50) return { stroke: "#ffa400", bg: "rgba(255,164,0,0.12)" };
  return { stroke: "#ff4e42", bg: "rgba(255,78,66,0.12)" };
};

const CircleScore = ({ score, label, size = 64 }: { score: number | null; label: string; size?: number }) => {
  const strokeWidth = size > 48 ? 5 : 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = score ?? 0;
  const offset = circumference - (pct / 100) * circumference;
  const { stroke, bg } = getColor(pct);
  const fontSize = size > 48 ? "text-sm" : "text-[10px]";
  const labelSize = size > 48 ? "text-[10px]" : "text-[8px]";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill={bg} stroke="rgba(128,128,128,0.15)" strokeWidth={strokeWidth} />
          {score !== null && (
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={stroke} strokeWidth={strokeWidth}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          )}
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center ${fontSize} font-bold`} style={{ color: score !== null ? stroke : "rgba(128,128,128,0.5)" }}>
          {score !== null ? pct : "—"}
        </span>
      </div>
      <span className={`${labelSize} font-medium text-muted-foreground`}>{label}</span>
    </div>
  );
};

const PageSpeedScores = ({ url, mini = false }: { url: string; mini?: boolean }) => {
  const [scores, setScores] = useState<Scores | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchScores = async () => {
    if (!url) return;
    setLoading(true);
    setError(false);
    try {
      const categories = "category=performance&category=accessibility&category=best-practices&category=seo";
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&${categories}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const cats = data.lighthouseResult?.categories;
      setScores({
        performance: cats?.performance ? Math.round(cats.performance.score * 100) : null,
        accessibility: cats?.accessibility ? Math.round(cats.accessibility.score * 100) : null,
        "best-practices": cats?.["best-practices"] ? Math.round(cats["best-practices"].score * 100) : null,
        seo: cats?.seo ? Math.round(cats.seo.score * 100) : null,
      });
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (url) fetchScores();
  }, [url]);

  if (!url) return null;

  const circleSize = mini ? 40 : 64;
  const textClass = mini ? "text-muted-foreground" : "text-primary-foreground/60";
  const btnClass = mini ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/50 hover:text-primary-foreground";

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${mini ? "" : "mt-3"}`}>
        <Loader2 className={`h-4 w-4 animate-spin ${textClass}`} />
        <span className={`text-xs ${textClass}`}>Analyse PageSpeed...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${mini ? "" : "mt-3"}`}>
        <span className={`text-xs ${textClass}`}>Erreur PageSpeed</span>
        <Button variant="ghost" size="sm" className={`h-6 px-2 ${btnClass}`} onClick={fetchScores}>
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (!scores) return null;

  return (
    <div className={`flex items-center gap-${mini ? "3" : "4"} ${mini ? "" : "mt-3"}`}>
      {CATEGORIES.map((c) => (
        <CircleScore key={c.key} score={scores[c.key]} label={c.label} size={circleSize} />
      ))}
      <Button variant="ghost" size="sm" className={`h-7 w-7 p-0 ${btnClass}`} onClick={fetchScores} title="Rafraichir">
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default PageSpeedScores;
