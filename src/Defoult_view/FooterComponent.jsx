import insta_icon from "../assets/insta_icon.png";
import facebook_icon from "../assets/facebook_icon.png";
import youtube_icon from "../assets/youtube_icon.png";

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        color: "white",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      <a5 style={{ fontSize: "13px" }}>
        &copy; {new Date().getFullYear()} ميراي برودكشن . جميع الحقوق محفوظة.
      </a5>
      <div style={{ marginTop: "10px" }}>
        <a
          href="https://www.instagram.com/miray.production?igsh=MTdjOHVoMnBkMWdvcw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={insta_icon}
            alt="Instagram"
            style={{ width: "15px", margin: "0 10px", filter: "invert(100%)" }}
          />
        </a>
        <a
          href="https://www.facebook.com/share/1GQoemCrNK/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={facebook_icon}
            alt="Facebook"
            style={{ width: "15px", margin: "0 10px", filter: "invert(100%)" }}
          />
        </a>
        <a
          href="https://www.youtube.com/@miray.production"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={youtube_icon}
            alt="YouTube"
            style={{ width: "19px", margin: "0 10px", filter: "invert(100%)" }}
          />
        </a>
      </div>
    </footer>
  );
}
export default Footer;
