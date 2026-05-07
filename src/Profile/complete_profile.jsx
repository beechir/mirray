import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Default_view from "../Defoult_view/Default_view.jsx";
import { supabase } from "../supabaseClient";
import "./complete_profile.css";

const initialFormData = {
  id: "",
  first_name: "",
  last_name: "",
  user_name: "",
  job: "",
  adress: "",
  phone_number: "",
  birth_date: "",
  email: "",
};

function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/Booking");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, user_name, job, adress, phone_number, birth_date, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        const errorDetails = [profileError.code, profileError.message].filter(Boolean).join(" - ");
        setLoadError(`لم نتمكن من قراءة معلوماتك الحالية. ${errorDetails}`);
      }

      setFormData({
        id: profile?.id || user.id,
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        user_name: profile?.user_name || "",
        job: profile?.job || "",
        adress: profile?.adress || "",
        phone_number: profile?.phone_number || "",
        birth_date: profile?.birth_date || "",
        email: profile?.email || user.email || "",
      });
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!formData.phone_number.trim()) {
        setMessage("رقم الهاتف ضروري لإكمال الملف الشخصي.");
        setSaving(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw userError || new Error("No user found");

      const profilePayload = {
        id: user.id,
        email: user.email,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        user_name: formData.user_name.trim(),
        job: formData.job.trim(),
        adress: formData.adress.trim(),
        phone_number: formData.phone_number.trim(),
        birth_date: formData.birth_date || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });

      if (error) throw error;

      navigate("/");
    } catch (err) {
      console.error(err.message);
      const errorDetails = [err.code, err.message].filter(Boolean).join(" - ");
      setMessage(`لم نتمكن من حفظ المعطيات. ${errorDetails}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Default_view>
      <section className="profile-page">
        <div className="profile-panel">
          <div className="profile-heading">
            <p>Miray Production</p>
            <h1>أكمل معطياتك</h1>
            <span>يمكنك تعديل معلوماتك الشخصية هنا. كلمة السر لا تتغير من هذه الصفحة.</span>
          </div>

          {loading ? (
            <h2 className="profile-loading">Loading...</h2>
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              {loadError && <p className="profile-message">{loadError}</p>}

              <div className="profile-field">
                <label>البريد الالكتروني</label>
                <input className="textfields" type="email" name="email" value={formData.email} disabled />
              </div>

              <div className="profile-field">
                <label>الاسم</label>
                <input className="textfields" type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
              </div>

              <div className="profile-field">
                <label>اللقب</label>
                <input className="textfields" type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
              </div>

              <div className="profile-field">
                <label>اسم المستخدم</label>
                <input className="textfields" type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
              </div>

              <div className="profile-field">
                <label>العمل</label>
                <input className="textfields" type="text" name="job" value={formData.job} onChange={handleChange} />
              </div>

              <div className="profile-field">
                <label>العنوان</label>
                <input className="textfields" type="text" name="adress" value={formData.adress} onChange={handleChange} />
              </div>

              <div className="profile-field">
                <label>رقم الهاتف</label>
                <input className="textfields" type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
              </div>

              <div className="profile-field">
                <label>تاريخ الميلاد</label>
                <input className="textfields" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
              </div>

              {message && <p className="profile-message">{message}</p>}

              <button className="body_button profile-submit" type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
            </form>
          )}
        </div>
      </section>
    </Default_view>
  );
}

export default CompleteProfile;
