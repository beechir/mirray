const socialLinks = [
  {
    title: "Instagram",
    text: "احدث الصور والكواليس اليومية من Miray Production.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="3.1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="16.5" cy="7.5" r="0.9" fill="currentColor" />
        <path
          d="M8.5 7.5H15.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    url: "https://www.instagram.com/miray.production?igsh=MTdjOHVoMnBkMWdvcw%3D%3D",
  },
  {
    title: "YouTube",
    text: "شاهد الاعمال، المقاطع، ومحتوى الفيديو الكامل.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M10.5 8.75L15.5 12L10.5 15.25V8.75Z" fill="currentColor" />
      </svg>
    ),
    url: "https://www.youtube.com/@miray.production",
  },
  {
    title: "Facebook",
    text: "تابع الاخبار والاعلانات وتواصل معنا مباشرة.",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M14 7H12.5C11.67 7 11 7.67 11 8.5V10.25H9.5V12.75H11V17H13.5V12.75H15.25L15.75 10.25H13.5V8.75C13.5 8.61 13.61 8.5 13.75 8.5H15.75V7Z"
          fill="currentColor"
        />
      </svg>
    ),
    url: "https://www.facebook.com/share/1GQoemCrNK/",
  },
];

function InstagramCard() {
  return (
    <div className="contact-social-grid">
      {socialLinks.map((link) => {
        const Icon = link.Icon;
        return (
          <a
            className="contact-card"
            href={link.url}
            key={link.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-card-icon">
              <Icon />
            </span>
            <span className="contact-card-content">
              <span className="contact-card-title">{link.title}</span>
              <span className="contact-card-text">{link.text}</span>
            </span>
            <span className="contact-card-action">زيارة</span>
          </a>
        );
      })}
    </div>
  );
}

export default InstagramCard;
