import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useUserDisplayName from "../hooks/useUserDisplayName";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import "./Booking.css";

const initialReservation = {
  title: "",
  project_type: "فيديو موسيقي",
  budjet: "",
  description: "",
  session_date: "",
  session_time: "",
  session_type: "تصوير",
};

function Booking_connected() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationName = location.state?.name;
  const { user, name, loading } = useUserDisplayName(navigationName);
  const [reservation, setReservation] = useState(initialReservation);
  const [requests, setRequests] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState("");
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [notificationDebug, setNotificationDebug] = useState("");
  const formRef = useRef(null);

  async function notifyAdmins(action, projectId, details = null) {
    const { error: notifyError } = await supabase.functions.invoke(
      "notify-admins-new-booking",
      {
        body: { action, projectId, details },
      },
    );

    if (notifyError) {
      console.error("Admin booking notification failed:", notifyError);
      let debugText =
        notifyError?.message ||
        notifyError?.context?.statusText ||
        "Unknown notification error";

      if (notifyError?.context) {
        try {
          const responseBody = await notifyError.context.json();
          if (responseBody?.error) {
            debugText = `${debugText} - ${responseBody.error}`;
          }
        } catch {
          // Keep the original message if parsing fails.
        }
      }

      setNotificationDebug(`فشل إرسال إشعار البريد للمشرف: ${debugText}`);
    }
  }

  useEffect(() => {
    if (!user?.id) return;

    if (!user.email_confirmed_at) {
      setCheckingProfile(false);
      return;
    }

    async function loadReservationContext() {
      setCheckingProfile(true);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, phone_number")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
      }

      if (!profile) {
        await supabase.auth.signOut();
        navigate("/Booking", { replace: true });
        return;
      }

      if (!profile.phone_number?.trim()) {
        navigate("/complete-profile", { replace: true });
        return;
      }

      const { data: projects, error: projectsError } = await supabase
        .from("project")
        .select(
          "id, title, description, budjet, project_type, status, created_at, reviewed_at, reviewed_by, state",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error(projectsError);
        return;
      }

      const projectIds = (projects || []).map((project) => project.id);
      let sessionRows = [];
      if (projectIds.length > 0) {
        const { data, error: sessionsError } = await supabase
          .from("session")
          .select("project_id, session_date, session_time, session_type")
          .in("project_id", projectIds);

        if (sessionsError) {
          console.error(sessionsError);
        } else {
          sessionRows = data || [];
        }
      }

      const sessionByProjectId = sessionRows.reduce((lookup, row) => {
        lookup[row.project_id] = row;
        return lookup;
      }, {});

      const mergedRequests = (projects || []).map((project) => ({
        ...project,
        session_date: sessionByProjectId[project.id]?.session_date || "",
        session_time: sessionByProjectId[project.id]?.session_time || "",
        session_type: sessionByProjectId[project.id]?.session_type || "تصوير",
      }));

      setRequests(mergedRequests);
      setCheckingProfile(false);
    }

    loadReservationContext();
  }, [navigate, user]);

  function handleChange(e) {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setNotificationDebug("");

    try {
      const isEditing = Boolean(editingRequestId);
      const projectPayload = {
        title: reservation.title,
        description: reservation.description,
        budjet: reservation.budjet ? Number(reservation.budjet) : null,
        project_type: reservation.project_type,
      };

      let project;
      if (isEditing) {
        const existing = requests.find(
          (request) => request.id === editingRequestId,
        );
        const shouldResetReview = existing?.status === "approved";
        const { data, error: projectError } = await supabase
          .from("project")
          .update({
            ...projectPayload,
            ...(shouldResetReview
              ? {
                  status: "waiting_for_review",
                  state: null,
                  reviewed_at: null,
                  reviewed_by: null,
                }
              : {}),
          })
          .eq("id", editingRequestId)
          .eq("user_id", user.id)
          .select(
            "id, title, description, budjet, project_type, status, created_at, reviewed_at, reviewed_by, state",
          )
          .single();

        if (projectError) throw projectError;
        project = data;
      } else {
        const { data, error: projectError } = await supabase
          .from("project")
          .insert({
            ...projectPayload,
            user_id: user.id,
            status: "waiting_for_review",
            state: null,
          })
          .select(
            "id, title, description, budjet, project_type, status, created_at, reviewed_at, reviewed_by, state",
          )
          .single();

        if (projectError) throw projectError;
        project = data;
      }

      const sessionPayload = {
        session_date: reservation.session_date || null,
        session_time: reservation.session_time || null,
        session_type: reservation.session_type,
      };

      const { data: existingSessionRows, error: existingSessionReadError } =
        await supabase
          .from("session")
          .select("id")
          .eq("project_id", project.id)
          .eq("user_id", user.id)
          .limit(1);

      if (existingSessionReadError) throw existingSessionReadError;

      let sessionError;
      if (isEditing && (existingSessionRows?.length || 0) > 0) {
        const result = await supabase
          .from("session")
          .update(sessionPayload)
          .eq("project_id", project.id)
          .eq("user_id", user.id);
        sessionError = result.error;
      } else {
        const result = await supabase.from("session").insert({
          project_id: project.id,
          user_id: user.id,
          ...sessionPayload,
          confirmation: false,
        });
        sessionError = result.error;
      }

      if (sessionError) throw sessionError;

      const mergedProject = {
        ...project,
        session_date: reservation.session_date || "",
        session_time: reservation.session_time || "",
        session_type: reservation.session_type,
      };

      await notifyAdmins(isEditing ? "updated" : "new", project.id);

      setRequests((currentRequests) =>
        isEditing
          ? currentRequests.map((request) =>
              request.id === project.id ? mergedProject : request,
            )
          : [mergedProject, ...currentRequests],
      );
      setEditingRequestId("");
      setReservation(initialReservation);
      setMessage(
        isEditing
          ? "تم تحديث طلبك بنجاح."
          : "تم إرسال طلبك وهو الآن في انتظار المراجعة.",
      );
    } catch (err) {
      console.error(err);
      setMessage(`لم نتمكن من حفظ الطلب: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEditRequest(request) {
    setEditingRequestId(request.id);
    setReservation({
      title: request.title || "",
      project_type: request.project_type || "فيديو موسيقي",
      budjet: request.budjet ?? "",
      description: request.description || "",
      session_date: request.session_date || "",
      session_time: request.session_time || "",
      session_type: request.session_type || "تصوير",
    });
    setMessage(
      request.status === "approved"
        ? "عند تعديل طلب تمت الموافقة عليه، سيعود تلقائيا إلى انتظار المراجعة."
        : "يمكنك تعديل بيانات الطلب ثم الحفظ.",
    );
    setNotificationDebug("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleDeleteRequest(request) {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا الطلب؟");
    if (!confirmed) return;

    setDeletingId(request.id);
    setMessage("");
    setNotificationDebug("");

    try {
      await notifyAdmins("deleted", request.id, {
        title: request.title,
        description: request.description,
        budjet: request.budjet,
        project_type: request.project_type,
        status: request.status,
        created_at: request.created_at,
        session_date: request.session_date,
        session_time: request.session_time,
        session_type: request.session_type,
      });

      const { error: sessionDeleteError } = await supabase
        .from("session")
        .delete()
        .eq("project_id", request.id)
        .eq("user_id", user.id);
      if (sessionDeleteError) throw sessionDeleteError;

      const { error: projectDeleteError } = await supabase
        .from("project")
        .delete()
        .eq("id", request.id)
        .eq("user_id", user.id);
      if (projectDeleteError) throw projectDeleteError;

      setRequests((currentRequests) =>
        currentRequests.filter(
          (currentRequest) => currentRequest.id !== request.id,
        ),
      );
      if (editingRequestId === request.id) {
        setEditingRequestId("");
        setReservation(initialReservation);
      }
      setMessage("تم حذف الطلب بنجاح.");
    } catch (err) {
      console.error(err);
      setMessage(`لم نتمكن من حذف الطلب: ${err.message}`);
    } finally {
      setDeletingId("");
    }
  }

  if (loading || checkingProfile) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <h2>يرجى تسجيل الدخول أولا.</h2>;
  }

  if (!user.email_confirmed_at) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>يرجى تأكيد بريدك الإلكتروني</h1>
        <p>
          أرسلنا رابط التأكيد إلى <b>{user.email}</b>. <br />
          أكد بريدك الإلكتروني قبل المتابعة.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="reservation-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="reservation-shell">
        <motion.div
          className="reservation-heading"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>Miray Production</p>
          <h1>مرحبا {name}</h1>
          <span>املأ معلومات مشروعك وسيتم حفظ الطلب في انتظار المراجعة.</span>
        </motion.div>

        <motion.form
          className="reservation-form"
          onSubmit={handleSubmit}
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label>عنوان المشروع</label>
            <input
              className="textfields"
              type="text"
              name="title"
              value={reservation.title}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <label>نوع المشروع</label>
            <select
              name="project_type"
              value={reservation.project_type}
              onChange={handleChange}
            >
              <option>فيديو موسيقي</option>
              <option>إعلان</option>
              <option>تغطية مناسبة</option>
              <option>فيلم قصير</option>
              <option>تصوير فوتوغرافي</option>
              <option>أخرى</option>
            </select>
          </motion.div>

          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <label>الميزانية</label>
            <input
              className="textfields"
              type="number"
              name="budjet"
              min="0"
              value={reservation.budjet}
              onChange={handleChange}
              placeholder="اختياري"
            />
          </motion.div>

          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <label>التاريخ المفضل</label>
            <input
              className="textfields"
              type="date"
              name="session_date"
              value={reservation.session_date}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <label>الوقت المفضل</label>
            <input
              className="textfields"
              type="time"
              name="session_time"
              value={reservation.session_time}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div
            className="reservation-field"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <label>نوع الجلسة</label>
            <select
              name="session_type"
              value={reservation.session_type}
              onChange={handleChange}
            >
              <option>تصوير</option>
              <option>تصوير فوتوغرافي</option>
              <option>مونتاج</option>
              <option>استشارة</option>
            </select>
          </motion.div>

          <motion.div
            className="reservation-field reservation-field-wide"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <label>تفاصيل المشروع</label>
            <textarea
              name="description"
              value={reservation.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </motion.div>

          {message && (
            <motion.p
              className="reservation-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {message}
            </motion.p>
          )}
          {notificationDebug && (
            <motion.p
              className="reservation-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {notificationDebug}
            </motion.p>
          )}

          <motion.button
            className="body_button reservation-submit"
            type="submit"
            disabled={submitting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitting
              ? "جاري الحفظ..."
              : editingRequestId
                ? "حفظ التعديلات"
                : "إرسال الطلب"}
          </motion.button>
          {editingRequestId && (
            <motion.button
              className="body_button reservation-submit"
              type="button"
              onClick={() => {
                setEditingRequestId("");
                setReservation(initialReservation);
                setMessage("");
                setNotificationDebug("");
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء التعديل
            </motion.button>
          )}
        </motion.form>

        <motion.div
          className="reservation-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <motion.button
            className="button"
            type="button"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            الرئيسية
          </motion.button>
        </motion.div>

        {requests.length > 0 && (
          <motion.div
            className="reservation-list"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <h2>طلباتك</h2>
            {requests.map((request, index) => (
              <motion.article
                className="reservation-card"
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.0 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3>{request.title || request.project_type}</h3>
                  <p>{request.description}</p>
                  <p>
                    {request.session_type || "لا يوجد نوع جلسة"} -{" "}
                    {request.session_date || "لا يوجد تاريخ"} -{" "}
                    {request.session_time || "لا يوجد وقت"}
                  </p>
                </div>
                <div className="reservation-card-side">
                  <span
                    className={`reservation-status reservation-status-${request.status}`}
                  >
                    {request.status === "waiting_for_review"
                      ? "في انتظار المراجعة"
                      : request.status === "approved"
                        ? "تمت الموافقة"
                        : "مرفوض"}
                  </span>
                  <div className="reservation-card-actions">
                    <motion.button
                      type="button"
                      onClick={() => handleEditRequest(request)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      تعديل الطلب
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleDeleteRequest(request)}
                      disabled={deletingId === request.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {deletingId === request.id ? "جاري الحذف..." : "حذف"}
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Booking_connected;
