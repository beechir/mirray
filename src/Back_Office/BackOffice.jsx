import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import "./BackOffice.css";

const initialLogin = {
  email: "",
  password: "",
};

function BackOffice() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUserId, setAdminUserId] = useState("");
  const [activeTab, setActiveTab] = useState("bookings");
  const [loginData, setLoginData] = useState(initialLogin);
  const [authenticating, setAuthenticating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userActionId, setUserActionId] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  const sessionByProject = useMemo(() => {
    return sessions.reduce((lookup, session) => {
      lookup[session.project_id] = session;
      return lookup;
    }, {});
  }, [sessions]);

  const profileById = useMemo(() => {
    return profiles.reduce((lookup, profile) => {
      lookup[profile.id] = profile;
      return lookup;
    }, {});
  }, [profiles]);

  useEffect(() => {
    async function clearPublicSession() {
      await supabase.auth.signOut();
      setLoading(false);
    }

    clearPublicSession();
  }, []);

  function handleLoginChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }

  async function loadBackOfficeData() {
    const [
      { data: projectRows, error: projectError },
      { data: sessionRows, error: sessionError },
      { data: profileRows, error: profileError },
    ] = await Promise.all([
      supabase
        .from("project")
        .select("id, title, description, budjet, project_type, state, status, admin_note, created_at, reviewed_at, user_id")
        .order("created_at", { ascending: false }),
      supabase
        .from("session")
        .select("id, project_id, user_id, session_date, session_time, session_type, confirmation"),
      supabase
        .from("profiles")
        .select("id, first_name, last_name, user_name, email, phone_number"),
    ]);

    if (projectError || sessionError || profileError) {
      console.error(projectError || sessionError || profileError);
      setMessage("لم نتمكن من تحميل كل بيانات المكتب الخلفي.");
    }

    setProjects(projectRows || []);
    setSessions(sessionRows || []);
    setProfiles(profileRows || []);
  }

  async function loadUsers() {
    setUsersLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-manage-users", {
      body: { action: "list" },
    });

    if (error) {
      console.error(error);
      setMessage(`تعذر تحميل قائمة المستخدمين: ${error.message}`);
      setUsersLoading(false);
      return;
    }

    setUsers(data?.users || []);
    setUsersLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthenticating(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error || !data.user) {
      setMessage("بيانات الدخول غير صحيحة.");
      setAuthenticating(false);
      return;
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      setMessage("هذا الحساب لا يملك صلاحية الدخول إلى المكتب الخلفي.");
      setAuthenticating(false);
      return;
    }

    setIsAdmin(true);
    setAdminUserId(data.user.id);
    setLoginData(initialLogin);
    await Promise.all([loadBackOfficeData(), loadUsers()]);
    setAuthenticating(false);
  }

  async function updateProjectStatus(projectId, status) {
    setUpdatingId(projectId);
    setMessage("");

    const { error } = await supabase
      .from("project")
      .update({
        status,
        state: status === "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUserId,
      })
      .eq("id", projectId);

    if (error) {
      console.error(error);
      setMessage(`لم نتمكن من تحديث الطلب: ${error.message}`);
      setUpdatingId("");
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              status,
              state: status === "approved",
              reviewed_at: new Date().toISOString(),
              reviewed_by: adminUserId,
            }
          : project
      )
    );
    setUpdatingId("");
  }

  async function handleUserAction(userId, action) {
    if (!userId || userId === adminUserId) {
      setMessage("لا يمكنك تنفيذ هذا الإجراء على حسابك الإداري الحالي.");
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm("هل أنت متأكد من حذف هذا الحساب وجميع بياناته؟");
      if (!confirmed) return;
    }

    setUserActionId(userId);
    setMessage("");

    const { data, error } = await supabase.functions.invoke("admin-manage-users", {
      body: { action, targetUserId: userId },
    });

    if (error || data?.error) {
      const errorMessage = error?.message || data?.error || "خطأ غير معروف";
      setMessage(`تعذر تنفيذ العملية: ${errorMessage}`);
      setUserActionId("");
      return;
    }

    setMessage(
      action === "block"
        ? "تم حظر الحساب بنجاح."
        : action === "unblock"
          ? "تم فك الحظر عن الحساب."
          : "تم حذف الحساب بنجاح."
    );
    await Promise.all([loadUsers(), loadBackOfficeData()]);
    setUserActionId("");
  }

  return (
    <section className="backoffice-page">
      <div className="backoffice-shell">
        <div className="backoffice-heading">
          <p>Miray Production</p>
          <h1>المكتب الخلفي</h1>
          <span>سجل دخول المسؤول لإدارة طلبات الحجز وحسابات المستخدمين.</span>
        </div>

        {loading ? (
          <h2 className="backoffice-empty">جاري التحميل...</h2>
        ) : !isAdmin ? (
          <form className="backoffice-login" onSubmit={handleLogin}>
            <div className="backoffice-login-copy">
              <h2>دخول المسؤول</h2>
              <p>يتم فصل أي جلسة مستخدم عادي قبل فتح هذه الصفحة.</p>
            </div>

            <label>
              البريد الإلكتروني
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </label>

            <label>
              كلمة السر
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </label>

            {message && <p className="backoffice-message">{message}</p>}

            <button className="body_button" type="submit" disabled={authenticating}>
              {authenticating ? "جاري الدخول..." : "دخول"}
            </button>
          </form>
        ) : (
          <div className="backoffice-panel">
            <div className="backoffice-tabs">
              <button
                type="button"
                className={activeTab === "bookings" ? "backoffice-tab backoffice-tab-active" : "backoffice-tab"}
                onClick={() => setActiveTab("bookings")}
              >
                طلبات الحجز
              </button>
              <button
                type="button"
                className={activeTab === "users" ? "backoffice-tab backoffice-tab-active" : "backoffice-tab"}
                onClick={() => setActiveTab("users")}
              >
                المستخدمون
              </button>
            </div>

            {message && <p className="backoffice-message">{message}</p>}

            {activeTab === "bookings" ? (
              projects.length === 0 ? (
                <p className="backoffice-empty">لا توجد طلبات حاليا.</p>
              ) : (
                <div className="backoffice-table">
                  <div className="backoffice-row backoffice-row-head">
                    <span>العميل</span>
                    <span>المشروع</span>
                    <span>الجلسة</span>
                    <span>الحالة</span>
                    <span>الإجراءات</span>
                  </div>

                  {projects.map((project) => {
                    const profile = profileById[project.user_id];
                    const session = sessionByProject[project.id];
                    const clientName =
                      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
                      profile?.user_name ||
                      profile?.email ||
                      "عميل غير معروف";

                    return (
                      <article className="backoffice-row" key={project.id}>
                        <div>
                          <strong>{clientName}</strong>
                          <small>{profile?.email}</small>
                          <small>{profile?.phone_number}</small>
                        </div>

                        <div>
                          <strong>{project.title || project.project_type}</strong>
                          <small>{project.project_type}</small>
                          <small>{project.budjet ? `الميزانية: ${project.budjet}` : "لا توجد ميزانية"}</small>
                          <p>{project.description}</p>
                        </div>

                        <div>
                          <strong>{session?.session_type || "لا يوجد نوع جلسة"}</strong>
                          <small>{session?.session_date || "لا يوجد تاريخ"}</small>
                          <small>{session?.session_time || "لا يوجد وقت"}</small>
                        </div>

                        <span className={`reservation-status reservation-status-${project.status}`}>
                          {project.status === "waiting_for_review"
                            ? "في انتظار المراجعة"
                            : project.status === "approved"
                              ? "تمت الموافقة"
                              : "مرفوض"}
                        </span>

                        <div className="backoffice-actions">
                          <button
                            type="button"
                            onClick={() => updateProjectStatus(project.id, "approved")}
                            disabled={updatingId === project.id || project.status === "approved"}
                          >
                            موافقة
                          </button>
                          <button
                            type="button"
                            onClick={() => updateProjectStatus(project.id, "discarded")}
                            disabled={updatingId === project.id || project.status === "discarded"}
                          >
                            رفض
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )
            ) : usersLoading ? (
              <p className="backoffice-empty">جاري تحميل قائمة المستخدمين...</p>
            ) : users.length === 0 ? (
              <p className="backoffice-empty">لا يوجد مستخدمون حاليا.</p>
            ) : (
              <div className="backoffice-users-table">
                <div className="backoffice-users-row backoffice-row-head">
                  <span>المستخدم</span>
                  <span>الحالة</span>
                  <span>النشاط</span>
                  <span>الإجراءات</span>
                </div>

                {users.map((user) => {
                  const displayName =
                    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
                    user.user_name ||
                    user.email ||
                    "مستخدم غير معروف";
                  const isCurrentAdmin = user.id === adminUserId;

                  return (
                    <article className="backoffice-users-row" key={user.id}>
                      <div>
                        <strong>{displayName}</strong>
                        <small>{user.email || "لا يوجد بريد إلكتروني"}</small>
                        <small>{user.phone_number || "لا يوجد رقم هاتف"}</small>
                      </div>
                      <div>
                        <span className={user.is_blocked ? "backoffice-status-badge blocked" : "backoffice-status-badge active"}>
                          {user.is_blocked ? "محظور" : "نشط"}
                        </span>
                        {isCurrentAdmin && <small>هذا حسابك الحالي</small>}
                      </div>
                      <div>
                        <small>عدد الطلبات: {user.project_count}</small>
                        <small>آخر دخول: {user.last_sign_in_at || "غير متوفر"}</small>
                      </div>
                      <div className="backoffice-actions">
                        <button
                          type="button"
                          onClick={() => handleUserAction(user.id, user.is_blocked ? "unblock" : "block")}
                          disabled={userActionId === user.id || isCurrentAdmin}
                        >
                          {user.is_blocked ? "فك الحظر" : "حظر"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserAction(user.id, "delete")}
                          disabled={userActionId === user.id || isCurrentAdmin}
                        >
                          حذف
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default BackOffice;
