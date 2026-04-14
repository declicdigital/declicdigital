/**
 * Lightweight CMS patcher for visitor-facing pages.
 * Applies saved CMS overrides to DOM without loading the full admin EditableSection.
 */
import { useLayoutEffect, useRef, ReactNode } from "react";
import { useCmsOverrides } from "@/hooks/useCmsOverrides";

interface Props {
  blockId: string;
  pagePath: string;
  children: ReactNode;
}

type BgColor = "none" | "blue" | "sable";

interface CtaItem { id: string; text: string; url: string; style: "primary" | "secondary"; enabled: boolean; }
interface SubItem { id: string; heading: string; text: string; image: string; imageAlt: string; url: string; ctas: CtaItem[]; }
interface LogoItem { id: string; name: string; src: string; }
interface StructuredContent {
  label: string; heading: string; text: string; textHtml: string;
  image: string; imageAlt: string; ctas: CtaItem[]; items: SubItem[];
  logos: LogoItem[]; bgColor: BgColor;
}

const BG_CLASS_MAP: Record<BgColor, string> = { none: "", blue: "bg-section-blue", sable: "bg-section-rose" };

function normalize(c?: any): StructuredContent | null {
  if (!c) return null;
  return {
    label: c.label || "", heading: c.heading || "", text: c.text || "",
    textHtml: c.textHtml || "", image: c.image || "", imageAlt: c.imageAlt || "",
    ctas: Array.isArray(c.ctas) ? c.ctas : [], items: Array.isArray(c.items) ? c.items : [],
    logos: Array.isArray(c.logos) ? c.logos : [],
    bgColor: (c.bgColor === "blue" || c.bgColor === "sable") ? c.bgColor : (c.bgColor === "beige" ? "sable" : "none"),
  };
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
  el.querySelectorAll("[data-inline-rich-text-block='true']").forEach(n => n.remove());
  const blocks = Array.from(temp.childNodes).flatMap(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (!t) return [];
      const p = document.createElement("p"); p.textContent = t; return [p];
    }
    return node.nodeType === Node.ELEMENT_NODE ? [node as HTMLElement] : [];
  });
  const headings = Array.from(el.querySelectorAll("h2,h3,h4,h5,h6")) as HTMLElement[];
  const paragraphs = (Array.from(el.querySelectorAll("p")) as HTMLElement[]).filter(p => (p.textContent?.trim()?.length || 0) > 1);
  const lists = Array.from(el.querySelectorAll("ul,ol")) as HTMLElement[];
  const quotes = Array.from(el.querySelectorAll("blockquote")) as HTMLElement[];
  const hrs = Array.from(el.querySelectorAll("hr")) as HTMLElement[];
  let hi = 0, pi = 0, li = 0, qi = 0, hri = 0;
  const matched: { source: HTMLElement; target: HTMLElement | null }[] = [];
  const defaultContainer = headings[0]?.parentElement || paragraphs[0]?.parentElement || el;

  blocks.forEach(block => {
    const tag = block.tagName.toLowerCase();
    if (/^h[2-6]$/.test(tag)) {
      if (headings[hi]) { headings[hi].innerHTML = block.innerHTML; applyInlineLinkStyles(headings[hi]); matched.push({ source: block, target: headings[hi++] }); }
      else matched.push({ source: block, target: null });
    } else if (tag === "p") {
      if (paragraphs[pi]) { paragraphs[pi].innerHTML = block.innerHTML; applyInlineLinkStyles(paragraphs[pi]); matched.push({ source: block, target: paragraphs[pi++] }); }
      else matched.push({ source: block, target: null });
    } else if (tag === "ul" || tag === "ol") {
      if (lists[li]) { lists[li].innerHTML = block.innerHTML; applyInlineLinkStyles(lists[li]); matched.push({ source: block, target: lists[li++] }); }
      else matched.push({ source: block, target: null });
    } else if (tag === "blockquote") {
      if (quotes[qi]) { quotes[qi].innerHTML = block.innerHTML; matched.push({ source: block, target: quotes[qi++] }); }
      else matched.push({ source: block, target: null });
    } else if (tag === "hr") {
      matched.push({ source: block, target: hrs[hri] || null }); if (hrs[hri]) hri++;
    } else if (tag === "div" && block.classList.contains("cta-block")) {
      matched.push({ source: block, target: null });
    }
  });

  let prev: HTMLElement | null = null;
  matched.forEach((entry, idx) => {
    if (entry.target) { prev = entry.target; return; }
    const tag = entry.source.tagName.toLowerCase();
    let injected: HTMLElement;
    if (tag === "div" && entry.source.classList.contains("cta-block")) {
      const style = entry.source.getAttribute("data-cta-style") === "secondary" ? "secondary" : "primary";
      const href = entry.source.getAttribute("data-href") || entry.source.querySelector("a")?.getAttribute("href") || "/";
      const label = entry.source.getAttribute("data-label") || entry.source.textContent?.trim() || "CTA";
      injected = document.createElement("div");
      injected.setAttribute("data-inline-rich-text-block", "true");
      injected.setAttribute("data-inline-cta", "true");
      injected.className = "my-6";
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("data-inline-cta-link", "true");
      link.className = style === "secondary"
        ? "inline-flex items-center justify-center rounded-full gradient-miami btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        : "inline-flex items-center justify-center rounded-full gradient-primary btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90";
      link.textContent = label;
      injected.appendChild(link);
    } else {
      injected = entry.source.cloneNode(true) as HTMLElement;
      injected.setAttribute("data-inline-rich-text-block", "true");
      applyInlineLinkStyles(injected);
    }
    const next = matched.slice(idx + 1).find(c => c.target)?.target ?? null;
    if (next?.parentElement) next.parentElement.insertBefore(injected, next);
    else if (prev) prev.insertAdjacentElement("afterend", injected);
    else defaultContainer.appendChild(injected);
    prev = injected;
  });
}

