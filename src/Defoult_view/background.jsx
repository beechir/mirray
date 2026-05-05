import bgImage from "../assets/background.png";

function Background({ bgColor = "#080911" }) {
  return (
    <div
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
        transition: "background-color 5s ease-in-out",
      }}
    ></div>
  );
}

export default Background;
