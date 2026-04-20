import PageLayout from "@/components/PageLayout";
import SectionWrapper from "@/components/SectionWrapper";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PolitiqueConfidentialite = () => (
  <PageLayout>
    <Helmet>
      <title>Politique de confidentialité et RGPD | Déclic Digital</title>
      <meta name="description" content="Comment Déclic Digital collecte, utilise et protège vos données personnelles. Politique conforme au RGPD. Vos droits d'accès, rectification et suppression." />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href="https://declicdigital.net/politique-de-confidentialite" />
    </Helmet>
    <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]} />
    <section className="gradient-hero py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-4xl font-extrabold md:text-5xl">Politique de confidentialité</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Dernière mise à jour : 20 mars 2026</p>
      </div>
    </section>

    <SectionWrapper>
      <div className="mx-auto max-w-3xl space-y-10 text-muted-foreground">

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">1. Responsable du traitement</h2>
          <p>Le responsable du traitement des données personnelles collectées sur ce site est :</p>
          <ul className="mt-3 space-y-1">
            <li><strong className="text-foreground">Déclic Digital</strong></li>
            <li>SIRET : 102 436 664 00019</li>
            <li>Email : <a href="mailto:contact@declicdigital.net" className="text-primary hover:underline">contact@declicdigital.net</a></li>
            <li>Téléphone : 06.02.22.89.39</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">2. Données collectées</h2>
          <p className="mb-3">Nous collectons les données personnelles suivantes :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone, nom de l'entreprise.</li>
            <li><strong className="text-foreground">Données de connexion :</strong> adresse IP, données de navigation (cookies), type de navigateur, pages consultées.</li>
            <li><strong className="text-foreground">Données de projet :</strong> informations fournies via les formulaires de contact (description du projet, budget, préférences).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">3. Finalités du traitement</h2>
          <p className="mb-3">Vos données personnelles sont traitées pour les finalités suivantes :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Répondre à vos demandes de contact et de devis</li>
            <li>Créer et gérer votre espace client</li>
            <li>Assurer le suivi de votre projet web</li>
            <li>Établir et envoyer des factures et devis</li>
            <li>Améliorer nos services et l'expérience utilisateur du site</li>
            <li>Mesurer l'audience du site via Google Analytics / Google Tag Manager</li>
            <li>Respecter nos obligations légales et réglementaires</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">4. Base juridique du traitement</h2>
          <p className="mb-3">Le traitement de vos données repose sur :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Votre consentement</strong> : pour l'utilisation de cookies non essentiels et l'envoi de communications.</li>
            <li><strong className="text-foreground">L'exécution d'un contrat</strong> : pour la gestion de votre projet et la fourniture de nos services.</li>
            <li><strong className="text-foreground">L'intérêt légitime</strong> : pour l'amélioration de nos services et la mesure d'audience.</li>
            <li><strong className="text-foreground">Une obligation légale</strong> : pour la conservation des factures et documents comptables.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">5. Destinataires des données</h2>
          <p className="mb-3">Vos données personnelles sont exclusivement destinées à Déclic Digital. Elles ne sont jamais vendues à des tiers.</p>
          <p className="mb-3">Elles peuvent être partagées avec les sous-traitants suivants, dans le cadre strict de la fourniture de nos services :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Hébergement :</strong> Vercel Inc. (hébergement du site)</li>
            <li><strong className="text-foreground">Analytics :</strong> Google (mesure d'audience via Google Tag Manager)</li>
            <li><strong className="text-foreground">Email :</strong> Service d'envoi d'emails transactionnels</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">6. Durée de conservation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Données de contact :</strong> 3 ans après le dernier contact</li>
            <li><strong className="text-foreground">Données de projet :</strong> durée du contrat + 5 ans (obligations comptables)</li>
            <li><strong className="text-foreground">Données de compte :</strong> jusqu'à suppression du compte par l'utilisateur ou 3 ans d'inactivité</li>
            <li><strong className="text-foreground">Cookies :</strong> 13 mois maximum</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">7. Vos droits</h2>
          <p className="mb-3">Conformément au RGPD (Règlement Général sur la Protection des Données) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
            <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
            <li><strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong className="text-foreground">Droit à la limitation :</strong> restreindre le traitement de vos données</li>
            <li><strong className="text-foreground">Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
            <li><strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong className="text-foreground">Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
          </ul>
          <p className="mt-4">
            Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@declicdigital.net" className="text-primary font-semibold">contact@declicdigital.net</a>
          </p>
          <p className="mt-2">
            Vous pouvez également introduire une réclamation auprès de la <strong className="text-foreground">CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">8. Cookies</h2>
          <p className="mb-3">Ce site utilise des cookies pour :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Cookies essentiels :</strong> nécessaires au fonctionnement du site (session, authentification)</li>
            <li><strong className="text-foreground">Cookies analytiques :</strong> mesure d'audience via Google Analytics / GTM (anonymisation IP activée)</li>
          </ul>
          <p className="mt-3">
            Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti de leur dépôt. La désactivation de certains cookies peut affecter la navigation sur le site.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">9. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte, altération ou divulgation. Les mots de passe sont chiffrés, les communications sont sécurisées par HTTPS, et l'accès aux données est restreint aux seules personnes autorisées.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">10. Transfert de données hors UE</h2>
          <p>
            Certains de nos sous-traitants (hébergement, analytics) peuvent être situés en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont en place (clauses contractuelles types, décision d'adéquation) conformément aux articles 46 et 49 du RGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">11. Modification de la politique</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour. Nous vous encourageons à consulter régulièrement cette page.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-foreground">12. Contact</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité ou à vos données personnelles, contactez-nous :
          </p>
          <ul className="mt-3 space-y-1">
            <li>Email : <a href="mailto:contact@declicdigital.net" className="text-primary font-semibold">contact@declicdigital.net</a></li>
            <li>Téléphone : 06.02.22.89.39</li>
          </ul>
        </section>
      </div>
    </SectionWrapper>
  </PageLayout>
);

export default PolitiqueConfidentialite;
