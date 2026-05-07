import twopac from "../assets/2pac.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import "./Body.css";

function Body() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mainButtonText = user ? "تواصل معنا" : "تسجيل الدخول";
  const mainButtonRoute = user ? "/contact" : "/Booking";

  return (
    <div className="body-container">
      {/* 2Pac image */}
      <motion.img
        src={twopac}
        alt="2Pac"
        className="body-image-2pac"
        initial={{ opacity: 0, scale: 0.8, y: 50, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, y: [0, -15, 0], rotate: 0 }}
        transition={{
          opacity: { duration: 1, delay: 0.2 },
          scale: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
          rotate: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
        }}
        whileHover={{
          scale: 1.08,
          rotate: 2,
          filter: "drop-shadow(0 20px 40px rgba(218, 185, 1, 0.4))",
        }}
      />

      {/* mirray Logo*/}
      <motion.img
        src={logo}
        alt="Logo"
        className="body-logo"
        initial={{ opacity: 0, scale: 0.5, y: -30, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: 0 }}
        transition={{
          opacity: { duration: 1, delay: 0.4 },
          scale: { type: "spring", stiffness: 120, damping: 15, delay: 0.4 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
          rotate: { type: "spring", stiffness: 120, damping: 15, delay: 0.4 },
        }}
        whileHover={{
          scale: 1.1,
          rotate: -3,
          filter: "drop-shadow(0 15px 35px rgba(255, 255, 255, 0.3))",
        }}
      />

      <motion.div
        className="body-actions"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 25,
          delay: 0.6,
        }}
      >
        <motion.button
          className="button body-action-button"
          onClick={() => navigate(mainButtonRoute)}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            delay: 0.8,
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 20px 60px rgba(218, 185, 1, 0.5)",
            background:
              "linear-gradient(135deg, rgba(218, 185, 1, 0.9), rgba(255, 248, 220, 0.9))",
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: "0 10px 30px rgba(218, 185, 1, 0.3)",
          }}
        >
          {mainButtonText}
        </motion.button>
        <span className="body-action-separator">او</span>
        <motion.button
          className="button body-action-button"
          onClick={() => navigate("/gallery")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          شاهد اعمالنا
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Body;
