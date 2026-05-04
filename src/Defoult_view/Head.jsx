import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; 
import { supabase } from "../supabaseClient";
import "./Head.css";


function Head() {
    const navigate = useNavigate();

    const { user, loading } = useAuth();


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
    const goToLogin = () => {
      navigate("/Booking_not_connected");
    };


     const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); 
  };

  

  return <header className="head-header">   
   <div className="head-container">
  
  {/*Home */}
  <h1 onClick={goToHome}
    className="glow-hover head-home"
  >
    الرئيسية
  </h1>

  {/*About, Gallery, Contact */}
  <div className="head-right-section">
    <h1 onClick={goToBooking} className="glow-hover head-link">
      احجز جلستك
    </h1>
    <h1 onClick={goToAbout} className="glow-hover head-link">
      من نحن
    </h1>
    <h1 onClick={goToGallery}  className="glow-hover head-link">
      المعرض
    </h1>
    <h1 onClick={goToContact} className="glow-hover head-link">
      تواصل معنا
    </h1>
    
    <div className="head-auth">
      {user ? (
        <button className="button" onClick={handleLogout}>
          تسجيل الخروج
        </button>  
      ) : (
        <button className="button" onClick={goToBooking}>
          تسجيل الدخول
          </button>
      )}
    </div> 
  </div>
</div>
  </header>
}
export default Head;
