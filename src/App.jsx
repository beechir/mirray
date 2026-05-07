import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ContactUsPage from "./Contact_Us_Page/ContactUsPage.jsx";
import About_Us_Page from "./About_Us_Page/About_Us_Page.jsx";
import Gallery_Page from "./Gallery_page/Gallery_Page.jsx";
import Booking from "./Booking/Booking.jsx";
import HomePage from "./Home_page/HomePage.jsx";
import Booking_not_connected from "./Booking/Booking_not_connected.jsx";
import Booking_connected from "./Booking/Booking_connected.jsx";
import Complete_profile from "./Booking/Complete_profile.jsx";
import CompleteProfile from "./Profile/complete_profile.jsx";
import BackOffice from "./Back_Office/BackOffice.jsx";
import ConfirmEmail from "./Booking/Confirm_email.jsx";

function PageRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 240);
      return () => clearTimeout(timeout);
    }
  }, [transitionStage, location]);

  return (
    <div className={`page-transition ${transitionStage}`}>
      <Routes location={displayLocation} key={displayLocation.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About_Us_Page />} />
        <Route path="/gallery" element={<Gallery_Page />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Booking_connected" element={<Booking_connected />} />
        <Route
          path="/Booking_not_connected"
          element={<Booking_not_connected />}
        />
        <Route path="/Complete_profile" element={<Complete_profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/back-office" element={<BackOffice />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  );
}

export default App;
