import { useState, useEffect, useLayoutEffect, useRef, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCmsOverrides } from "@/hooks/useCmsOverrides";
import { Pencil, Trash2, Tag, X, Save, Plus, Trash, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Upload, GripVertical, Undo2, Redo2 } from "lucide-react";

// ─── Undo/Redo Hook ───
function useUndoRedo<T>(initial: T) {
  const historyRef = useRef<T[]>([initial]);
  const indexRef = useRef(0);
  const [, forceRender] = useState(0);

  const current = historyRef.current[indexRef.current];

  const set = useCallback((val: T | ((prev: T) => T)) => {
    const idx = indexRef.current;
    const resolved = typeof val === "function" ? (val as (p: T) => T)(historyRef.current[idx]) : val;
    historyRef.current = [...historyRef.current.slice(0, idx + 1), resolved];
    if (historyRef.current.length > 50) historyRef.current.shift();
    else indexRef.current = idx + 1;
    forceRender(n => n + 1);
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current > 0) { indexRef.current--; forceRender(n => n + 1); }
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) { indexRef.current++; forceRender(n => n + 1); }
  }, []);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  const reset = useCallback((val: T) => {
    historyRef.current = [val];
    indexRef.current = 0;
    forceRender(n => n + 1);
  }, []);

  return { current, set, undo, redo, canUndo, canRedo, reset };
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { compressImage, UPLOAD_OPTIONS } from "@/lib/imageCompression";
import { lazy, Suspense } from "react";
const RichTextEditor = lazy(() => import("./RichTextEditor"));

export interface EditableSectionProps {
  blockId: string;
  pagePath: string;
  children: ReactNode;
  label?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  displayIndex?: number;
}

interface CtaItem {
  id: string;
  text: string;
  url: string;
  style: "primary" | "secondary";
  enabled: boolean;
}

interface SubItem {
  id: string;
  heading: string;
  text: string;
  image: string;
  imageAlt: string;
  url: string;
  ctas: CtaItem[];
}

interface LogoItem {
  id: string;
  name: string;
  src: string;
}

type BgColor = "none" | "blue" | "beige";

interface StructuredContent {
  label: string;
  heading: string;
  text: string;
  textHtml: string;
  image: string;
  imageAlt: string;
  ctas: CtaItem[];
  items: SubItem[];
  logos: LogoItem[];
  bgColor: BgColor;
}

interface SectionRevision {
  id: string;
  savedAt: string;
  label: string;
  structured: StructuredContent;
}

interface Override {
  id: string;
  content: { structured?: StructuredContent; label?: string; revisions?: SectionRevision[]; [key: string]: any };
}

const emptyStructured = (label = ""): StructuredContent => ({
  label, heading: "", text: "", textHtml: "", image: "", imageAlt: "", ctas: [], items: [], logos: [], bgColor: "none",
});

const BG_CLASS_MAP: Record<BgColor, string> = {
  none: "",
  blue: "bg-section-blue",
  beige: "bg-section-rose",
};

function normalizeStructuredContent(content?: Partial<StructuredContent> | null, fallbackLabel = ""): StructuredContent {
  return {
    label: typeof content?.label === "string" ? content.label : fallbackLabel,
    heading: typeof content?.heading === "string" ? content.heading : "",
    text: typeof content?.text === "string" ? content.text : "",
    textHtml: typeof content?.textHtml === "string" ? content.textHtml : "",
    image: typeof content?.image === "string" ? content.image : "",
    imageAlt: typeof content?.imageAlt === "string" ? content.imageAlt : "",
    ctas: Array.isArray(content?.ctas) ? content.ctas : [],
    items: Array.isArray(content?.items) ? content.items : [],
    logos: Array.isArray(content?.logos) ? content.logos : [],
    bgColor: (content?.bgColor === "blue" || content?.bgColor === "beige") ? content.bgColor : "none",
  };
}

/** Detect CTA links inside an element — only real button-style CTAs */
function extractCtas(el: Element): CtaItem[] {
  const ctas: CtaItem[] = [];
  let ctaId = 0;
  const links = el.querySelectorAll("a");
  links.forEach((a) => {
    if (a.closest("[data-inline-cta='true']") || a.hasAttribute("data-inline-cta-link")) return;
    const parent = a.closest("button, .btn, [class*='Button']");
    const cls = (a.className || "") + " " + (parent?.className || "");
    // Must be inside a Button component OR have explicit CTA-like classes (gradient, btn-glow, shadow-glow/shadow-lg)
    const isCta = parent || cls.includes("gradient-primary") || cls.includes("gradient-miami") || cls.includes("btn-glow") || cls.includes("shadow-glow") || cls.includes("shadow-lg");
    if (isCta) {
      const isPrimary = cls.includes("gradient-primary") || cls.includes("gradient-miami") || !cls.includes("outline");
      ctas.push({
        id: `cta-${ctaId++}`,
        text: a.textContent?.trim() || "",
        url: a.getAttribute("href") || "",
        style: isPrimary ? "primary" : "secondary",
        enabled: true,
      });
    }
  });
  return ctas;
}

/** Extract ALL text content from an element - headings and paragraphs */
function extractAllTexts(el: Element): string {
  const texts: string[] = [];
  // Get all headings (h2, h3, h4, h5, h6) and paragraphs
  const elements = el.querySelectorAll("h2, h3, h4, h5, h6, p, li");
  elements.forEach((node) => {
    const t = node.textContent?.trim();
    if (t && t.length > 3) {
      const tag = node.tagName.toLowerCase();
      if (tag.startsWith("h")) {
        texts.push(`[${tag.toUpperCase()}] ${t}`);
      } else {
        texts.push(t);
      }
    }
  });
  return texts.join("\n\n");
}

function extractRichTextHtml(el: Element): string {
  const blocks = Array.from(el.querySelectorAll("h2, h3, h4, h5, h6, p, ul, ol, blockquote, hr"));
  return blocks
    .map((node) => node.outerHTML)
    .join("");
}

