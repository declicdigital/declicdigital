import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "url is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY_BACKEND") || Deno.env.get("GOOGLE_MAPS_API_KEY") || "";
    const categories = "category=performance&category=accessibility&category=best-practices&category=seo";
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&${categories}&key=${apiKey}`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      const err = await res.text();
      console.error("PageSpeed API error:", err);
      return new Response(JSON.stringify({ error: "PageSpeed API error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const cats = data.lighthouseResult?.categories;

    const scores = {
      performance: cats?.performance ? Math.round(cats.performance.score * 100) : null,
      accessibility: cats?.accessibility ? Math.round(cats.accessibility.score * 100) : null,
      "best-practices": cats?.["best-practices"] ? Math.round(cats["best-practices"].score * 100) : null,
      seo: cats?.seo ? Math.round(cats.seo.score * 100) : null,
    };

    return new Response(JSON.stringify({ scores }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
