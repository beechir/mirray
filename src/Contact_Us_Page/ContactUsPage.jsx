import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import "./Insatgram_Card.jsx"
import InstagramCard from "./Insatgram_Card.jsx";

function ContactUsPage() {
  useEffect(() => {
    document.title = "Contact Us | Miray"; // 👈 Set tab title here
  }, []);
  return (
    <>
      <Default_view />
      <InstagramCard/>
    </>
  );
}
export default ContactUsPage;
