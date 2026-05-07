import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
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
    <motion.header
      className="head-header"
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20
      }}
    >
      <div className="head-container">
        <motion.h1
          onClick={goToHome}
          className="glow-hover head-home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.2 }}
          whileHover={{
            scale: 1.08,
            textShadow: "0 0 20px rgba(218, 185, 1, 0.8)",
            color: "#fff8dc"
          }}
        >
          الرئيسية
        </motion.h1>

        <div className="head-right-section">
          <motion.h1
            onClick={goToBooking}
            className="glow-hover head-link"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.3 }}
            whileHover={{
              scale: 1.08,
              textShadow: "0 0 15px rgba(218, 185, 1, 0.6)",
              color: "#fff8dc"
            }}
          >
            احجز جلستك
          </motion.h1>
          <motion.h1
            onClick={goToAbout}
            className="glow-hover head-link"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.4 }}
            whileHover={{
              scale: 1.08,
              textShadow: "0 0 15px rgba(218, 185, 1, 0.6)",
              color: "#fff8dc"
            }}
          >
            من نحن
          </motion.h1>
          <motion.h1
            onClick={goToGallery}
            className="glow-hover head-link"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.5 }}
            whileHover={{
              scale: 1.08,
              textShadow: "0 0 15px rgba(218, 185, 1, 0.6)",
              color: "#fff8dc"
            }}
          >
            المعرض
          </motion.h1>
          <motion.h1
            onClick={goToContact}
            className="glow-hover head-link"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, delay: 0.6 }}
            whileHover={{
              scale: 1.08,
              textShadow: "0 0 15px rgba(218, 185, 1, 0.6)",
              color: "#fff8dc"
            }}
          >
            تواصل معنا
          </motion.h1>

          {user ? (
            <div className="head-settings">
              <motion.button
                className="head-settings-button"
                type="button"
                aria-label="فتح الاعدادات"
                aria-expanded={isSettingsOpen}
                onClick={() => setIsSettingsOpen((isOpen) => !isOpen)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
                whileHover={{
                  scale: 1.15,
                  rotate: 180,
                  boxShadow: "0 10px 30px rgba(218, 185, 1, 0.4)"
                }}
                whileTap={{ scale: 0.85 }}
              >
                ⚙
              </motion.button>

              {isSettingsOpen && (
                <motion.div
                  className="head-settings-menu"
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.button
                    type="button"
                    onClick={handleAuthClick}
                    whileHover={{ backgroundColor: "#f0f0f0" }}
                  >
                    تسجيل الخروج
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={goToCompleteProfile}
                    whileHover={{ backgroundColor: "#f0f0f0" }}
                  >
                    أكمل معطياتك
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handlePendingOption}
                    whileHover={{ backgroundColor: "#f0f0f0" }}
                  >
                    تغيير كلمة السر
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              className="head-login-button"
              type="button"
              onClick={goToBooking}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 25, delay: 0.8 }}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 15px 40px rgba(218, 185, 1, 0.5)",
                background: "linear-gradient(135deg, rgba(218, 185, 1, 0.9), rgba(255, 248, 220, 0.9))"
              }}
              whileTap={{ scale: 0.92 }}
            >
              تسجيل الدخول
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export default Head;
