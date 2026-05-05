import insta_icon from "../assets/insta_icon.png";
import facebook_icon from "../assets/facebook_icon.png";
import youtube_icon from "../assets/youtube_icon.png";
import "./FooterComponent.css";

function Footer() {
  return (
    <footer className="site-footer">
      <small>
        &copy; {new Date().getFullYear()} ميراي برودكشن . جميع الحقوق محفوظة.
      </small>
      <div className="site-footer-links">
        <a
          href="https://www.instagram.com/miray.production?igsh=MTdjOHVoMnBkMWdvcw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={insta_icon}
            alt="Instagram"
            className="site-footer-instagram"
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
            className="site-footer-facebook"
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
            className="site-footer-youtube"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
