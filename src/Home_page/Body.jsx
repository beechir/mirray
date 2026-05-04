import twopac from "../assets/2pac.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Body.css";

function Body() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mainButtonText = user ? "تواصل معنا" : "تسجيل الدخول";
  const mainButtonRoute = user ? "/contact" : "/Booking";

  return (
   <div className="body-container">
  {/* 2Pac image */}
  <img
    src={twopac}
    alt="2Pac"
    className="body-image-2pac"
  />

  {/* mirray Logo*/}
  <img
    src={logo}
    alt="Logo"
    className="body-logo"
  />

  <div className="body-actions">
    <button className="button body-action-button" onClick={() => navigate(mainButtonRoute)}>
      {mainButtonText}
    </button>
    <span className="body-action-separator">او</span>
    <button className="button body-action-button" onClick={() => navigate("/gallery")}>
      شاهد اعمالنا
    </button>
  </div>
  {/*<h1
  style={{
    position: "absolute",
      top: "60vh",       // 30% from the top
      left: "10vw",  
      fontSize: "70px",    // responsive size

  }}
  >welcome</h1> */
}
</div>

  );
}

export default Body;
