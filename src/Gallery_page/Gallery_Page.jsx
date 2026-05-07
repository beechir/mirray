import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Default_view>
      <section className="gallery-page">
        <motion.div
          className="gallery-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="gallery-heading" variants={itemVariants}>
            <p>Miray Production</p>
            <h1>المعرض</h1>
            <span>مختارات من اعمالنا، يمكنك مشاهدتها مباشرة هنا.</span>
          </motion.div>

          <motion.div
            className="gallery-video-grid"
            variants={containerVariants}
          >
            {videos.map((video, index) => (
              <motion.article
                className="gallery-video-card"
                key={video.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
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
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </Default_view>
  );
}

export default Gallery_Page;
