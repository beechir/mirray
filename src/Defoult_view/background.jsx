import bgImage from "../assets/background.png";
import { motion } from "framer-motion";

function Background({ bgColor = "#080911" }) {
  return (
    <motion.div
      style={{
        backgroundColor: bgColor,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1, // Ensures the background is behind other content
        pointerEvents: "none",
        userSelect: "none",
      }}
      animate={{
        backgroundPosition: ["center", "center 10%", "center"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    ></motion.div>
  );
}

export default Background;
