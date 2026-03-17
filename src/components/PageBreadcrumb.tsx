import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

const PageBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav
    aria-label="Fil d'Ariane"
    className="container py-3 -mb-4"
    itemScope
    itemType="https://schema.org/BreadcrumbList"
  >
    <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-1"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          {i > 0 && <ChevronRight size={12} className="text-border mx-0.5" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{item.label}</span>
            </Link>
          ) : (
            <span className="text-foreground font-medium" itemProp="name">
              {item.label}
            </span>
          )}
          <meta itemProp="position" content={String(i + 1)} />
        </li>
      ))}
    </ol>
  </nav>
);

export default PageBreadcrumb;
