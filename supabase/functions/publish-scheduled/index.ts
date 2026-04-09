import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date().toISOString();

    // Find all scheduled posts whose created_at is in the past
    const { data: posts, error: fetchError } = await supabase
      .from("cms_blog_posts")
      .select("id, title, slug")
      .eq("status", "scheduled")
      .lte("created_at", now);

    if (fetchError) throw fetchError;

    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ published: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ids = posts.map((p) => p.id);

    const { error: updateError } = await supabase
      .from("cms_blog_posts")
      .update({ status: "published", updated_at: now })
      .in("id", ids);

    if (updateError) throw updateError;

    console.log(`Published ${posts.length} scheduled posts:`, posts.map(p => p.slug));

    return new Response(
      JSON.stringify({ published: posts.length, slugs: posts.map(p => p.slug) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error publishing scheduled posts:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
