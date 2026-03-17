import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const MentionsLegales = () => (
  <PageLayout>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]} />
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Mentions légales</h1>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-10 text-muted-foreground">
        {/* Éditeur */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Éditeur du site</h2>
          <ul className="space-y-1">
            <li><strong className="text-foreground">Nom :</strong> Déclic Digital</li>
            <li><strong className="text-foreground">SIRET :</strong> 102 436 664 00019</li>
            <li><strong className="text-foreground">Responsable de la publication :</strong> Geoffrey</li>
            <li><strong className="text-foreground">Email :</strong> contact@declicdigital.net</li>
            <li><strong className="text-foreground">Téléphone :</strong> 06.02.22.89.39</li>
            <li><strong className="text-foreground">Adresse :</strong> France</li>
          </ul>
        </section>

        {/* Hébergement */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Hébergement</h2>
          <p>
            Ce site est hébergé par Lovable (Lovable Technologies Inc.). Pour toute question relative à l'hébergement, veuillez nous contacter à l'adresse email ci-dessus.
          </p>
        </section>

        {/* Propriété intellectuelle */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, icônes, vidéos, mise en page) est protégé par le droit d'auteur et le droit de la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site est interdite sans l'autorisation écrite préalable de Déclic Digital.
          </p>
        </section>

        {/* Données personnelles */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Protection des données personnelles</h2>
          <p className="mb-3">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
          </p>
          <p className="mb-3">
            Les informations recueillies via les formulaires de contact sont destinées exclusivement à Déclic Digital pour le traitement de votre demande. Elles ne sont en aucun cas transmises à des tiers.
          </p>
          <p>
            Pour exercer vos droits ou pour toute question relative à vos données personnelles, vous pouvez nous contacter à : <strong className="text-foreground">contact@declicdigital.net</strong>.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Cookies</h2>
          <p>
            Ce site peut utiliser des cookies à des fins de mesure d'audience et d'amélioration de l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies. Vous pouvez configurer votre navigateur pour refuser les cookies.
          </p>
        </section>

        {/* Responsabilité */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Limitation de responsabilité</h2>
          <p>
            Déclic Digital s'efforce de fournir des informations exactes et à jour sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées. Déclic Digital ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation de ce site.
          </p>
        </section>

        {/* Liens externes */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Liens hypertextes</h2>
          <p>
            Ce site peut contenir des liens vers des sites externes. Déclic Digital n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels dommages pouvant résulter de leur consultation.
          </p>
        </section>

        {/* Droit applicable */}
        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default MentionsLegales;
