import { useState } from "react";
import Sign_up_form from "../Booking/Sign_up_form.jsx";
import Sign_in_form from "../Booking/Sign_in_form.jsx";
import Hekma from "../Booking/Hekma.jsx";
import { motion } from "framer-motion";
import "./Booking.css";

function Booking_not_connected() {
  const [showSignUp, setShowSignUp] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleToSignIn = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSignUp(false);
      setIsTransitioning(false);
    }, 500);
  };

  const toggleToSignUp = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setShowSignUp(true);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <motion.div
      className="booking-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="booking-content">
        <motion.div
          className="booking-form-panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="booking-form-copy"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>Miray Production</p>
            <h1>{showSignUp ? "انشاء حساب" : "تسجيل الدخول"}</h1>
          </motion.div>

          <motion.div
            className={isTransitioning ? "form-slide-up" : ""}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            key={showSignUp ? "signup" : "signin"} // Force re-render animation
          >
            {showSignUp ? (
              <Sign_up_form onToggle={toggleToSignIn} />
            ) : (
              <Sign_in_form onToggle={toggleToSignUp} />
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="hekma-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Hekma />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Booking_not_connected;
