import hekma1 from "../assets/hekma1.png"



function Hekma(){


    return(
       <div
             style={{
               position: "relative",
               width: "80vw",
               height: "80vh",
               overflow: "hidden",
               zIndex: 0,
               userSelect: "none",
             }}
           >
             <img
  src={hekma1}
  alt="hekma1"
  style={{
    position: "absolute",
    top: "10%",              // <-- control vertical position here
    left: "30%",             // center horizontally
    transform: "translateX(-50%)", 
    width: "70vw",
    height: "auto",
    pointerEvents: "none",
    zIndex: -1,
    userSelect: "none",
  }}
/>
           
             
            
           </div>

    );

}

export default Hekma;