import { useEffect, useState } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import about_us1 from "../assets/about_us1.jpg";
import about_us2 from "../assets/about_us2.jpg";
import about_us3 from "../assets/about_us3.jpeg";
import about_us4 from "../assets/about_us4.jpeg";
import next_icon from "../assets/next_icon.png";

// Timing constants (in milliseconds)
const TRANSITION_DURATION = 1000; // 5 seconds for fade transition
const CYCLE_DURATION = 15000; // 15 seconds between transitions

function About_Us_Page() {
  const images = [about_us1, about_us2, about_us3, about_us4];
  const backgroundColors = ["#561415", "#697c83", "#cfb85d", "#d04f24"];
  const messages = [
    "ميراي هي مؤسسة رائدة في الإنتاج السمعي البصري .",
    "نحن متخصصون في ابتكار تجارب بصرية آسرة تروي قصتكم بكل تفاصيلها.",
    "فريقنا من الخبراء يحول رؤيتكم إلى واقع ملموس بشغف ودقة متناهية.",
    "انضموا إلينا لنصنع معاً الجيل القادم من محتوى الترفي",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleNextClick = () => {
    // Clear any existing timeouts
    if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
    if (window.cycleTimeout) clearTimeout(window.cycleTimeout);

    // Start the transition
    setIsFading(true);

    // After transition duration, switch image and fade-in
    window.fadeTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsFading(false);

      // Schedule next cycle after full visible duration
      window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);
    }, TRANSITION_DURATION);
  };

  const startCycle = () => {
    // Start fade-out
    setIsFading(true);

    // After transition duration, switch image and fade-in
    window.fadeTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsFading(false);

      // Schedule next cycle after full visible duration
      window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);
    }, TRANSITION_DURATION);
  };

  useEffect(() => {
    document.title = "About Us | Miray";

    // First image is visible for cycle duration before any fade starts
    window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);

    // Cleanup on unmount
    return () => {
      if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
      if (window.cycleTimeout) clearTimeout(window.cycleTimeout);
    };
  }, []);

  return (
    <>
      <Default_view bgColor={backgroundColors[currentIndex]} />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100vh",
          padding: "0px 100px",
          gap: "50px",
        }}
      >
        <img
          src={images[currentIndex]}
          alt="About Us"
          style={{
            marginRight: "40px",
            maxHeight: "45vh",
            height: "auto",
            maxWidth: "100%",
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
            opacity: isFading ? 0 : 1,
          }}
        />

        <div>
          <div
            className="about_us_div"
            style={{
              color: "white",
              maxWidth: "40%",
              transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
              opacity: isFading ? 0 : 1,
            }}
          >
            <h4 style={{ fontFamily: "NotoKufiLocal" }}>
              {messages[currentIndex]}
            </h4>
          </div>
          <div
            onClick={handleNextClick}
            style={{
              cursor: "pointer",
              transition: "transform 0.3s ease",
              ":hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <img
              style={{
                width: "60px",
                transition: "transform 0.3s ease",
                filter: "invert(100%)",
              }}
              src={next_icon}
              alt="Next"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default About_Us_Page;
