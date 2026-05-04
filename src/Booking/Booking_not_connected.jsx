import { useState } from "react";
import Sign_up_form from "../Booking/Sign_up_form.jsx";
import Sign_in_form from "../Booking/Sign_in_form.jsx";
import Hekma from "../Booking/Hekma.jsx" ;
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
    <div className="booking-page">
      <div className="booking-content">
        <div className="booking-form-panel">
          <div className="booking-form-copy">
            <p>Miray Production</p>
            <h1>{showSignUp ? "انشاء حساب" : "تسجيل الدخول"}</h1>
          </div>

          {showSignUp ? (
            <div className={isTransitioning ? "form-slide-up" : ""}>
              <Sign_up_form onToggle={toggleToSignIn} />
            </div>
          ) : (
            <div className={isTransitioning ? "form-slide-up-from-bottom" : ""}>
              <Sign_in_form onToggle={toggleToSignUp} />
            </div>
          )}
        </div>
        
        <div className="hekma-wrapper">
          <Hekma />
        </div>
      </div>
    </div>
  );
}

export default Booking_not_connected;