/** Extract first significant image */
function extractImage(el: Element): { src: string; alt: string } {
  const imgs = el.querySelectorAll("img");
  for (const img of imgs) {
    const w = img.getAttribute("width");
    if (w && parseInt(w) < 64) continue;
    return { src: img.getAttribute("src") || "", alt: img.getAttribute("alt") || "" };
  }
  return { src: "", alt: "" };
}

/** Parse DOM element into structured fields, detecting sub-items */
function parseDomToStructured(el: HTMLElement, fallbackLabel: string): StructuredContent {
  const result = emptyStructured(fallbackLabel);

  const h1 = el.querySelector("h1");
  if (h1) result.heading = h1.textContent?.trim() || "";

  const img = extractImage(el);
  result.image = img.src;
  result.imageAlt = img.alt;

  // Detect logo carousel items
  const logos = detectLogos(el);
  if (logos.length > 0) {
    result.logos = logos;
  }

  const subSections = detectSubItems(el);

  if (subSections.length >= 2) {
    result.items = subSections;
    result.text = "";
    result.textHtml = "";
    result.ctas = extractCtas(el);
    const subCtaTexts = new Set(subSections.flatMap(s => s.ctas.map(c => c.text)));
    result.ctas = result.ctas.filter(c => !subCtaTexts.has(c.text));
  } else {
    result.text = extractAllTexts(el);
    result.textHtml = extractRichTextHtml(el);
    result.ctas = extractCtas(el);
  }

  // Detect current background color
  const elCls = el.className || "";
  const firstChild = el.firstElementChild as HTMLElement | null;
  const childCls = firstChild?.className || "";
  const allCls = elCls + " " + childCls;
  if (allCls.includes("bg-section-blue")) result.bgColor = "blue";
  else if (allCls.includes("bg-section-rose") || allCls.includes("bg-section-alt")) result.bgColor = "beige";

  return result;
}

/** Detect logo/tech items in a scrolling carousel or logo grid */
function detectLogos(el: HTMLElement): LogoItem[] {
  // Look for repeated img elements inside a scrolling container
  const scrollContainers = el.querySelectorAll("[class*='animate-scroll'], [class*='overflow-hidden'] > [class*='flex']");
  for (const container of scrollContainers) {
    const items = container.querySelectorAll(":scope > div");
    if (items.length < 2) continue;
    
    const logos: LogoItem[] = [];
    const seen = new Set<string>();
    items.forEach((item) => {
      const img = item.querySelector("img");
      const nameEl = item.querySelector("span");
      if (!img) return;
      const src = img.getAttribute("src") || "";
      const name = nameEl?.textContent?.trim() || img.getAttribute("alt") || "";
      const key = name + src;
      if (seen.has(key)) return; // skip duplicates from the doubled carousel
      seen.add(key);
      logos.push({ id: `logo-${logos.length}`, name, src });
    });
    if (logos.length >= 2) return logos;
  }
  return [];
}

/** Detect repeating card/item patterns within a section */
function detectSubItems(el: HTMLElement): SubItem[] {
  const containers = el.querySelectorAll("[class*='grid'], [class*='flex']");
  for (const container of containers) {
    if (container.querySelector("h1")) continue;

    const children = Array.from(container.children);
    const withHeadings = children.filter(child =>
      child.querySelector("h2, h3, h4") || child.querySelector("[class*='font-bold'], [class*='font-semibold']")
    );

    if (withHeadings.length >= 2 && withHeadings.length === children.length) {
      return withHeadings.map((child, i) => {
        const heading = child.querySelector("h2, h3, h4");
        const boldEl = !heading ? child.querySelector("[class*='font-bold'], [class*='font-semibold']") : null;
        const img = extractImage(child);
        // Detect if the card itself is an <a> (clickable card pattern)
        const cardLink = child.tagName === "A" ? (child as HTMLAnchorElement).href : "";
        return {
          id: `item-${i}`,
          heading: heading?.textContent?.trim() || boldEl?.textContent?.trim() || `Élément ${i + 1}`,
          text: extractAllTexts(child),
          image: img.src,
          imageAlt: img.alt,
          url: cardLink,
          ctas: extractCtas(child),
        };
      });
    }
  }

  return [];
}

/**
 * Apply saved structured content onto the live DOM without replacing children.
 */
function applyOverrideToDOM(el: HTMLElement, s: StructuredContent) {
  s = normalizeStructuredContent(s);

  // Apply background color
  if (s.bgColor && s.bgColor !== "none") {
    const target = el.firstElementChild as HTMLElement || el;
    // Remove existing bg-section-* classes
    target.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
    el.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
    const newClass = BG_CLASS_MAP[s.bgColor];
    if (newClass) target.classList.add(newClass);
  } else if (s.bgColor === "none") {
    const target = el.firstElementChild as HTMLElement || el;
    target.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
    el.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
  }

  if (s.heading) {
    const h1 = el.querySelector("h1");
    if (h1) h1.textContent = s.heading;
  }

  if (s.image) {
    const imgs = el.querySelectorAll("img");
    for (const img of imgs) {
      const w = img.getAttribute("width");
      if (w && parseInt(w) < 64) continue;
      img.setAttribute("src", s.image);
      if (s.imageAlt) img.setAttribute("alt", s.imageAlt);
      break;
    }
  }

  // Patch text content - handle tagged headings
  if (s.textHtml && s.items.length === 0) {
    applyRichTextHtmlToDOM(el, s.textHtml);
  } else if (s.text && s.items.length === 0) {
    const lines = s.text.split("\n\n").filter(t => t.trim());
    const taggedLines: { tag: string | null; text: string }[] = lines.map(line => {
      const match = line.match(/^\[(H[2-6])\]\s*(.*)/i);
      if (match) return { tag: match[1].toLowerCase(), text: match[2] };
      return { tag: null, text: line };
    });

    // Apply heading changes
    const headingElements = el.querySelectorAll("h2, h3, h4, h5, h6");
    const paragraphElements = el.querySelectorAll("p");
    
    let hIdx = 0, pIdx = 0;
    taggedLines.forEach(({ tag, text }) => {
      if (tag) {
        if (headingElements[hIdx]) {
          headingElements[hIdx].textContent = text.trim();
          hIdx++;
        }
      } else {
        // Find next significant paragraph
        while (pIdx < paragraphElements.length) {
          const pt = paragraphElements[pIdx].textContent?.trim();
          if (pt && pt.length > 3) {
            paragraphElements[pIdx].textContent = text.trim();
            pIdx++;
            break;
          }
          pIdx++;
        }
      }
    });
  }

  if (s.items.length > 0) {
    applySubItemsToDOM(el, s.items);
  }

  // Apply logo overrides
  if (s.logos && s.logos.length > 0) {
    applyLogosToDOM(el, s.logos);
  }

  const enabledCtas = s.ctas.filter(c => c.enabled && c.text && c.url);
  patchCtaLinks(el, enabledCtas);
}

