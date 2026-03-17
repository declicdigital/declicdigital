import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Save form submission
    const submissionId = crypto.randomUUID();
    await adminClient.from("form_submissions").insert({
      id: submissionId,
      data: data,
      file_paths: data.file_paths || [],
    });

    console.log("Form submission saved:", {
      name: data.full_name,
      email: data.email,
      company: data.company,
    });

    // 2. Auto-create client account via invitation
    if (data.email) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await adminClient.auth.admin.listUsers();
        const existing = existingUsers?.users?.find(
          (u: any) => u.email === data.email
        );

        if (!existing) {
          // Invite user by email (sends invitation email with password setup link)
          const { data: userData, error: userError } =
            await adminClient.auth.admin.inviteUserByEmail(data.email, {
              data: { full_name: data.full_name || "" },
              redirectTo: "https://declicdigital.net/connexion",
            });

          if (userError) {
            console.error("Error inviting user:", userError.message);
          } else if (userData.user) {
            console.log("User invited:", userData.user.id);

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
            await adminClient.from("projects").insert({
              client_id: userData.user.id,
              name: `Projet ${data.company || data.full_name || "Client"}`,
              description: data.desc || data.msg || "",
            });

            console.log("Client account fully created with project");
          }
        } else {
          console.log("User already exists:", data.email);
        }
      } catch (accountErr) {
        console.error("Error creating client account:", accountErr);
        // Don't fail the form submission if account creation fails
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Formulaire envoyé avec succès" }),
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
