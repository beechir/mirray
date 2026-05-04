import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import InstagramCard from "./Insatgram_Card.jsx";
import "./ContactUsPage.css";

function ContactUsPage() {
  useEffect(() => {
    document.title = "Contact Us | Miray";
  }, []);

  return (
    <Default_view>
      <section className="contact-page">
        <div className="contact-content">
          <div className="contact-copy">
            <p className="contact-kicker">Miray Production</p>
            <h1>تواصل معنا</h1>
            <p>
              تابع جديد اعمالنا، شاهد كواليس التصوير، وتواصل معنا عبر المنصة
              الاقرب لك.
            </p>
          </div>

          <InstagramCard />
        </div>
      </section>
    </Default_view>
  );
}

export default ContactUsPage;