function applyInlineLinkStyles(container: ParentNode) {
  container.querySelectorAll("a").forEach((link) => {
    if (link.closest("[data-inline-cta='true']") || link.hasAttribute("data-inline-cta-link")) return;
    link.classList.remove("underline", "decoration-primary/50");
    link.classList.add("text-primary", "font-medium");
  });
}

function applyRichTextHtmlToDOM(el: HTMLElement, html: string) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

   el.querySelectorAll("[data-inline-rich-text-block='true']").forEach((node) => node.remove());

  const blocks = Array.from(temp.childNodes).flatMap((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return [];
      const p = document.createElement("p");
      p.textContent = text;
      return [p];
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return [node as HTMLElement];
    }

    return [];
  });

  const headingElements = Array.from(el.querySelectorAll("h2, h3, h4, h5, h6")) as HTMLElement[];
  const paragraphElements = Array.from(el.querySelectorAll("p")).filter((p) => {
    const text = p.textContent?.trim();
    return !!text && text.length > 1;
  }) as HTMLElement[];
  const listElements = Array.from(el.querySelectorAll("ul, ol")) as HTMLElement[];
  const quoteElements = Array.from(el.querySelectorAll("blockquote")) as HTMLElement[];
  const hrElements = Array.from(el.querySelectorAll("hr")) as HTMLElement[];

  let headingIndex = 0;
  let paragraphIndex = 0;
  let listIndex = 0;
  let quoteIndex = 0;
  let hrIndex = 0;

  const matchedBlocks: Array<{ source: HTMLElement; target: HTMLElement | null }> = [];

  const buildInlineRichTextBlock = (block: HTMLElement): HTMLElement | null => {
    const tag = block.tagName.toLowerCase();

    if (tag === "div" && block.classList.contains("cta-block")) {
      const ctaStyle = block.getAttribute("data-cta-style") === "secondary" ? "secondary" : "primary";
      const href = block.getAttribute("data-href") || block.querySelector("a")?.getAttribute("href") || "/";
      const label = block.getAttribute("data-label") || block.querySelector("a")?.textContent?.trim() || block.textContent?.trim() || "CTA";

      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-inline-rich-text-block", "true");
      wrapper.setAttribute("data-inline-cta", "true");
      wrapper.className = "my-6";

      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.setAttribute("data-inline-cta-link", "true");
      link.className = ctaStyle === "secondary"
        ? "inline-flex items-center justify-center rounded-full gradient-miami btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        : "inline-flex items-center justify-center rounded-full gradient-primary btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90";
      link.textContent = label;

      wrapper.appendChild(link);
      return wrapper;
    }

    const clone = block.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-inline-rich-text-block", "true");
    if (tag === "hr" && !clone.className) {
      clone.className = "my-6 border-border";
    }
    applyInlineLinkStyles(clone);
    return clone;
  };

  const defaultContainer = headingElements[0]?.parentElement
    || paragraphElements[0]?.parentElement
    || listElements[0]?.parentElement
    || quoteElements[0]?.parentElement
    || hrElements[0]?.parentElement
    || el;

  blocks.forEach((block) => {
    const tag = block.tagName.toLowerCase();

    if (/^h[2-6]$/.test(tag)) {
      if (headingElements[headingIndex]) {
        headingElements[headingIndex].innerHTML = block.innerHTML;
        applyInlineLinkStyles(headingElements[headingIndex]);
        matchedBlocks.push({ source: block, target: headingElements[headingIndex] });
        headingIndex++;
      } else {
        matchedBlocks.push({ source: block, target: null });
      }
      return;
    }

    if (tag === "p") {
      if (paragraphElements[paragraphIndex]) {
        paragraphElements[paragraphIndex].innerHTML = block.innerHTML;
        applyInlineLinkStyles(paragraphElements[paragraphIndex]);
        matchedBlocks.push({ source: block, target: paragraphElements[paragraphIndex] });
        paragraphIndex++;
      } else {
        matchedBlocks.push({ source: block, target: null });
      }
      return;
    }

    if (tag === "ul" || tag === "ol") {
      if (listElements[listIndex]) {
        listElements[listIndex].innerHTML = block.innerHTML;
        applyInlineLinkStyles(listElements[listIndex]);
        matchedBlocks.push({ source: block, target: listElements[listIndex] });
        listIndex++;
      } else {
        matchedBlocks.push({ source: block, target: null });
      }
      return;
    }

    if (tag === "blockquote") {
      if (quoteElements[quoteIndex]) {
        quoteElements[quoteIndex].innerHTML = block.innerHTML;
        applyInlineLinkStyles(quoteElements[quoteIndex]);
        matchedBlocks.push({ source: block, target: quoteElements[quoteIndex] });
        quoteIndex++;
      } else {
        matchedBlocks.push({ source: block, target: null });
      }
      return;
    }

    if (tag === "hr") {
      if (hrElements[hrIndex]) {
        matchedBlocks.push({ source: block, target: hrElements[hrIndex] });
        hrIndex++;
      } else {
        matchedBlocks.push({ source: block, target: null });
      }
      return;
    }

    if (tag === "div" && block.classList.contains("cta-block")) {
      matchedBlocks.push({ source: block, target: null });
    }
  });

  let previousAnchor: HTMLElement | null = null;

  matchedBlocks.forEach((entry, index) => {
    if (entry.target) {
      previousAnchor = entry.target;
      return;
    }

    const injectedBlock = buildInlineRichTextBlock(entry.source);
    if (!injectedBlock) return;

    const nextTarget = matchedBlocks.slice(index + 1).find((candidate) => candidate.target)?.target ?? null;

    if (nextTarget?.parentElement) {
      nextTarget.parentElement.insertBefore(injectedBlock, nextTarget);
    } else if (previousAnchor) {
      previousAnchor.insertAdjacentElement("afterend", injectedBlock);
    } else {
      defaultContainer.appendChild(injectedBlock);
    }

    previousAnchor = injectedBlock;
  });
}

