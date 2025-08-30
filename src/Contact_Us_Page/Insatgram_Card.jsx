import youtube from "../assets/youtube.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";

function InstagramCard() {
  return (
    /* Cards*/
    <div className="card-wrapper">

      {/*Instagram Card*/}
      <div className="card">
        <h2 >Instagram Page</h2>
        <img
          style={{
            width: "8vw",
            borderRadius: "20%",
           filter: "invert(100%)",

          }}
          src={instagram}
          alt="instagram"
        />

        <p>Follow the latest news of Mirray production</p>
      </div>

      {/*Youtube Card*/}
      <div className="card">
        <h2>Youtube Channel</h2>
        <img
          style={{
            width: "6vw",
            borderRadius: "20%",
            filter : "invert(100%)"
          }}
          src={youtube}
          alt="Youtube"
        />

        <p>Follow the latest news of Mirray production</p>
      </div>

      {/*Facebook Page*/}
      <div className="card">
        <h2>Facebook Page</h2>
        <img
          style={{
            width: "8vw",
            borderRadius: "20%",
                            filter: "invert(100%)",

          }}
          src={facebook}
          alt="facebook"
        />

        <p>Follow the latest news of Mirray production</p>
      </div>

    </div>
  );
}
export default InstagramCard;
