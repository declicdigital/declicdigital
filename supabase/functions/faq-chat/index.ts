import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es l'assistant IA de Déclic Digital, une agence web spécialisée dans la création de sites internet et le référencement SEO pour les TPE et artisans à Paris et dans les Hauts-de-Seine (92).

Ton rôle est de répondre aux questions des visiteurs de façon claire, concise et professionnelle. Tu dois :
- Répondre en français uniquement
- Être utile et orienter vers les services de Déclic Digital quand c'est pertinent
- Mentionner les pages du site quand c'est utile : /creation-site-web, /referencement-seo, /tarifs, /audit-seo-gratuit, /contact, /realisations, /nos-villes, /qui-sommes-nous, /faq
- Ne jamais inventer de prix précis, renvoyer vers /tarifs pour les détails
- Rester honnête : si tu ne sais pas, dis-le et invite à contacter l'équipe via /contact
- Les tarifs commencent à 50€/mois + un premier mois de mise en service
- Geoffrey est le fondateur, Expert Produit Google
- Déclic Digital peut accompagner des entreprises partout en France en visioconférence, avec une expertise renforcée sur Paris et le 92 (Boulogne-Billancourt, Issy-les-Moulineaux, Neuilly, Levallois, etc.)
- Technologies utilisées : WordPress, Shopify, Lovable, solutions sur mesure
- Délais : site vitrine 1-2 semaines, site avancé 2-4 semaines
- L'agence propose un audit SEO gratuit
- Ne jamais utiliser de tirets longs (—)
- Réponses courtes (3-5 phrases max) sauf si la question demande plus de détail`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de demandes, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("faq-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