function patchCtaLinks(el: Element, enabledCtas: CtaItem[]) {
  el.querySelectorAll("[data-generated-cta-group='true']").forEach(n => n.remove());
  const ctaLinks: HTMLAnchorElement[] = [];
  el.querySelectorAll("a").forEach(a => {
    if (a.closest("[data-inline-cta='true']") || a.hasAttribute("data-inline-cta-link")) return;
    const parent = a.closest("button,.btn,[class*='Button']");
    const cls = (a.className || "") + " " + (parent?.className || "");
    if (parent || cls.includes("gradient-primary") || cls.includes("gradient-miami") || cls.includes("btn-glow") || cls.includes("shadow-glow") || cls.includes("shadow-lg"))
      ctaLinks.push(a);
  });
  enabledCtas.forEach((cta, i) => {
    if (ctaLinks[i]) {
      const a = ctaLinks[i];
      const tn = Array.from(a.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (tn) tn.textContent = cta.text; else { const s = a.querySelector("span"); if (s) s.textContent = cta.text; else a.textContent = cta.text; }
      a.setAttribute("href", cta.url);
      a.style.removeProperty("background");
      a.classList.add("inline-flex", "items-center", "justify-center", "rounded-full", "px-6", "py-3", "font-semibold", "text-primary-foreground");
      if (cta.style === "secondary") { a.classList.remove("gradient-primary"); a.classList.add("gradient-miami", "btn-glow", "shadow-glow"); }
      else { a.classList.remove("gradient-miami"); a.classList.add("gradient-primary", "btn-glow", "shadow-glow"); }
    }
  });
  const missing = enabledCtas.slice(ctaLinks.length).filter(c => c.text.trim() && c.url.trim());
  if (missing.length > 0) {
    const group = document.createElement("div");
    group.setAttribute("data-generated-cta-group", "true");
    group.className = "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap";
    missing.forEach(cta => {
      const link = document.createElement("a");
      link.href = cta.url;
      link.setAttribute("data-inline-cta-link", "true");
      link.className = cta.style === "secondary"
        ? "inline-flex items-center justify-center rounded-full gradient-miami btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
        : "inline-flex items-center justify-center rounded-full gradient-primary btn-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90";
      link.textContent = cta.text.trim();
      group.appendChild(link);
    });
    const anchor = Array.from(el.querySelectorAll("[data-inline-rich-text-block='true'],h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote,hr")).pop() as HTMLElement | undefined;
    if (anchor) anchor.insertAdjacentElement("afterend", group);
    else (el.firstElementChild as HTMLElement | null)?.appendChild(group) ?? el.appendChild(group);
  }
}

function applySubItemsToDOM(el: HTMLElement, items: SubItem[]) {
  const containers = el.querySelectorAll("[class*='grid'],[class*='flex']");
  for (const container of containers) {
    const children = Array.from(container.children);
    const withHeadings = children.filter(c => c.querySelector("h2,h3,h4") || c.querySelector("[class*='font-bold'],[class*='font-semibold']"));
    if (withHeadings.length >= 2 && withHeadings.length === children.length) {
      withHeadings.forEach((child, i) => {
        if (!items[i]) return;
        const item = items[i];
        if (item.url && child.tagName === "A") (child as HTMLAnchorElement).href = item.url;
        const heading = child.querySelector("h2,h3,h4");
        const bold = !heading ? child.querySelector("[class*='font-bold'],[class*='font-semibold']") : null;
        if (heading && item.heading) heading.textContent = item.heading;
        else if (bold && item.heading) bold.textContent = item.heading;
        if (item.text) {
          const ps = Array.from(child.querySelectorAll("p")).filter(p => (p.textContent?.trim()?.length || 0) > 3) as HTMLParagraphElement[];
          if (item.text.trim().startsWith("<")) {
            const tmp = document.createElement("div"); tmp.innerHTML = item.text;
            const rich = Array.from(tmp.childNodes).flatMap(n => n.nodeType === Node.ELEMENT_NODE ? [n as HTMLElement] : n.nodeType === Node.TEXT_NODE && n.textContent?.trim() ? [Object.assign(document.createElement("p"), { textContent: n.textContent?.trim() })] : []);
            let pi2 = 0;
            rich.forEach(b => { const t = b.tagName.toLowerCase(); if ((t === "p" || t === "blockquote") && ps[pi2]) { ps[pi2].innerHTML = b.innerHTML; applyInlineLinkStyles(ps[pi2]); pi2++; } });
          } else {
            const lines = item.text.split("\n\n").filter(t => t.trim());
            let pi2 = 0;
            lines.forEach(txt => { if (txt.match(/^\[H[2-6]\]/i)) return; if (ps[pi2]) { ps[pi2].textContent = txt.trim(); pi2++; } });
          }
        }
        if (item.image) { const img = child.querySelector("img"); if (img) { img.setAttribute("src", item.image); if (item.imageAlt) img.setAttribute("alt", item.imageAlt); } }
        patchCtaLinks(child as HTMLElement, item.ctas.filter(c => c.enabled && c.text && c.url));
      });
      return;
    }
  }
}

function applyLogosToDOM(el: HTMLElement, logos: LogoItem[]) {
  const containers = el.querySelectorAll("[class*='animate-scroll'],[class*='overflow-hidden'] > [class*='flex']");
  for (const container of containers) {
    container.innerHTML = "";
    [...logos, ...logos].forEach(logo => {
      const div = document.createElement("div");
      div.className = "flex flex-col items-center gap-3 shrink-0";
      div.innerHTML = `<div class="rounded-2xl bg-secondary p-5 shadow-card"><img src="${logo.src}" alt="${logo.name}" class="h-16 w-16 md:h-20 md:w-20 object-contain" loading="lazy" decoding="async" width="80" height="80" /></div><span class="text-sm font-medium text-muted-foreground">${logo.name}</span>`;
      container.appendChild(div);
    });
    return;
  }
}

function applyOverrideToDOM(el: HTMLElement, s: StructuredContent) {
  // Apply background color — always apply, including "none" to reset
  const bgTarget = el.firstElementChild as HTMLElement || el;
  bgTarget.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
  el.classList.remove("bg-section-blue", "bg-section-rose", "bg-section-alt");
  const nc = BG_CLASS_MAP[s.bgColor || "none"]; if (nc) bgTarget.classList.add(nc);
  if (s.heading) { const h1 = el.querySelector("h1"); if (h1) h1.textContent = s.heading; }
  if (s.image) { const imgs = el.querySelectorAll("img"); for (const img of imgs) { const w = img.getAttribute("width"); if (w && parseInt(w) < 64) continue; img.setAttribute("src", s.image); if (s.imageAlt) img.setAttribute("alt", s.imageAlt); break; } }
  if (s.textHtml && s.items.length === 0) applyRichTextHtmlToDOM(el, s.textHtml);
  else if (s.text && s.items.length === 0) {
    const lines = s.text.split("\n\n").filter(t => t.trim());
    const tagged = lines.map(l => { const m = l.match(/^\[(H[2-6])\]\s*(.*)/i); return m ? { tag: m[1].toLowerCase(), text: m[2] } : { tag: null as string | null, text: l }; });
    const hs = el.querySelectorAll("h2,h3,h4,h5,h6"), ps = el.querySelectorAll("p");
    let hi2 = 0, pi2 = 0;
    tagged.forEach(({ tag, text }) => {
      if (tag) { if (hs[hi2]) { hs[hi2].textContent = text.trim(); hi2++; } }
      else { while (pi2 < ps.length) { if ((ps[pi2].textContent?.trim()?.length || 0) > 3) { ps[pi2].textContent = text.trim(); pi2++; break; } pi2++; } }
    });
  }
  if (s.items.length > 0) applySubItemsToDOM(el, s.items);
  if (s.logos?.length > 0) applyLogosToDOM(el, s.logos);
  patchCtaLinks(el, s.ctas.filter(c => c.enabled && c.text && c.url));
}

const CmsPatcher = ({ blockId, pagePath, children }: Props) => {
  const { getOverride } = useCmsOverrides();
  const compositeKey = `${pagePath}::${blockId}`;
  const override = getOverride(compositeKey);
  const ref = useRef<HTMLDivElement>(null);
  const overrideRef = useRef(override);
  overrideRef.current = override;

  useLayoutEffect(() => {
    const s = normalize(overrideRef.current?.content?.structured);
    if (!s || !ref.current) return;
    applyOverrideToDOM(ref.current, s);
  });

  return <div ref={ref}>{children}</div>;
};

export default CmsPatcher;
