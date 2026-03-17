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

    // Use legacy Places API (placedetails) which is more commonly enabled
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=fr&key=${apiKey}`
    );

    if (!res.ok) {
      console.error("Google Places API error:", res.status, await res.text());
      return new Response(
        JSON.stringify({ fallback: true, error: `API returned ${res.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();

    if (data.status !== "OK" || !data.result) {
      console.error("Google Places API status:", data.status, data.error_message);
      return new Response(
        JSON.stringify({ fallback: true, error: data.status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = data.result;
    const response = {
      displayName: result.name,
      rating: result.rating,
      userRatingCount: result.user_ratings_total,
      reviews: (result.reviews || []).map((r: any) => ({
        authorAttribution: { displayName: r.author_name },
        rating: r.rating,
        text: { text: r.text },
        relativePublishTimeDescription: r.relative_time_description,
      })),
    };

    return new Response(JSON.stringify(response), {
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
