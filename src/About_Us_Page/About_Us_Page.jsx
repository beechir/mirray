import { useCallback, useEffect, useState } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import about_us1 from "../assets/about_us1.jpg";
import about_us2 from "../assets/about_us2.jpg";
import about_us3 from "../assets/about_us3.jpeg";
import about_us4 from "../assets/about_us4.jpeg";
import next_icon from "../assets/next_icon.png";
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
        <div className="about-content">
          <img
            src={ABOUT_IMAGES[currentIndex]}
            alt="About Miray"
            className="about-image"
            style={{
              opacity: isFading ? 0 : 1,
              transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            }}
          />

          <div className="about-copy">
            <div
              className="about_us_div about-message"
              style={{
                opacity: isFading ? 0 : 1,
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
              }}
            >
              <h4>{ABOUT_MESSAGES[currentIndex]}</h4>
            </div>

            <button
              className="about-next"
              type="button"
              aria-label="Next about slide"
              onClick={handleNextClick}
            >
              <img src={next_icon} alt="" />
            </button>
          </div>
        </div>
      </section>
    </Default_view>
  );
}

export default About_Us_Page;
