import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const PageBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://declicdigital.net${item.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Fil d'Ariane" className="container pt-2 pb-3">
        <ol className="flex flex-wrap items-center gap-1 text-sm" style={{ color: "#2B1E3F" }}>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight size={12} className="mx-0.5" style={{ color: "#2B1E3F", opacity: 0.4 }} />
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  className="transition-opacity hover:opacity-70 font-normal"
                  style={{ color: "#2B1E3F" }}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold" style={{ color: "#2B1E3F" }}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default PageBreadcrumb;
