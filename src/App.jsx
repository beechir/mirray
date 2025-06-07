import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactUsPage from "./Contact_Us_Page/ContactUsPage.jsx";
import About_Us_Page from "./About_Us_Page/About_Us_Page.jsx";
import Gallery_Page from "./Gallery_page/Gallery_Page.jsx";

import HomePage from "./Home_page/HomePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About_Us_Page />} />
        <Route path="/gallery" element={<Gallery_Page />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
