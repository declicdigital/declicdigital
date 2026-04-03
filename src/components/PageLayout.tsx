import { lazy, ReactNode, Suspense, Children, isValidElement, cloneElement } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/hooks/useAuth";

const Footer = lazy(() => import("./Footer"));
const BlogCarousel = lazy(() => import("./BlogCarousel"));
const AiChatWidget = lazy(() => import("./FaqAiChat").then(m => ({ default: m.AiChatWidget })));
const AdminBar = lazy(() => import("./admin/AdminBar"));
const EditableSection = lazy(() => import("./admin/EditableSection"));

interface PageLayoutProps {
  children: ReactNode;
  hideBlogCarousel?: boolean;
}

/** Flatten fragments so we get individual elements */
function flattenChildren(children: ReactNode): ReactNode[] {
  const flat: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (child != null && child !== false && child !== true) {
      flat.push(child);
    }
  });
  return flat;
}

/** Try to extract a human-readable label from a section element */
function guessLabel(child: any, index: number): string {
  if (!isValidElement(child)) return `Section ${index + 1}`;
  const props = child.props as any;
  
  // If it's already an EditableSection, skip wrapping
  // Check className or id for hints
  const className = props?.className || "";
  const id = props?.id || "";
  
  if (id) return id;
  if (className.includes("gradient-hero")) return "Hero";
  if (className.includes("gradient-miami")) return "CTA Miami";
  
  return `Section ${index + 1}`;
}

/** Check if an element is already wrapped in EditableSection */
function isAlreadyEditable(child: any): boolean {
  if (!isValidElement(child)) return false;
  const type = (child as any).type;
  // Check displayName or name
  const name = type?.displayName || type?.name || type?._payload?.value?.name || "";
  if (name === "EditableSection") return true;
  // Check if it's a lazy component wrapping EditableSection — we check the rendered type via a custom prop
  const props = child.props as any;
  if (props?.blockId !== undefined && props?.pagePath !== undefined) return true;
  return false;
}

const PageLayout = ({ children, hideBlogCarousel = false }: PageLayoutProps) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const pagePath = location.pathname;

  const wrappedChildren = (() => {
    if (!isAdmin) return children;
    
    const flat = flattenChildren(children);
    return flat.map((child, index) => {
      // Skip non-elements, Suspense wrappers, or already-editable sections
      if (!isValidElement(child)) return child;
      if (isAlreadyEditable(child)) return child;
      
      const blockId = `auto-${index}`;
      const label = guessLabel(child, index);
      
      return (
        <Suspense key={index} fallback={child}>
          <EditableSection blockId={blockId} pagePath={pagePath} label={label}>
            {child}
          </EditableSection>
        </Suspense>
      );
    });
  })();

  return (
    <div className="flex min-h-screen flex-col">
      {isAdmin && <Suspense fallback={null}><AdminBar /></Suspense>}
      <Header isAdmin={isAdmin} />
      <main className="flex-1">{wrappedChildren}</main>
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        {!hideBlogCarousel && <BlogCarousel />}
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <AiChatWidget />
      </Suspense>
    </div>
  );
};

export default PageLayout;
