import bgImage from "../assets/background.jpg";

function Background() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
         position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1, // Ensures the background is behind other content
        pointerEvents: "none",
        userSelect: "none",


      }}
    ></div>
  );
}

export default Background;
