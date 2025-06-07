import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";

function Gallery_Page() {
  useEffect(() => {
    document.title = "Gallery | Miray"; // 👈 Set tab title here
  }, []);
  return (
    <>
      <Default_view />
    </>
  );
}
export default Gallery_Page;
