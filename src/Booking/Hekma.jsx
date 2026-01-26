import { useState, useEffect } from "react";
import hekma1 from "../assets/hekma1.png";
import hekma2 from "../assets/hekma2.png";
import hekma3 from "../assets/hekma3.png";
import hekma4 from "../assets/hekma4.png";

const TRANSITION_DURATION = 2000; // fade
const CYCLE_DURATION = 10000; //between transitions

function Hekma() {
  const images = [hekma1, hekma2, hekma3, hekma4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const startCycle = () => {
    setIsFading(true);

    window.fadeTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsFading(false);

      window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);
    }, TRANSITION_DURATION);
  };

  useEffect(() => {
    // Start first cycle after initial visible time
    window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);

    // Cleanup on unmount
    return () => {
      if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
      if (window.cycleTimeout) clearTimeout(window.cycleTimeout);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "40vw",
        height: "80vh",
        overflow: "hidden",
        zIndex: 0,
        userSelect: "none",
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`hekma${currentIndex + 1}`}
        style={{
          position: "absolute",
          top: "10%",
          left: "30%",
          transform: "translateX(-50%)",
          width: "70vw",
          height: "auto",
          pointerEvents: "none",
          userSelect: "none",
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
          opacity: isFading ? 0 : 1,

        }}
      />
    </div>
  );
}

export default Hekma;
