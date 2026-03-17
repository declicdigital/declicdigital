const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    const placeId = Deno.env.get("GOOGLE_PLACE_ID") || "ChIJsYNdrCdx5kcR89wPMta_l-w";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ fallback: true, error: "API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
        },
      }
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return new Response(
        JSON.stringify({ fallback: true, error: `API returned ${res.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(
      JSON.stringify({ fallback: true, error: "Failed to fetch reviews" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
