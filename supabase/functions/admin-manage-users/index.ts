import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const corsBaseHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function buildCorsHeaders(origin: string | null) {
  const allowOrigin =
    !origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)
      ? origin ?? "*"
      : "null";
  return { ...corsBaseHeaders, "Access-Control-Allow-Origin": allowOrigin };
}

async function requireAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData.user) {
    throw new Error("Invalid auth token");
  }

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (adminError || !adminRow) {
    throw new Error("Forbidden");
  }

  return authData.user.id;
}

function normalizeTimestamp(value: string | null | undefined) {
  if (!value) return "غير متوفر";
  try {
    return new Date(value).toLocaleString("ar");
  } catch {
    return value;
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const adminId = await requireAdmin(req.headers.get("Authorization"));
    const { action, targetUserId } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "action is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const [{ data: profileRows, error: profilesError }, { data: projectRows, error: projectsError }] =
        await Promise.all([
          supabaseAdmin
            .from("profiles")
            .select("id, first_name, last_name, user_name, email, phone_number")
            .order("created_at", { ascending: false }),
          supabaseAdmin.from("project").select("user_id"),
        ]);

      if (profilesError || projectsError) {
        throw new Error((profilesError || projectsError)?.message);
      }

      const projectsByUser = (projectRows ?? []).reduce<Record<string, number>>((acc, row) => {
        acc[row.user_id] = (acc[row.user_id] || 0) + 1;
        return acc;
      }, {});

      const users = [];
      for (const profile of profileRows ?? []) {
        const { data: authUserData } = await supabaseAdmin.auth.admin.getUserById(profile.id);
        const authUser = authUserData?.user;
        users.push({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          user_name: profile.user_name,
          email: profile.email || authUser?.email || "",
          phone_number: profile.phone_number,
          is_blocked: Boolean(authUser?.banned_until),
          last_sign_in_at: normalizeTimestamp(authUser?.last_sign_in_at),
          project_count: projectsByUser[profile.id] || 0,
        });
      }

      return new Response(JSON.stringify({ ok: true, users }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!targetUserId) {
      return new Response(JSON.stringify({ error: "targetUserId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (targetUserId === adminId) {
      return new Response(JSON.stringify({ error: "Cannot modify your own admin account" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "block") {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        ban_duration: "876000h",
      });
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "unblock") {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
        ban_duration: "none",
      });
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const [{ error: sessionError }, { error: projectError }, { error: profileError }] = await Promise.all([
        supabaseAdmin.from("session").delete().eq("user_id", targetUserId),
        supabaseAdmin.from("project").delete().eq("user_id", targetUserId),
        supabaseAdmin.from("profiles").delete().eq("id", targetUserId),
      ]);

      if (sessionError || projectError || profileError) {
        throw new Error((sessionError || projectError || profileError)?.message);
      }

      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
      if (authDeleteError) throw new Error(authDeleteError.message);

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Request failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
