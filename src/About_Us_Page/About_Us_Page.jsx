import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";

function About_Us_Page() {
    useEffect(() => {
        document.title = "About Us | Miray";
    }, []);
    return (
        <>
            <Default_view />
        </>
    );
}
export default About_Us_Page;