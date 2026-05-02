import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error, count } = await supabase
    .from("cms_blog_posts")
    .update({ status: "published", updated_at: new Date().toISOString() })
    .eq("status", "draft")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", new Date().toISOString())
    .select("id", { count: "exact", head: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ published: count ?? 0, at: new Date().toISOString() }),
    { headers: { "Content-Type": "application/json" } }
  );
}
