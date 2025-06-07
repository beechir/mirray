import Background from "../Defoult_view/background.jsx";
import Footer from "../Defoult_view/FooterComponent.jsx";
import Head from "../Defoult_view/Head.jsx";
import Body from "./Body.jsx";
import { useEffect } from "react";

function HomePage() {
  useEffect(() => {
    document.title = "Home | Miray";
  }, []);
  return (
    <>
      <Background />
      <Footer />
      <Head />
      <Body />
    </>
  );
}
export default HomePage;
