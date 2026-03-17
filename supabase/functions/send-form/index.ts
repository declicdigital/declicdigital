import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateFormPdfText(data: any): string {
  const lines: string[] = [];
  lines.push("RECAPITULATIF DU BRIEF CLIENT");
  lines.push("=".repeat(40));
  lines.push("");

  const sections: [string, [string, string][]][] = [
    ["PROFIL", [
      ["Nom", data.full_name],
      ["Entreprise", data.company],
      ["Email", data.email],
      ["Telephone", data.phone],
      ["Secteur", data.sector],
      ["Taille", data.size],
      ["Site actuel", data.current_url],
      ["Source", data.source],
    ]],
    ["PROJET", [
      ["Type de projet", (data.pt || []).join(", ")],
      ["Description", data.desc],
      ["Inspiration", data.inspo],
      ["Mots-cles", data.kw],
      ["Objectif principal", data.goal],
      ["Sources de contenu", (data.csrc || []).join(", ")],
    ]],
    ["BUDGET & OBJECTIFS", [
      ["Budget", data.budget],
      ["Recurrence", data.recur],
      ["Urgence", data.urgency],
    ]],
    ["CONTENU & DESIGN", [
      ["Charte graphique", data.brand],
      ["Contenus fournis", (data.cont || []).join(", ")],
      ["Pages souhaitees", data.pages],
      ["Fonctionnalites", (data.feat || []).join(", ")],
      ["Ambiance", data.vibe],
    ]],
    ["DELAIS", [
      ["Deadline", data.dl],
      ["Date cle", data.kdate],
      ["Automatisation", data.auto],
    ]],
    ["EXPERIENCE", [
      ["Niveau web", data.wlevel],
      ["Experience passee", data.past],
      ["Problemes passes", data.pastissue],
    ]],
    ["MESSAGE", [
      ["Message", data.msg],
      ["Code postal", data.cp],
      ["Creneau", data.slot],
    ]],
  ];

  for (const [title, fields] of sections) {
    lines.push(`--- ${title} ---`);
    for (const [label, value] of fields) {
      if (value && value.trim()) {
        lines.push(`${label}: ${value}`);
      }
    }
    lines.push("");
  }

  if (data.team && data.team.length > 0) {
    lines.push("--- EQUIPE ---");
    for (const m of data.team) {
      lines.push(`  - ${m.name} (${m.role}): ${m.bio}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const submissionId = data.submission_id || crypto.randomUUID();
    const password = data.password;

    // Remove password from stored data
    const { password: _pw, password_confirm: _pc, submission_id: _sid, ...formData } = data;

    // 1. Save form submission
    await adminClient.from("form_submissions").insert({
      id: submissionId,
      data: formData,
      file_paths: data.file_paths || [],
    });

    console.log("Form submission saved:", {
      name: data.full_name,
      email: data.email,
      company: data.company,
    });

    // 2. Create client account with password
    if (data.email && password) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(
          (u: any) => u.email === data.email
        );

        if (!existing) {
          // Create user with password (auto-confirmed)
          const { data: userData, error: userError } =
            await adminClient.auth.admin.createUser({
              email: data.email,
              password: password,
              email_confirm: true,
              user_metadata: { full_name: data.full_name || "" },
            });

          if (userError) {
            console.error("Error creating user:", userError.message);
          } else if (userData.user) {
            console.log("User created:", userData.user.id);

            // Insert profile
            await adminClient.from("profiles").insert({
              id: userData.user.id,
              email: data.email,
              full_name: data.full_name || "",
            });

            // Add client role
            await adminClient.from("user_roles").insert({
              user_id: userData.user.id,
              role: "client",
            });

            // Create project
            const { data: projectData } = await adminClient.from("projects").insert({
              client_id: userData.user.id,
              name: `Projet ${data.company || data.full_name || "Client"}`,
              description: data.desc || data.msg || "",
            }).select("id").single();

            console.log("Client account fully created with project");

            // 3. Generate PDF-like text recap and store as document
            if (projectData) {
              const recapText = generateFormPdfText(formData);
              const recapBlob = new Blob([recapText], { type: "text/plain" });
              const recapPath = `${projectData.id}/brief-client-${new Date().toISOString().slice(0, 10)}.txt`;

              const { error: uploadErr } = await adminClient.storage
                .from("project-documents")
                .upload(recapPath, recapBlob, { contentType: "text/plain" });

              if (!uploadErr) {
                await adminClient.from("project_documents").insert({
                  project_id: projectData.id,
                  name: `Brief client - ${data.full_name || data.company}`,
                  file_path: recapPath,
                  uploaded_by: userData.user.id,
                });
                console.log("Form recap document created");
              } else {
                console.error("Error uploading recap:", uploadErr.message);
              }
            }
          }
        } else {
          console.log("User already exists:", data.email);
        }
      } catch (accountErr) {
        console.error("Error creating client account:", accountErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Formulaire envoye avec succes" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing form:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Erreur lors de l'envoi" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