function buildGeneratedCtaLink(cta: CtaItem): HTMLAnchorElement {
  const link = document.createElement("a");
  link.setAttribute("href", cta.url);
  link.setAttribute("data-inline-cta-link", "true");
  link.className = cta.style === "secondary"
    ? "inline-flex items-center justify-center rounded-full gradient-miami btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
    : "inline-flex items-center justify-center rounded-full gradient-primary btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90";
  link.textContent = cta.text.trim();
  return link;
}

/** Rebuild the logo carousel from saved logos */
function applyLogosToDOM(el: HTMLElement, logos: LogoItem[]) {
  const scrollContainers = el.querySelectorAll("[class*='animate-scroll'], [class*='overflow-hidden'] > [class*='flex']");
  for (const container of scrollContainers) {
    // Clear and rebuild with doubled logos for infinite scroll
    container.innerHTML = "";
    const allLogos = [...logos, ...logos]; // duplicate for seamless scroll
    allLogos.forEach((logo) => {
      const div = document.createElement("div");
      div.className = "flex flex-col items-center gap-3 shrink-0";
      div.innerHTML = `
        <div class="rounded-2xl bg-secondary p-5 shadow-card">
          <img src="${logo.src}" alt="${logo.name}" class="h-16 w-16 md:h-20 md:w-20 object-contain" loading="lazy" decoding="async" width="80" height="80" />
        </div>
        <span class="text-sm font-medium text-muted-foreground">${logo.name}</span>
      `;
      container.appendChild(div);
    });
    return; // only patch the first matching container
  }
}

function applySubItemsToDOM(el: HTMLElement, items: SubItem[]) {
  const containers = el.querySelectorAll("[class*='grid'], [class*='flex']");
  for (const container of containers) {
    const children = Array.from(container.children);
    const withHeadings = children.filter(child =>
      child.querySelector("h2, h3, h4") || child.querySelector("[class*='font-bold'], [class*='font-semibold']")
    );

    if (withHeadings.length >= 2 && withHeadings.length === children.length) {
      withHeadings.forEach((child, i) => {
        if (!items[i]) return;
        const item = items[i];

        // Patch wrapping <a> href if the card is a link
        if (item.url && child.tagName === "A") {
          (child as HTMLAnchorElement).href = item.url;
        }

        const heading = child.querySelector("h2, h3, h4");
        const boldEl = !heading ? child.querySelector("[class*='font-bold'], [class*='font-semibold']") : null;
        if (heading && item.heading) heading.textContent = item.heading;
        else if (boldEl && item.heading) boldEl.textContent = item.heading;

        if (item.text) {
          const paragraphs = child.querySelectorAll("p");
          const significantPs: HTMLParagraphElement[] = [];
          paragraphs.forEach(p => {
            const t = p.textContent?.trim();
            if (t && t.length > 3) significantPs.push(p);
          });

          if (item.text.trim().startsWith("<")) {
            const temp = document.createElement("div");
            temp.innerHTML = item.text;

            const richBlocks = Array.from(temp.childNodes).flatMap((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (!text) return [];
                const p = document.createElement("p");
                p.textContent = text;
                return [p];
              }

              if (node.nodeType === Node.ELEMENT_NODE) {
                return [node as HTMLElement];
              }

              return [];
            });

            let pIdx = 0;
            richBlocks.forEach((block) => {
              const tag = block.tagName.toLowerCase();
              if ((tag === "p" || tag === "blockquote") && significantPs[pIdx]) {
                significantPs[pIdx].innerHTML = block.innerHTML;
                applyInlineLinkStyles(significantPs[pIdx]);
                pIdx++;
              }
            });
          } else {
            const lines = item.text.split("\n\n").filter(t => t.trim());
            let pIdx = 0;
            lines.forEach(txt => {
              if (txt.match(/^\[H[2-6]\]/i)) return;
              if (significantPs[pIdx]) {
                significantPs[pIdx].textContent = txt.trim();
                pIdx++;
              }
            });
          }
        }

        if (item.image) {
          const img = child.querySelector("img");
          if (img) {
            img.setAttribute("src", item.image);
            if (item.imageAlt) img.setAttribute("alt", item.imageAlt);
          }
        }

        const enabledCtas = item.ctas.filter(c => c.enabled && c.text && c.url);
        patchCtaLinks(child as HTMLElement, enabledCtas);
      });
      return;
    }
  }
}

