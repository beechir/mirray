import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; 
import { supabase } from "../supabaseClient";


function Head() {
    const navigate = useNavigate();
    const user = useAuth();

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
    }


     const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); 
  };
  

  return <header style={{
      position: "fixed",
      top: 0,
      width: "100%",
      textAlign: "left",
      padding: "1rem",
      color: "white",
      zIndex: 10,
      userSelect: "none",
    }}>   
   <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "20px",
    paddingRight: "14px",
    width: "100%",
  }}
>
  
  {/*Home */}
  <h1 onClick={goToHome}
    className="glow-hover"
    style={{
      fontFamily: "Varino",
      fontSize: "14px",
    }}
  >
    Home
  </h1>

  {/*About, Gallery, Contact */}
  <div style={{ display: "flex", gap: "60px" }}>
    <h1 onClick={goToBooking} className="glow-hover" style={{ fontFamily: "Varino", fontSize: "14px" }}>
      Book Ur Session
    </h1>
    <h1 onClick={goToAbout} className="glow-hover" style={{ fontFamily: "Varino", fontSize: "14px" }}>
      About Us
    </h1>
    <h1 onClick={goToGallery}  className="glow-hover" style={{ fontFamily: "Varino", fontSize: "14px" }}>
      Gallery
    </h1>
    <h1 onClick={goToContact} className="glow-hover" style={{ fontFamily: "Varino", fontSize: "14px" }}>
      Contact
    </h1>
    
<div style={{ display: "flex", alignItems: "center" }}>
  {user ? (
 <button className="button" onClick={handleLogout}>
              Log Out
            </button>  ) : (
    <button className="button">Log In</button>
  )}
</div> 
 </div>
</div>
  </header>
}
export default Head;
