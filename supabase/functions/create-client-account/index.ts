import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BREVO_API_KEY = "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";
const NOTIFY_EMAIL = "g.delabarre@declicdigital.net";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Stocker le brief dans Supabase
    const submissionId = body.submission_id || crypto.randomUUID();
    const { error: dbError } = await supabase.from("brief_submissions").insert({
      full_name: body.full_name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      sector: body.sector,
      size: body.size,
      current_url: body.current_url,
      source: body.source,
      project_types: body.pt || [],
      description: body.desc,
      inspiration: body.inspo,
      keywords: body.kw,
      goal: body.goal,
      acquisition_sources: body.csrc || [],
      budget: body.budget,
      recurrence: body.recur,
      urgency: body.urgency,
      brand: body.brand,
      content_available: body.cont || [],
      pages_count: body.pages,
      features: body.feat || [],
      features_other: body.feat_autre_detail,
      vibe: body.vibe,
      team_enabled: body.team_enabled || false,
      team_data: body.team || [],
      deadline: body.dl,
      key_date: body.kdate,
      autonomy: body.auto,
      web_level: body.wlevel,
      past_experience: body.past,
      past_issue: body.pastissue,
      message: body.msg || body.desc,
      contact_pref: body.cp,
      time_slot: body.slot,
      file_types: body.ftype || [],
      file_link: body.file_link,
      file_notes: body.file_notes,
      file_paths: body.file_paths || [],
      submission_id: submissionId,
      status: "new",
    });

    if (dbError) console.error("DB Error:", dbError);

    // 2. Construire l'email HTML
    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f8f8f8; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3d1a6e, #00b4d8); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎯 Nouveau brief client</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">declicdigital.net</p>
  </div>
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">👤 Profil client</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Nom</td><td style="padding: 6px 0; font-weight: bold;">${body.full_name || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Entreprise</td><td style="padding: 6px 0; font-weight: bold;">${body.company || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;"><a href="mailto:${body.email}" style="color: #3d1a6e;">${body.email || "-"}</a></td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Téléphone</td><td style="padding: 6px 0;">${body.phone || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Secteur</td><td style="padding: 6px 0;">${body.sector || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Taille</td><td style="padding: 6px 0;">${body.size || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Site actuel</td><td style="padding: 6px 0;">${body.current_url || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Source</td><td style="padding: 6px 0;">${body.source || "-"}</td></tr>
    </table>

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">📋 Projet</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Type de site</td><td style="padding: 6px 0;">${(body.pt || []).join(", ") || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Description</td><td style="padding: 6px 0;">${body.desc || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Inspiration</td><td style="padding: 6px 0;">${body.inspo || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Mots-clés SEO</td><td style="padding: 6px 0;">${body.kw || "-"}</td></tr>
    </table>

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">🎯 Objectifs & Budget</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Objectif</td><td style="padding: 6px 0;">${body.goal || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Acquisition</td><td style="padding: 6px 0;">${(body.csrc || []).join(", ") || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Budget</td><td style="padding: 6px 0; font-weight: bold; color: #3d1a6e;">${body.budget || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Récurrence</td><td style="padding: 6px 0;">${body.recur || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Urgence</td><td style="padding: 6px 0;">${body.urgency ? "⭐".repeat(parseInt(body.urgency)) + " (${body.urgency}/5)" : "-"}</td></tr>
    </table>

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">🎨 Contenu & Design</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Charte graphique</td><td style="padding: 6px 0;">${body.brand || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Contenu dispo</td><td style="padding: 6px 0;">${(body.cont || []).join(", ") || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Nb pages</td><td style="padding: 6px 0;">${body.pages || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Fonctionnalités</td><td style="padding: 6px 0;">${(body.feat || []).join(", ") || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Ambiance</td><td style="padding: 6px 0;">${body.vibe || "-"}</td></tr>
    </table>

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">⏱ Délais & Contexte</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Délai souhaité</td><td style="padding: 6px 0;">${body.dl || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Date clé</td><td style="padding: 6px 0;">${body.kdate || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Autonomie</td><td style="padding: 6px 0;">${body.auto || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Niveau web</td><td style="padding: 6px 0;">${body.wlevel ? body.wlevel + "/5" : "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Expérience agence</td><td style="padding: 6px 0;">${body.past || "-"}</td></tr>
      ${body.pastissue ? `<tr><td style="padding: 6px 0; color: #666;">Ce qui s'est passé</td><td style="padding: 6px 0;">${body.pastissue}</td></tr>` : ""}
    </table>

    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">💬 Message</h2>
    <div style="background: #f8f8f8; padding: 16px; border-radius: 8px; border-left: 4px solid #3d1a6e;">
      <p style="margin: 0; color: #333;">${body.msg || body.desc || "Aucun message"}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
      <tr><td style="padding: 6px 0; color: #666; width: 40%;">Contact préféré</td><td style="padding: 6px 0;">${body.cp || "-"}</td></tr>
      <tr><td style="padding: 6px 0; color: #666;">Créneau</td><td style="padding: 6px 0;">${body.slot || "-"}</td></tr>
    </table>

    ${body.file_link ? `
    <h2 style="color: #3d1a6e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 24px;">📎 Fichiers</h2>
    <p><a href="${body.file_link}" style="color: #3d1a6e; font-weight: bold;">Voir les fichiers partagés →</a></p>
    ${body.file_notes ? `<p style="color: #666;">${body.file_notes}</p>` : ""}
    ` : ""}

    <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #3d1a6e15, #00b4d815); border-radius: 12px; text-align: center;">
      <a href="https://declicdigital.net/admin" style="display: inline-block; background: linear-gradient(135deg, #3d1a6e, #00b4d8); color: white; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: bold;">
        Voir dans le dashboard →
      </a>
    </div>
  </div>
</div>`;

    // 3. Envoyer l'email via Brevo
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Déclic Digital Brief", email: "contact@declicdigital.net" },
        to: [{ email: NOTIFY_EMAIL, name: "Geoffrey" }],
        subject: `🎯 Nouveau brief — ${body.full_name} (${body.company}) | ${body.budget || "budget ?"}`,
        htmlContent: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const emailErr = await emailRes.text();
      console.error("Brevo error:", emailErr);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