function patchCtaLinks(el: Element, enabledCtas: CtaItem[]) {
  el.querySelectorAll("[data-generated-cta-group='true']").forEach((node) => node.remove());

  const links = el.querySelectorAll("a");
  const ctaLinks: HTMLAnchorElement[] = [];
  links.forEach(a => {
    if (a.closest("[data-inline-cta='true']") || a.hasAttribute("data-inline-cta-link")) return;
    const parent = a.closest("button, .btn, [class*='Button']");
    const cls = (a.className || "") + " " + (parent?.className || "");
    const isCta = parent || cls.includes("gradient-primary") || cls.includes("gradient-miami") || cls.includes("btn-glow") || cls.includes("shadow-glow") || cls.includes("shadow-lg");
    if (isCta) ctaLinks.push(a);
  });

  const applyCtaStyles = (a: HTMLAnchorElement, cta: CtaItem) => {
    a.classList.remove("border", "border-white", "border-foreground", "bg-transparent", "bg-secondary", "text-foreground", "text-primary", "text-white");
    a.classList.add("inline-flex", "items-center", "justify-center", "rounded-full", "px-6", "py-3", "font-semibold", "text-primary-foreground");

    if (cta.style === "secondary") {
      a.classList.remove("gradient-primary");
      a.classList.add("gradient-miami", "btn-glow", "shadow-glow");
    } else {
      a.classList.remove("gradient-miami");
      a.classList.add("gradient-primary", "btn-glow", "shadow-glow");
    }
  };

  enabledCtas.forEach((cta, i) => {
    if (ctaLinks[i]) {
      const a = ctaLinks[i];
      // Update text
      const textNode = Array.from(a.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = cta.text;
      } else {
        const span = a.querySelector("span");
        if (span) span.textContent = cta.text;
        else a.textContent = cta.text;
      }
      a.setAttribute("href", cta.url);
      a.style.removeProperty("background");
      applyCtaStyles(a, cta);
    }
  });

  const missingCtas = enabledCtas.slice(ctaLinks.length).filter((cta) => cta.text.trim() && cta.url.trim());

  if (missingCtas.length > 0) {
    const group = document.createElement("div");
    group.setAttribute("data-generated-cta-group", "true");
    group.className = "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap";

    missingCtas.forEach((cta) => {
      group.appendChild(buildGeneratedCtaLink(cta));
    });

    const insertionAnchor = Array.from(el.querySelectorAll("[data-inline-rich-text-block='true'], h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, hr")).pop() as HTMLElement | undefined;

    if (insertionAnchor) {
      insertionAnchor.insertAdjacentElement("afterend", group);
    } else {
      (el.firstElementChild as HTMLElement | null)?.appendChild(group) ?? el.appendChild(group);
    }
  }
}

