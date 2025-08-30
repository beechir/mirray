import { useEffect } from "react";
import Default_view from "../Defoult_view/Default_view.jsx";
import Booking_not_connected from "../Booking/Booking_not_connected.jsx";
import Booking_connected from "../Booking/Booking_connected.jsx";
import useAuth from "../hooks/useAuth"; 

function Booking() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = "Book Ur Session | Miray";
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Default_view />
      <div>
        {user ? <Booking_connected /> : <Booking_not_connected />}
      </div>
    </>
  );
}

export default Booking;
