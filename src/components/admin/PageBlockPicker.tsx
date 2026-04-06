import { LayoutTemplate, Type, Image, Columns, Layers, PanelLeft, PanelRight, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export interface PageBlock {
  id: string;
  type: string;
  label: string;
  content: Record<string, string>;
}

export const BLOCK_TEMPLATES: { type: string; label: string; icon: React.ReactNode; description: string; defaultContent: Record<string, string> }[] = [
  {
    type: "text",
    label: "Paragraphe",
    icon: <Type size={20} />,
    description: "Bloc de texte libre avec formatage",
    defaultContent: { html: "<p>Votre texte ici…</p>" },
  },
  {
    type: "image-left-text-right",
    label: "Image à gauche + Texte",
    icon: <PanelLeft size={20} />,
    description: "Image à gauche, texte à droite",
    defaultContent: { imageUrl: "", imageAlt: "Image", html: "<h2>Titre</h2><p>Description…</p>" },
  },
  {
    type: "text-left-image-right",
    label: "Texte + Image à droite",
    icon: <PanelRight size={20} />,
    description: "Texte à gauche, image à droite",
    defaultContent: { html: "<h2>Titre</h2><p>Description…</p>", imageUrl: "", imageAlt: "Image" },
  },
  {
    type: "hero-image",
    label: "Texte sur image (Hero)",
    icon: <Layers size={20} />,
    description: "Texte superposé sur une image de fond",
    defaultContent: { imageUrl: "", html: "<h2>Titre impactant</h2><p>Sous-titre accrocheur</p>" },
  },
  {
    type: "two-columns",
    label: "Deux colonnes",
    icon: <Columns size={20} />,
    description: "Deux colonnes de texte côte à côte",
    defaultContent: { htmlLeft: "<h3>Colonne 1</h3><p>Contenu…</p>", htmlRight: "<h3>Colonne 2</h3><p>Contenu…</p>" },
  },
  {
    type: "image-full",
    label: "Image pleine largeur",
    icon: <Image size={20} />,
    description: "Image sur toute la largeur",
    defaultContent: { imageUrl: "", imageAlt: "Image" },
  },
  {
    type: "cta-banner",
    label: "Bannière CTA",
    icon: <Sparkles size={20} />,
    description: "Bannière d'appel à l'action avec titre et bouton",
    defaultContent: { html: "<h2>Prêt à démarrer ?</h2><p>Contactez-nous pour un devis gratuit.</p>", ctaLabel: "Nous contacter", ctaHref: "/contact", ctaStyle: "primary" },
  },
  {
    type: "features-grid",
    label: "Grille de fonctionnalités",
    icon: <LayoutTemplate size={20} />,
    description: "Grille de 3 cartes avec icône, titre et description",
    defaultContent: {
      card1Title: "Fonctionnalité 1", card1Text: "Description…",
      card2Title: "Fonctionnalité 2", card2Text: "Description…",
      card3Title: "Fonctionnalité 3", card3Text: "Description…",
    },
  },
];

interface PageBlockPickerProps {
  onAdd: (block: PageBlock) => void;
}

const PageBlockPicker = ({ onAdd }: PageBlockPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (template: typeof BLOCK_TEMPLATES[number]) => {
    onAdd({
      id: crypto.randomUUID(),
      type: template.type,
      label: template.label,
      content: { ...template.defaultContent },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground hover:border-primary/50">
          <Plus size={18} /> Ajouter un bloc
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un bloc</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {BLOCK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.type}
              onClick={() => handleSelect(tpl)}
              className="flex items-start gap-3 rounded-lg border p-4 text-left hover:border-primary/50 hover:bg-muted/50 transition"
            >
              <div className="mt-0.5 text-primary">{tpl.icon}</div>
              <div>
                <div className="text-sm font-medium">{tpl.label}</div>
                <div className="text-xs text-muted-foreground">{tpl.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PageBlockPicker;