// ─── Sub-item editor component ───
const SubItemEditor = ({ item, index, onChange, onRemove }: {
  item: SubItem; index: number;
  onChange: (updated: SubItem) => void;
  onRemove: () => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateField = (field: keyof SubItem, value: any) => onChange({ ...item, [field]: value });

  const addCta = () => onChange({
    ...item,
    ctas: [...item.ctas, { id: `cta-${Date.now()}`, text: "", url: "", style: "primary" as const, enabled: true }],
  });

  const updateCta = (id: string, field: keyof CtaItem, value: any) => onChange({
    ...item,
    ctas: item.ctas.map(c => c.id === id ? { ...c, [field]: value } : c),
  });

  const removeCta = (id: string) => onChange({
    ...item,
    ctas: item.ctas.filter(c => c.id !== id),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const path = `sections/${Date.now()}-${compressed.name}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, compressed, UPLOAD_OPTIONS);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(path);
      onChange({ ...item, image: urlData.publicUrl });
      toast({ title: "Image uploadée ✅" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    }
    e.target.value = "";
  };

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        <span className="text-sm font-semibold flex-1 truncate">
          {item.heading || `Élément ${index + 1}`}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="rounded p-1 text-destructive hover:bg-destructive/10" title="Supprimer">
          <Trash size={14} />
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3 pl-1">
          {item.url !== undefined && item.url !== "" && (
            <div>
              <Label className="text-xs font-medium">🔗 Lien de la carte</Label>
              <Input value={item.url} onChange={e => updateField("url", e.target.value)} placeholder="https://..." className="mt-1 text-sm" />
            </div>
          )}
          <div>
            <Label className="text-xs font-medium">Titre</Label>
            <Input value={item.heading} onChange={e => updateField("heading", e.target.value)} className="mt-1 text-sm" />
          </div>
          <div>
            <Label className="text-xs font-medium">Texte</Label>
            <div className="mt-1">
              <Suspense fallback={<div className="h-40 animate-pulse rounded bg-muted" />}>
                <RichTextEditor
                  content={item.text.trim().startsWith("<") ? item.text : taggedTextToHtml(item.text)}
                  onChange={(html) => updateField("text", html)}
                />
              </Suspense>
            </div>
          </div>
          <div>
            <Label className="text-xs font-medium">Image</Label>
            {item.image && <img src={item.image} alt={item.imageAlt} className="w-full h-20 object-cover rounded mt-1" />}
            <div className="flex gap-2 mt-1">
              <Input value={item.image} onChange={e => updateField("image", e.target.value)} placeholder="URL image" className="text-sm flex-1" />
              <label>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Button type="button" variant="outline" size="sm" className="gap-1 whitespace-nowrap text-xs" asChild>
                  <span><Upload size={12} /> Upload</span>
                </Button>
              </label>
            </div>
            <Input value={item.imageAlt} onChange={e => updateField("imageAlt", e.target.value)} placeholder="Alt" className="mt-1 text-sm" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs font-medium">CTAs</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addCta} className="h-6 text-xs gap-1">
                <Plus size={12} /> CTA
              </Button>
            </div>
            {item.ctas.map((cta, ci) => (
              <div key={cta.id} className={`rounded border p-2 mb-2 space-y-1 ${cta.enabled ? "border-primary/20" : "opacity-50"}`}>
                <div className="flex items-center gap-2">
                  <Checkbox checked={cta.enabled} onCheckedChange={v => updateCta(cta.id, "enabled", !!v)} />
                  <span className="text-xs flex-1">CTA {ci + 1}</span>
                  <button onClick={() => removeCta(cta.id)} className="text-destructive"><Trash size={12} /></button>
                </div>
                <Input value={cta.text} onChange={e => updateCta(cta.id, "text", e.target.value)} placeholder="Texte" className="text-xs h-7" />
                <Input value={cta.url} onChange={e => updateCta(cta.id, "url", e.target.value)} placeholder="Lien" className="text-xs h-7" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
// ─── Helpers: tagged text ↔ HTML ───
function taggedTextToHtml(text: string): string {
  if (!text) return "";
  // If already HTML, return as-is
  if (text.trim().startsWith("<")) return text;
  const lines = text.split("\n\n").filter(t => t.trim());
  return lines.map(line => {
    const match = line.match(/^\[(H[2-6])\]\s*(.*)/i);
    if (match) {
      const tag = match[1].toLowerCase();
      return `<${tag}>${match[2].trim()}</${tag}>`;
    }
    return `<p>${line.trim()}</p>`;
  }).join("");
}

function htmlToTaggedText(html: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  const parts: string[] = [];
  div.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || "";
      if (!text) return;
      if (/^h[2-6]$/.test(tag)) {
        parts.push(`[${tag.toUpperCase()}] ${text}`);
      } else {
        parts.push(text);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) parts.push(t);
    }
  });
  return parts.join("\n\n");
}

// ─── Logo Editor Component ───
const LogoEditor = ({ logos, onChange }: { logos: LogoItem[]; onChange: (logos: LogoItem[]) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const path = `logos/${Date.now()}-${compressed.name}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, compressed, UPLOAD_OPTIONS);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(path);
      const newLogo: LogoItem = {
        id: `logo-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        src: urlData.publicUrl,
      };
      onChange([...logos, newLogo]);
      toast({ title: "Logo ajouté ✅" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReplace = async (logoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      const path = `logos/${Date.now()}-${compressed.name}`;
      const { error } = await supabase.storage.from("cms-images").upload(path, compressed, UPLOAD_OPTIONS);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(path);
      onChange(logos.map(l => l.id === logoId ? { ...l, src: urlData.publicUrl } : l));
      toast({ title: "Logo remplacé ✅" });
    } catch (err: any) {
      toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
    }
  };

  const removeLogo = (id: string) => onChange(logos.filter(l => l.id !== id));
  const updateName = (id: string, name: string) => onChange(logos.map(l => l.id === id ? { ...l, name } : l));

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">🏢 Logos / Outils ({logos.length})</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1 text-xs">
          <Plus size={14} /> Ajouter
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {logos.map((logo) => (
          <div key={logo.id} className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex items-center justify-center bg-muted rounded-lg p-3 h-20">
              <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
            </div>
            <Input
              value={logo.name}
              onChange={(e) => updateName(logo.id, e.target.value)}
              className="text-xs h-7"
              placeholder="Nom"
            />
            <div className="flex gap-1">
              <label className="flex-1">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleReplace(logo.id, e)} />
                <Button type="button" variant="outline" size="sm" className="w-full text-xs h-7 gap-1" asChild>
                  <span><Upload size={12} /> Remplacer</span>
                </Button>
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeLogo(logo.id)} className="h-7 text-destructive hover:bg-destructive/10 px-2">
                <Trash size={12} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Keyboard shortcut component for undo/redo ───
const UndoRedoKeys = ({ onUndo, onRedo, canUndo, canRedo }: { onUndo: () => void; onRedo: () => void; canUndo: boolean; canRedo: boolean }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) { if (canRedo) onRedo(); }
        else { if (canUndo) onUndo(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUndo, onRedo, canUndo, canRedo]);
  return null;
};

// ─── Main Component ───
const EditableSection = ({ blockId, pagePath, children, label, onMoveUp, onMoveDown, displayIndex }: EditableSectionProps) => {
  const { isAdmin } = useAuth();
  const { getOverride: getCmsOverride, loaded: cmsLoaded, refresh: refreshCms } = useCmsOverrides();
  const compositeKey = `${pagePath}::${blockId}`;

  // Hydrate override synchronously from cache on first render
  const [override, setOverride] = useState<Override | null>(() => {
    const cached = getCmsOverride(compositeKey);
    return cached ? { id: cached.id, content: cached.content as Override["content"] } : null;
  });
  const [editing, setEditing] = useState(false);
  const fallbackStructuredLabel = label || blockId;
  const { current: rawStructured, set: setStructured, undo, redo, canUndo, canRedo, reset: resetHistory } = useUndoRedo<StructuredContent>(emptyStructured(fallbackStructuredLabel));
  const structured = normalizeStructuredContent(rawStructured, override?.content?.label || fallbackStructuredLabel);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(cmsLoaded);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cmsLoaded) return;
    const cached = getCmsOverride(compositeKey);
    if (cached) {
      setOverride({ id: cached.id, content: cached.content as Override["content"] });
    }
    setLoaded(true);
  }, [compositeKey, cmsLoaded, getCmsOverride]);

  // Re-apply overrides synchronously before paint to avoid layout shift
  const overrideRef = useRef(override);
  overrideRef.current = override;
  useLayoutEffect(() => {
    if (!overrideRef.current?.content?.structured || !contentRef.current) return;
    applyOverrideToDOM(contentRef.current, overrideRef.current.content.structured);
  }); // no deps = runs after every render

  const openEditor = () => {
    const fallbackLabel = override?.content?.label || label || blockId;
    const parsedFromDom = contentRef.current
      ? normalizeStructuredContent(parseDomToStructured(contentRef.current, fallbackLabel), fallbackLabel)
      : null;

    let initial: StructuredContent;
    if (override?.content?.structured) {
      const overrideStructured = normalizeStructuredContent(override.content.structured, fallbackLabel);
      const shouldPreferDomStructure = !!parsedFromDom
        && parsedFromDom.items.length === 0
        && overrideStructured.items.length > 0
        && !!contentRef.current?.querySelector("h1");

      initial = shouldPreferDomStructure
        ? parsedFromDom
        : {
            ...overrideStructured,
            heading: overrideStructured.heading || parsedFromDom?.heading || "",
            text: overrideStructured.text || parsedFromDom?.text || "",
            textHtml: overrideStructured.textHtml || parsedFromDom?.textHtml || "",
            image: overrideStructured.image || parsedFromDom?.image || "",
            imageAlt: overrideStructured.imageAlt || parsedFromDom?.imageAlt || "",
            ctas: overrideStructured.ctas.length > 0 ? overrideStructured.ctas : (parsedFromDom?.ctas || []),
          };
    } else if (parsedFromDom) {
      initial = parsedFromDom;
    } else {
      initial = emptyStructured(fallbackLabel);
    }
    resetHistory(initial);
    setEditing(true);
  };

  const savedRevisions: SectionRevision[] = Array.isArray(override?.content?.revisions)
    ? override.content.revisions.map((revision) => ({
        ...revision,
        structured: normalizeStructuredContent(revision.structured, revision.label || fallbackStructuredLabel),
      }))
    : [];

  const saveOverride = async () => {
    setSaving(true);
    const previousStructured = override?.content?.structured
      ? normalizeStructuredContent(override.content.structured, fallbackStructuredLabel)
      : null;
    const previousRevisions = Array.isArray(override?.content?.revisions) ? override.content.revisions : [];
    const hasChanged = previousStructured
      ? JSON.stringify(previousStructured) !== JSON.stringify(structured)
      : false;

    const revisions = previousStructured && hasChanged
      ? [{
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
          label: previousStructured.label || fallbackStructuredLabel,
          structured: previousStructured,
        }, ...previousRevisions].slice(0, 15)
      : previousRevisions;

    const content = { structured: structured as any, label: structured.label, revisions } as any;

    if (override) {
      await supabase
        .from("cms_page_blocks")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", override.id);
      setOverride({ ...override, content });
    } else {
      const { data } = await supabase
        .from("cms_page_blocks")
        .insert([{ page_path: compositeKey, block_type: "section_override", content, sort_order: 0 }])
        .select("id")
        .single();
      if (data) setOverride({ id: data.id, content });
    }

    if (contentRef.current) {
      applyOverrideToDOM(contentRef.current, structured);
    }

    setSaving(false);
    setEditing(false);
    toast({ title: "Section sauvegardée ✅" });
  };

  const resetOverride = async () => {
    if (!override) return;
    if (!confirm("Supprimer les modifications et revenir au contenu d'origine ?")) return;
    await supabase.from("cms_page_blocks").delete().eq("id", override.id);
    setOverride(null);
    toast({ title: "Section réinitialisée" });
    window.location.reload();
  };

  const updateField = <K extends keyof StructuredContent>(key: K, value: StructuredContent[K]) => {
    setStructured((prev) => ({ ...normalizeStructuredContent(prev, fallbackStructuredLabel), [key]: value }));
  };

  const updateRichText = (html: string) => {
    setStructured((prev) => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return {
        ...safePrev,
        textHtml: html,
        text: htmlToTaggedText(html),
      };
    });
  };

  const restoreRevision = (revision: SectionRevision) => {
    setStructured(normalizeStructuredContent(revision.structured, revision.label || fallbackStructuredLabel));
    toast({ title: "Révision chargée", description: "Enregistrez pour la remettre sur le site." });
  };

  const addCta = () => {
    setStructured((prev) => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return {
        ...safePrev,
        ctas: [...safePrev.ctas, { id: `cta-${Date.now()}`, text: "", url: "", style: "primary", enabled: true }],
      };
    });
  };

  const updateCta = (id: string, field: keyof CtaItem, value: any) => {
    setStructured((prev) => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return {
        ...safePrev,
        ctas: safePrev.ctas.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      };
    });
  };

  const removeCta = (id: string) => {
    setStructured((prev) => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return { ...safePrev, ctas: safePrev.ctas.filter((c) => c.id !== id) };
    });
  };

  const updateItem = (index: number, updated: SubItem) => {
    setStructured(prev => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return {
        ...safePrev,
        items: safePrev.items.map((it, i) => i === index ? updated : it),
      };
    });
  };

  const removeItem = (index: number) => {
    setStructured(prev => {
      const safePrev = normalizeStructuredContent(prev, fallbackStructuredLabel);
      return {
        ...safePrev,
        items: safePrev.items.filter((_, i) => i !== index),
      };
    });
  };

  if (!isAdmin) {
    const cachedBg = override?.content?.structured?.bgColor;
    const bgClass = cachedBg ? BG_CLASS_MAP[cachedBg as BgColor] || "" : "";
    const visitorClassName = [bgClass, !loaded ? "invisible" : ""].filter(Boolean).join(" ");

    return <div ref={contentRef} className={visitorClassName || undefined}>{children}</div>;
  }

  if (!loaded) return <>{children}</>;

  return (
    <>
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 z-[100] rounded-lg border-2 border-transparent transition group-hover:border-primary/30 group-hover:bg-primary/[0.02]" />
        <div className="absolute top-2 right-2 z-[101] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <span className="rounded bg-foreground/80 px-2 py-1 text-[11px] font-medium text-background flex items-center gap-1">
            <Tag size={10} />
            {override?.content?.label || label || blockId}
          </span>

          {/* Move up/down buttons */}
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="rounded bg-accent p-1.5 text-accent-foreground hover:bg-accent/80 transition"
              title="Déplacer vers le haut"
            >
              <ArrowUp size={14} />
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="rounded bg-accent p-1.5 text-accent-foreground hover:bg-accent/80 transition"
              title="Déplacer vers le bas"
            >
              <ArrowDown size={14} />
            </button>
          )}

          <button onClick={openEditor} className="rounded bg-primary p-1.5 text-primary-foreground hover:bg-primary/80 transition" title="Modifier cette section">
            <Pencil size={14} />
          </button>
          {override && (
            <button onClick={resetOverride} className="rounded bg-destructive p-1.5 text-destructive-foreground hover:bg-destructive/80 transition" title="Réinitialiser">
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div ref={contentRef}>{children}</div>
      </div>

      {/* Keyboard shortcuts for undo/redo */}
      {editing && <UndoRedoKeys onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />}

      {/* Editor Panel */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(false)} />
          <div className="relative ml-auto w-[560px] max-w-full h-full bg-background border-l shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold truncate flex-1">Modifier : {structured.label || blockId}</h3>
              <div className="flex items-center gap-1 ml-2">
                <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo} className="h-8 w-8 p-0" title="Annuler (Undo)">
                  <Undo2 size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo} className="h-8 w-8 p-0" title="Rétablir (Redo)">
                  <Redo2 size={16} />
                </Button>
                <button onClick={() => setEditing(false)} className="rounded p-1 hover:bg-muted ml-1"><X size={20} /></button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Block label */}
              <div>
                <Label className="mb-1.5 block text-sm font-semibold">🏷️ Nom du bloc</Label>
                <Input value={structured.label} onChange={(e) => updateField("label", e.target.value)} placeholder="Ex: Hero HP" />
              </div>

              {/* Background color */}
              <div className="rounded-lg border p-4 space-y-2">
                <Label className="text-sm font-semibold">🎨 Couleur de fond</Label>
                <div className="flex gap-3">
                  {([
                    { value: "none" as BgColor, label: "Par défaut", color: "bg-background" },
                    { value: "blue" as BgColor, label: "Bleu", color: "bg-[#e9f2f4]" },
                    { value: "beige" as BgColor, label: "Beige", color: "bg-[#f3e8ef]" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("bgColor", opt.value)}
                      className={`flex-1 rounded-lg border-2 p-3 text-center text-sm font-medium transition ${
                        structured.bgColor === opt.value
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-muted hover:border-primary/30"
                      }`}
                    >
                      <div className={`mx-auto mb-2 h-8 w-full rounded ${opt.color} border`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-2">
                <Label className="text-sm font-semibold">📝 Titre principal (H1)</Label>
                <Input
                  value={structured.heading}
                  onChange={(e) => updateField("heading", e.target.value)}
                  placeholder="Titre principal du bloc"
                  className="text-lg font-bold"
                />
              </div>

              {/* If there are sub-items, show them */}
              {structured.items.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">📦 Sous-éléments ({structured.items.length})</Label>
                  </div>
                  {structured.items.map((item, i) => (
                    <SubItemEditor
                      key={item.id}
                      item={item}
                      index={i}
                      onChange={(updated) => updateItem(i, updated)}
                      onRemove={() => removeItem(i)}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Global image */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">🖼️ Image</Label>
                    {structured.image && (
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        <img src={structured.image} alt={structured.imageAlt} className="w-full h-32 object-cover" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input value={structured.image} onChange={(e) => updateField("image", e.target.value)} placeholder="URL de l'image" className="flex-1" />
                      <label>
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const compressed = await compressImage(file);
                            const path = `sections/${Date.now()}-${compressed.name}`;
                            const { error } = await supabase.storage.from("cms-images").upload(path, compressed, UPLOAD_OPTIONS);
                            if (error) throw error;
                            const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(path);
                            updateField("image", urlData.publicUrl);
                            toast({ title: "Image uploadée ✅" });
                          } catch (err: any) {
                            toast({ title: "Erreur upload", description: err.message, variant: "destructive" });
                          }
                          e.target.value = "";
                        }} />
                        <Button type="button" variant="outline" size="sm" className="gap-1 whitespace-nowrap" asChild>
                          <span><Upload size={14} /> Upload</span>
                        </Button>
                      </label>
                    </div>
                    <Input value={structured.imageAlt} onChange={(e) => updateField("imageAlt", e.target.value)} placeholder="Texte alternatif (alt)" className="text-sm" />
                  </div>

                  {/* Global text - rich editor with sticky toolbar */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <Label className="text-sm font-semibold">📄 Contenu complet</Label>
                    <Suspense fallback={<div className="h-40 animate-pulse bg-muted rounded" />}>
                      <RichTextEditor
                        content={structured.textHtml || taggedTextToHtml(structured.text)}
                        onChange={updateRichText}
                      />
                    </Suspense>
                  </div>
                </>
              )}

              {savedRevisions.length > 0 && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold">🕘 Révisions précédentes</Label>
                    <p className="text-xs text-muted-foreground">Restaurer puis enregistrer.</p>
                  </div>
                  <div className="space-y-2">
                    {savedRevisions.map((revision, index) => (
                      <div key={revision.id || `${revision.savedAt}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{revision.label || `Révision ${savedRevisions.length - index}`}</p>
                          <p className="text-xs text-muted-foreground">{new Date(revision.savedAt).toLocaleString("fr-FR")}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => restoreRevision(revision)}>
                          Restaurer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logo carousel editor */}
              {structured.logos.length > 0 && (
                <LogoEditor
                  logos={structured.logos}
                  onChange={(logos) => updateField("logos", logos)}
                />
              )}

              {/* Global CTAs */}
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">🔘 Boutons CTA</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCta} className="gap-1 text-xs">
                    <Plus size={14} /> Ajouter un CTA
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Cochez ceux que vous voulez afficher.</p>

                {structured.ctas.length === 0 && (
                  <p className="text-sm text-muted-foreground italic py-2">Aucun CTA détecté.</p>
                )}

                {structured.ctas.map((cta, i) => (
                  <div key={cta.id} className={`rounded-lg border p-3 space-y-2 transition ${cta.enabled ? "bg-primary/5 border-primary/20" : "bg-muted/50 opacity-60"}`}>
                    <div className="flex items-center gap-3">
                      <Checkbox checked={cta.enabled} onCheckedChange={(v) => updateCta(cta.id, "enabled", !!v)} />
                      <span className="text-sm font-medium flex-1">CTA {i + 1}</span>
                      <select value={cta.style} onChange={(e) => updateCta(cta.id, "style", e.target.value)} className="rounded border bg-background px-2 py-1 text-xs">
                        <option value="primary">Primaire</option>
                        <option value="secondary">Secondaire</option>
                      </select>
                      <button onClick={() => removeCta(cta.id)} className="rounded p-1 text-destructive hover:bg-destructive/10 transition" title="Supprimer">
                        <Trash size={14} />
                      </button>
                    </div>
                    <Input value={cta.text} onChange={(e) => updateCta(cta.id, "text", e.target.value)} placeholder="Texte du bouton" className="text-sm" />
                    <Input value={cta.url} onChange={(e) => updateCta(cta.id, "url", e.target.value)} placeholder="Lien (ex: /audit-seo-gratuit)" className="text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t p-4">
              <Button onClick={saveOverride} disabled={saving} className="w-full gap-2">
                <Save size={16} /> {saving ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableSection;
