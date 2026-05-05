import { useCallback, useEffect, useState } from "react";
import hekma1 from "../assets/hekma1.png";
import hekma2 from "../assets/hekma2.png";
import hekma3 from "../assets/hekma3.png";
import hekma4 from "../assets/hekma4.png";
import "./Booking.css";

const TRANSITION_DURATION = 2000; // fade
const CYCLE_DURATION = 10000; //between transitions
const HEKMA_IMAGES = [hekma1, hekma2, hekma3, hekma4];

function Hekma() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const startCycle = useCallback(() => {
    setIsFading(true);

    window.fadeTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % HEKMA_IMAGES.length);
      setIsFading(false);

      window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);
    }, TRANSITION_DURATION);
  }, []);

  useEffect(() => {
    // Start first cycle after initial visible time
    window.cycleTimeout = setTimeout(startCycle, CYCLE_DURATION);

    // Cleanup on unmount
    return () => {
      if (window.fadeTimeout) clearTimeout(window.fadeTimeout);
      if (window.cycleTimeout) clearTimeout(window.cycleTimeout);
    };
  }, [startCycle]);

  return (
    <div className="hekma-container">
      <img
        src={HEKMA_IMAGES[currentIndex]}
        alt={`hekma${currentIndex + 1}`}
        className="hekma-image"
        style={{
          opacity: isFading ? 0 : 1,
        }}
      />
    </div>
  );
}

export default Hekma;
