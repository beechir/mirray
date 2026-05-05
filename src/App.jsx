import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactUsPage from "./Contact_Us_Page/ContactUsPage.jsx";
import About_Us_Page from "./About_Us_Page/About_Us_Page.jsx";
import Gallery_Page from "./Gallery_page/Gallery_Page.jsx";
import Booking from "./Booking/Booking.jsx"
import HomePage from "./Home_page/HomePage.jsx";
import Booking_not_connected from "./Booking/Booking_not_connected.jsx";
import Booking_connected from "./Booking/Booking_connected.jsx";
import Complete_profile from "./Booking/Complete_profile.jsx";
import CompleteProfile from "./Profile/complete_profile.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About_Us_Page />} />
        <Route path="/gallery" element={<Gallery_Page />} />
       <Route path="/Booking" element={<Booking/>}/>
        <Route path="/Booking_connected" element={<Booking_connected/>}/>
        <Route path="/Booking_not_connected" element={<Booking_not_connected/>}/>
        <Route path="/Complete_profile" element={<Complete_profile/>}/>
        <Route path="/complete-profile" element={<CompleteProfile/>}/>



        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
