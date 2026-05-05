import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import "./Head.css";

function Head() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const goToContact = () => {
    navigate("/contact");
  };

  const goToBooking = () => {
    navigate("/Booking");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToAbout = () => {
    navigate("/about");
  };

  const goToGallery = () => {
    navigate("/gallery");
  };

  const handleAuthClick = async () => {
    closeSettings();

    if (user) {
      await supabase.auth.signOut();
      navigate("/");
      return;
    }

    navigate("/Booking");
  };

  const goToCompleteProfile = () => {
    closeSettings();
    navigate(user ? "/complete-profile" : "/Booking");
  };

  const handlePendingOption = () => {
    closeSettings();
  };

  return (
    <header className="head-header">
      <div className="head-container">
        <h1 onClick={goToHome} className="glow-hover head-home">
          الرئيسية
        </h1>

        <div className="head-right-section">
          <h1 onClick={goToBooking} className="glow-hover head-link">
            احجز جلستك
          </h1>
          <h1 onClick={goToAbout} className="glow-hover head-link">
            من نحن
          </h1>
          <h1 onClick={goToGallery} className="glow-hover head-link">
            المعرض
          </h1>
          <h1 onClick={goToContact} className="glow-hover head-link">
            تواصل معنا
          </h1>

          <div className="head-settings">
            <button
              className="head-settings-button"
              type="button"
              aria-label="فتح الاعدادات"
              aria-expanded={isSettingsOpen}
              onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
            >
              ⚙
            </button>

            {isSettingsOpen && (
              <div className="head-settings-menu">
                <button type="button" onClick={handleAuthClick}>
                  {user ? "تسجيل الخروج" : "تسجيل الدخول"}
                </button>
                <button type="button" onClick={goToCompleteProfile}>
                  أكمل معطياتك
                </button>
                <button type="button" onClick={handlePendingOption}>
                  تغيير كلمة السر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Head;
