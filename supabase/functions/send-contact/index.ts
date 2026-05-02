import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const TO_EMAIL = "contact@declicdigital.net";
const TO_NAME = "Déclic Digital";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { full_name, company, email, phone, current_url, msg } = await req.json();

    if (!full_name || !email || !msg) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: full_name, email: "noreply@declicdigital.net" },
        to: [{ email: TO_EMAIL, name: TO_NAME }],
        replyTo: { email: email, name: full_name },
        subject: `Nouveau contact : ${full_name}${company ? ` — ${company}` : ""}`,
        htmlContent: `
          <h2>Nouveau message depuis le formulaire de contact</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold;width:140px">Nom</td><td style="padding:8px">${full_name}</td></tr>
            ${company ? `<tr><td style="padding:8px;font-weight:bold">Entreprise</td><td style="padding:8px">${company}</td></tr>` : ""}
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px;font-weight:bold">Téléphone</td><td style="padding:8px"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
            ${current_url ? `<tr><td style="padding:8px;font-weight:bold">Site actuel</td><td style="padding:8px"><a href="${current_url}">${current_url}</a></td></tr>` : ""}
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${msg}</td></tr>
          </table>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Brevo error:", err);
      throw new Error("Erreur Brevo");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
