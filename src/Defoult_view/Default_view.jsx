import Background from "./background.jsx";
import Footer from "./FooterComponent.jsx";
import Head from "./Head.jsx";
function Default_view({ children, bgColor }) {
  return (
    <>
    <> 
      <Background bgColor={bgColor} />
      <main>{children}</main>
       </>
      <Footer />
      <Head />
    </>
  );
}
export default Default_view;