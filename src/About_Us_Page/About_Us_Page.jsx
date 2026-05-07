import { useCallback, useEffect, useState } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import about_us1 from "../assets/about_us1.jpg";
import about_us2 from "../assets/about_us2.jpg";
import about_us3 from "../assets/about_us3.jpeg";
import about_us4 from "../assets/about_us4.jpeg";
import next_icon from "../assets/next_icon.png";
import { motion } from "framer-motion";
import "./About_Us_Page.css";

const TRANSITION_DURATION = 1000;
const CYCLE_DURATION = 15000;
const ABOUT_IMAGES = [about_us1, about_us2, about_us3, about_us4];
const BACKGROUND_COLORS = ["#561415", "#697c83", "#cfb85d", "#d04f24"];
const ABOUT_MESSAGES = [
  "ميراي هي مؤسسة رائدة في الإنتاج السمعي البصري.",
  "نحن متخصصون في ابتكار تجارب بصرية آسرة تروي قصتكم بكل تفاصيلها.",
  "فريقنا من الخبراء يحول رؤيتكم إلى واقع ملموس بشغف ودقة متناهية.",
  "انضموا إلينا لنصنع معا الجيل القادم من محتوى الترفيه.",
];

function About_Us_Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const startCycle = useCallback(() => {
    setIsFading(true);

    window.fadeTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ABOUT_IMAGES.length);
      setIsFading(false);
      window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);
    }, TRANSITION_DURATION);
  }, []);

  const handleNextClick = () => {
    if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
    if (window.cycleTimeout) clearTimeout(window.cycleTimeout);
    startCycle();
  };

  useEffect(() => {
    document.title = "About Us | Miray";
    window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);

    return () => {
      if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
      if (window.cycleTimeout) clearTimeout(window.cycleTimeout);
    };
  }, [startCycle]);

  return (
    <Default_view bgColor={BACKGROUND_COLORS[currentIndex]}>
      <section className="about-page">
        <motion.div
          className="about-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src={ABOUT_IMAGES[currentIndex]}
            alt="About Miray"
            className="about-image"
            style={{
              opacity: isFading ? 0 : 1,
              transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            }}
            initial={{ scale: 0.8, opacity: 0, rotate: -10, y: 30 }}
            animate={{
              scale: isFading ? 1.1 : 1,
              opacity: isFading ? 0 : 1,
              rotate: 0,
              y: 0,
              filter: isFading ? "blur(5px)" : "blur(0px)"
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.8
            }}
            key={currentIndex} // Force re-render for animation
            whileHover={{
              scale: 1.05,
              rotate: 2,
              boxShadow: "0 30px 60px rgba(218, 185, 1, 0.3)"
            }}
          />

          <div className="about-copy">
            <motion.div
              className="about_us_div about-message"
              style={{
                opacity: isFading ? 0 : 1,
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: isFading ? 0 : 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              key={`message-${currentIndex}`}
            >
              <h4>{ABOUT_MESSAGES[currentIndex]}</h4>
            </motion.div>

            <motion.button
              className="about-next"
              type="button"
              aria-label="Next about slide"
              onClick={handleNextClick}
              whileHover={{
                scale: 1.15,
                rotate: 15,
                boxShadow: "0 20px 40px rgba(218, 185, 1, 0.6)"
              }}
              whileTap={{ scale: 0.85, rotate: -5 }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.4
              }}
            >
              <motion.img
                src={next_icon}
                alt=""
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </Default_view>
  );
}

export default About_Us_Page;
