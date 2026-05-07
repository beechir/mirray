import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type ProjectRow = {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  budjet: number | null;
  project_type: string | null;
  status: string | null;
  created_at: string | null;
};

type SessionRow = {
  session_date: string | null;
  session_time: string | null;
  session_type: string | null;
};

type NotificationAction = "new" | "updated" | "deleted";

type NotificationDetails = {
  title?: string | null;
  description?: string | null;
  budjet?: number | null;
  project_type?: string | null;
  status?: string | null;
  created_at?: string | null;
  session_date?: string | null;
  session_time?: string | null;
  session_type?: string | null;
};

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  user_name: string | null;
  phone_number: string | null;
  email: string | null;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("ADMIN_NOTIFICATIONS_FROM_EMAIL") ?? "";
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

async function requireAuthenticatedUserId(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData.user) {
    throw new Error("Invalid auth token");
  }

  return authData.user.id;
}

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

Deno.serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const requesterUserId = await requireAuthenticatedUserId(req.headers.get("Authorization"));

    if (!RESEND_API_KEY || !FROM_EMAIL) {
      return new Response(
        JSON.stringify({
          error:
            "Missing RESEND_API_KEY or ADMIN_NOTIFICATIONS_FROM_EMAIL secret",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { projectId, action = "new", details } = await req.json() as {
      projectId?: string;
      action?: NotificationAction;
      details?: NotificationDetails;
    };

    if (!["new", "updated", "deleted"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "action must be one of: new, updated, deleted" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: project, error: projectError } = await supabaseAdmin
      .from("project")
      .select("id, user_id, title, description, budjet, project_type, status, created_at")
      .eq("id", projectId)
      .maybeSingle<ProjectRow>();

    if (projectError) {
      throw new Error(projectError?.message ?? "Project not found");
    }

    if (!project && action !== "deleted") {
      throw new Error("Project not found");
    }

    if (project && project.user_id !== requesterUserId) {
      throw new Error("Forbidden");
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("session")
      .select("session_date, session_time, session_type")
      .eq("project_id", projectId)
      .maybeSingle<SessionRow>();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    let profile: ProfileRow | null = null;
    if (project?.user_id) {
      const { data: profileRow, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("first_name, last_name, user_name, phone_number, email")
        .eq("id", project.user_id)
        .maybeSingle<ProfileRow>();

      if (profileError) {
        throw new Error(profileError.message);
      }
      profile = profileRow;
    }
    const effectiveProject = {
      id: projectId,
      title: project?.title ?? details?.title ?? null,
      description: project?.description ?? details?.description ?? null,
      budjet: project?.budjet ?? details?.budjet ?? null,
      project_type: project?.project_type ?? details?.project_type ?? null,
      status: project?.status ?? details?.status ?? null,
      created_at: project?.created_at ?? details?.created_at ?? null,
    };

    const effectiveSession = {
      session_date: session?.session_date ?? details?.session_date ?? null,
      session_time: session?.session_time ?? details?.session_time ?? null,
      session_type: session?.session_type ?? details?.session_type ?? null,
    };

    const actionTitle =
      action === "new"
        ? "طلب جلسة جديد - Miray"
        : action === "updated"
          ? "تحديث على طلب جلسة - Miray"
          : "حذف طلب جلسة - Miray";
    const actionText =
      action === "new"
        ? "تم إرسال طلب مشروع جديد من طرف مستخدم."
        : action === "updated"
          ? "قام المستخدم بتحديث طلب مشروع موجود."
          : "قام المستخدم بحذف طلب مشروع.";
    const subject =
      action === "new"
        ? "طلب جلسة جديد في Miray"
        : action === "updated"
          ? "تحديث طلب جلسة في Miray"
          : "حذف طلب جلسة في Miray";
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("admin_users")
      .select("user_id");

    if (adminsError) {
      throw new Error(adminsError.message);
    }

    const adminEmails: string[] = [];
    for (const admin of admins ?? []) {
      const { data: adminUser, error: adminUserError } = await supabaseAdmin
        .auth
        .admin
        .getUserById(admin.user_id);
      if (!adminUserError && adminUser?.user?.email) {
        adminEmails.push(adminUser.user.email);
      }
    }

    if (adminEmails.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "No admin emails found" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const fullName = [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();

    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.7; color: #111;">
        <h2 style="margin-bottom: 8px;">${esc(actionTitle)}</h2>
        <p>${esc(actionText)}</p>
        <hr />
        <h3>معلومات العميل</h3>
        <ul>
          <li><b>الاسم:</b> ${esc(fullName || "غير متوفر")}</li>
          <li><b>اسم المستخدم:</b> ${esc(profile?.user_name || "غير متوفر")}</li>
          <li><b>البريد الإلكتروني:</b> ${esc(profile?.email || "غير متوفر")}</li>
          <li><b>رقم الهاتف:</b> ${esc(profile?.phone_number || "غير متوفر")}</li>
        </ul>
        <h3>معلومات المشروع</h3>
        <ul>
          <li><b>معرّف المشروع:</b> ${esc(effectiveProject.id)}</li>
          <li><b>العنوان:</b> ${esc(effectiveProject.title || "غير متوفر")}</li>
          <li><b>نوع المشروع:</b> ${esc(effectiveProject.project_type || "غير متوفر")}</li>
          <li><b>الميزانية:</b> ${esc(effectiveProject.budjet ?? "غير محددة")}</li>
          <li><b>الوصف:</b> ${esc(effectiveProject.description || "غير متوفر")}</li>
          <li><b>الحالة:</b> ${esc(effectiveProject.status || "غير متوفر")}</li>
          <li><b>تاريخ الإنشاء:</b> ${esc(effectiveProject.created_at || "غير متوفر")}</li>
        </ul>
        <h3>معلومات الجلسة</h3>
        <ul>
          <li><b>التاريخ:</b> ${esc(effectiveSession.session_date || "غير محدد")}</li>
          <li><b>الوقت:</b> ${esc(effectiveSession.session_time || "غير محدد")}</li>
          <li><b>نوع الجلسة:</b> ${esc(effectiveSession.session_type || "غير محدد")}</li>
        </ul>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: adminEmails,
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errorText = await emailRes.text();
      throw new Error(`Resend failed: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ ok: true, sent_to: adminEmails.length }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Request failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
