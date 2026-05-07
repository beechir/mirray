import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import { supabase } from "../supabaseClient";
import "./Booking.css";

function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function resendEmail() {
    if (!email) {
      setMessage("أدخل بريدك من صفحة التسجيل لإعادة إرسال الرابط.");
      return;
    }

    setSending(true);
    setMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/complete-profile`,
      },
    });

    if (error) {
      setMessage(`لم نتمكن من إعادة إرسال البريد: ${error.message}`);
    } else {
      setMessage("تم إرسال رابط التأكيد مرة أخرى.");
    }

    setSending(false);
  }

  return (
    <Default_view>
      <section className="confirm-email-page">
        <div className="confirm-email-panel">
          <p>Miray Production</p>
          <h1>أكد بريدك الإلكتروني</h1>
          <span>
            أرسلنا رابط التأكيد إلى {email ? <b>{email}</b> : "بريدك الإلكتروني"}. افتح بريدك واضغط على الرابط، ثم سجل الدخول من جديد.
          </span>

          <div className="confirm-email-actions">
            <a className="button" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">
              فتح Gmail
            </a>
            <button className="button" type="button" onClick={resendEmail} disabled={sending}>
              {sending ? "جاري الإرسال..." : "إعادة إرسال الرابط"}
            </button>
            <button className="button" type="button" onClick={() => navigate("/Booking")}>
              العودة لتسجيل الدخول
            </button>
          </div>

          {message && <p className="confirm-email-message">{message}</p>}
        </div>
      </section>
    </Default_view>
  );
}

export default ConfirmEmail;
