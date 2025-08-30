import { useState } from "react";
import Sign_up_form from "../Booking/Sign_up_form.jsx";
import Sign_in_form from "../Booking/Sign_in_form.jsx";
import Hekma from "../Booking/Hekma.jsx" ;
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

      <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: "100px", alignItems: "center", width: "100%" }}>
        {showSignUp ? (
          <div className={isTransitioning ? "form-slide-up" : ""}>
            <Sign_up_form onToggle={toggleToSignIn} />
          </div>
        ) : (
          <div className={isTransitioning ? "form-slide-up-from-bottom" : ""}>
            <Sign_in_form onToggle={toggleToSignUp} />
          </div>
        )}
        
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Hekma />
        </div>
      </div>
    </div>
    
  );
}

export default Booking_not_connected;

