import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorise" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: userErr } = await adminClient.auth.getUser(token);
    if (userErr || !caller) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Acces refuse" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, full_name, project_name } = await req.json();
    if (!email || !full_name) {
      return new Response(JSON.stringify({ error: "Email et nom requis" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Determine app URL for redirect
    const origin = req.headers.get("origin") || "https://declicdigital.lovable.app";
    const redirectTo = `${origin}/connexion`;

    let userId: string;

    // Try to invite
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(normalizedEmail, {
      data: { full_name },
      redirectTo,
    });

    if (inviteError) {
      // User might already exist
      const { data: { users } } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const existing = users?.find((u) => (u.email || "").toLowerCase() === normalizedEmail);
      if (!existing) {
        return new Response(JSON.stringify({ error: inviteError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = existing.id;
      // Send password reset instead
      await adminClient.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });
    } else {
      userId = inviteData.user.id;
    }

    // Assign client role
    await adminClient.from("user_roles").upsert(
      { user_id: userId, role: "client" },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );

    // Update profile
    await adminClient.from("profiles").update({ full_name, email: normalizedEmail }).eq("id", userId);

    // Create project if requested
    if (project_name) {
      const { data: existing } = await adminClient.from("projects").select("id").eq("client_id", userId).limit(1);
      if (!existing || existing.length === 0) {
        await adminClient.from("projects").insert({ client_id: userId, name: project_name });
      }
    }

    return new Response(JSON.stringify({ success: true, user_id: userId, message: "Invitation envoyee." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Erreur serveur" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
