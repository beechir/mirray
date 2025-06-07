import twopac from "../assets/2pac.png";
import logo from "../assets/logo.png";
function Body() {
  return (
   <div
  style={{
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    zIndex: 0,
    userSelect: "none",
  }}
>
  {/* 2Pac image */}
  <img
    src={twopac}
    alt="2Pac"
    style={{
      position: "absolute",
      bottom: "0",
      right: "0",
      width: "100vw", 
      height: "auto",
      pointerEvents: "none",
      zIndex: -1,
      userSelect: "none",
    }}
  />

  {/* mirray Logo*/}
  <img
    src={logo}
    alt="Logo"
    style={{
      position: "absolute",
      top: "35vh",     
      left: "10vw", 
      width: "30vw", 
      height: "auto",
      pointerEvents: "none",
      zIndex: -1,
      userSelect: "none",
    }}
  />
  {/*<h1
  style={{
    position: "absolute",
      top: "60vh",       // 30% from the top
      left: "10vw",  
      fontSize: "70px",    // responsive size

  }}
  >welcome</h1> */
}
</div>

  );
}

export default Body;
