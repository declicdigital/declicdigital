import { Gift } from "lucide-react";

const PromoBanner = () => (
  <div className="gradient-miami py-3">
    <div className="container flex flex-wrap items-center justify-center gap-2 text-center">
      <Gift size={18} className="text-primary-foreground shrink-0" />
      <p className="text-sm md:text-base font-semibold text-primary-foreground">
        🎉 Pour notre lancement, on crée votre site pour <span className="underline">100€ seulement</span> ! Offre valable du 10 mars au 10 avril 2026.
      </p>
      <a
        href="mailto:contact@declicdigital.net"
        className="ml-2 inline-block rounded-full bg-card px-4 py-1 text-sm font-semibold text-foreground hover:bg-card/90 transition-colors"
      >
        Nous contacter
      </a>
    </div>
  </div>
);

export default PromoBanner;
