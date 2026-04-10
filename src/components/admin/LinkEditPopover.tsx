import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkEditPopoverProps {
  href: string;
  rect: { top: number; left: number; width: number; bottom: number };
  onChange: (href: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const LinkEditPopover = ({ href, rect, onChange, onSave, onClose }: LinkEditPopoverProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return createPortal(
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top: Math.min(rect.bottom + 8, window.innerHeight - 180),
        left: Math.max(16, Math.min(rect.left, window.innerWidth - 336)),
        zIndex: 9999,
      }}
      className="w-80 rounded-lg border bg-popover p-4 shadow-lg"
    >
      <h4 className="mb-3 text-sm font-semibold">Modifier le lien</h4>
      <div className="space-y-3">
        <div>
          <Label className="text-xs">URL</Label>
          <Input
            autoFocus
            value={href}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSave();
              }
            }}
            placeholder="/tarifs ou https://..."
            className="mt-1 h-8 text-sm"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Astuce : utilisez <span className="font-medium">/tarifs</span>, <span className="font-medium">/contact</span> ou une URL complète.
        </p>
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={onSave} className="h-7 text-xs">Appliquer</Button>
          <Button size="sm" variant="outline" onClick={onClose} className="h-7 text-xs">Annuler</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LinkEditPopover;