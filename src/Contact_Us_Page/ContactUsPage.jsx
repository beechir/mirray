import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import InstagramCard from "./Insatgram_Card.jsx";
import { motion } from "framer-motion";
import "./ContactUsPage.css";

function ContactUsPage() {
  useEffect(() => {
    document.title = "Contact Us | Miray";
  }, []);

  return (
    <Default_view>
      <section className="contact-page">
        <div className="contact-content">
          <motion.div
            className="contact-copy"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p
              className="contact-kicker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Miray Production
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              تواصل معنا
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              تابع جديد اعمالنا، شاهد كواليس التصوير، وتواصل معنا عبر المنصة
              الاقرب لك.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InstagramCard />
          </motion.div>
        </div>
      </section>
    </Default_view>
  );
}

export default ContactUsPage;
