import youtube from "../assets/youtube.jpg";
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
          }}
          src={instagram}
          alt="Youtube"
        />

        <p>Follow the latest news of Mirray production</p>
      </div>

      {/*Youtube Card*/}
      <div className="card">
        <h2>Youtube Channel</h2>
        <img
          style={{
            width: "8vw",
            borderRadius: "20%",
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
          }}
          src={facebook}
          alt="Youtube"
        />

        <p>Follow the latest news of Mirray production</p>
      </div>

    </div>
  );
}
export default InstagramCard;
