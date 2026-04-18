import { Node, mergeAttributes } from "@tiptap/react";

export interface CtaNodeAttributes {
  href: string;
  label: string;
  ctaStyle: "primary" | "secondary";
}

const CtaNode = Node.create({
  name: "ctaBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      href: { default: "/audit-seo-gratuit" },
      label: { default: "Demander un audit SEO gratuit" },
      ctaStyle: { default: "primary" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.cta-block',
        getAttrs(dom) {
          const el = dom as HTMLElement;
          const anchor = el.querySelector("a");
          // Prioritise data-* attributes (set by renderHTML), then fallback to anchor or span content.
          const dataHref = el.getAttribute("data-href");
          const dataLabel = el.getAttribute("data-label");
          const span = el.querySelector("span");
          const innerLabel = span?.textContent?.trim() || anchor?.textContent?.trim() || el.textContent?.trim() || "";
          return {
            ctaStyle: el.getAttribute("data-cta-style") || "primary",
            href: dataHref || anchor?.getAttribute("href") || "/",
            label: dataLabel || innerLabel || "CTA",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { href, label, ctaStyle, ...rest } = HTMLAttributes;
    return [
      "div",
      mergeAttributes(rest, {
        class: "cta-block",
        "data-cta-style": ctaStyle,
        "data-href": href,
        "data-label": label,
      }),
      ["span", { class: `cta-editor-preview cta-editor-${ctaStyle}` }, label],
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("div");
      dom.classList.add("cta-block-wrapper");
      dom.contentEditable = "false";

      const btn = document.createElement("span");
      const style = node.attrs.ctaStyle || "primary";
      btn.className = `cta-editor-preview cta-editor-${style}`;
      btn.textContent = node.attrs.label || "CTA";
      dom.appendChild(btn);

      dom.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Dispatch custom event to open edit popup
        const pos = typeof getPos === "function" ? getPos() : null;
        if (pos === null) return;
        
        const rect = dom.getBoundingClientRect();
        const event = new CustomEvent("edit-cta", {
          detail: {
            pos,
            href: node.attrs.href,
            label: node.attrs.label,
            ctaStyle: node.attrs.ctaStyle,
            rect: { top: rect.top, left: rect.left, width: rect.width, bottom: rect.bottom },
          },
        });
        document.dispatchEvent(event);
      });

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== "ctaBlock") return false;
          const s = updatedNode.attrs.ctaStyle || "primary";
          btn.className = `cta-editor-preview cta-editor-${s}`;
          btn.textContent = updatedNode.attrs.label || "CTA";
          return true;
        },
      };
    };
  },
});

export default CtaNode;
