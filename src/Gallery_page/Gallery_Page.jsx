import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import "./Gallery_Page.css";

const videos = [
  {
    id: "k2Snk79_l0k",
    title: "Miray Production",
    description: "شاهد احد اعمالنا المختارة من Miray Production.",
  },
  {
    id: "EiHeASY6IDU",
    title: "Miray Production",
    description: "لقطة اخرى من اسلوبنا في التصوير والانتاج.",
  },
  {
    id: "P0OH0aLLQiw",
    title: "Miray Production",
    description: "عمل من معرض الفيديو الخاص بنا.",
  },
   {
    id: "XiqXzDZVDKM",
    title: "Miray Production",
    description: "عمل من معرض الفيديو الخاص بنا.",
  },
];

function Gallery_Page() {
  useEffect(() => {
    document.title = "Gallery | Miray";
  }, []);

  return (
    <Default_view>
      <section className="gallery-page">
        <div className="gallery-content">
          <div className="gallery-heading">
            <p>Miray Production</p>
            <h1>المعرض</h1>
            <span>مختارات من اعمالنا، يمكنك مشاهدتها مباشرة هنا.</span>
          </div>

          <div className="gallery-video-grid">
            {videos.map((video) => (
              <article className="gallery-video-card" key={video.id}>
                <div className="gallery-video-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="gallery-video-copy">
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Default_view>
  );
}

export default Gallery_Page;
