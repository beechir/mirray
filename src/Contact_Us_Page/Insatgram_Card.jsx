import youtube from "../assets/youtube.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";

const socialLinks = [
  {
    title: "Instagram",
    text: "احدث الصور والكواليس اليومية من Miray Production.",
    image: instagram,
    url: "https://www.instagram.com/miray.production?igsh=MTdjOHVoMnBkMWdvcw%3D%3D",
  },
  {
    title: "YouTube",
    text: "شاهد الاعمال، المقاطع، ومحتوى الفيديو الكامل.",
    image: youtube,
    url: "https://www.youtube.com/@miray.production",
  },
  {
    title: "Facebook",
    text: "تابع الاخبار والاعلانات وتواصل معنا مباشرة.",
    image: facebook,
    url: "https://www.facebook.com/share/1GQoemCrNK/",
  },
];

function InstagramCard() {
  return (
    <div className="contact-social-grid">
      {socialLinks.map((link) => (
        <a
          className="contact-card"
          href={link.url}
          key={link.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-card-icon">
            <img src={link.image} alt={link.title} />
          </span>
          <span className="contact-card-content">
            <span className="contact-card-title">{link.title}</span>
            <span className="contact-card-text">{link.text}</span>
          </span>
          <span className="contact-card-action">زيارة</span>
        </a>
      ))}
    </div>
  );
}

export default InstagramCard;
