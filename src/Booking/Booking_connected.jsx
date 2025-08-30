import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { supabase } from "../supabaseClient";

function Booking_connected() {
  const navigate = useNavigate(); // ✅ initialize navigate
  const location = useLocation();
  const { name } = location.state || { name: "Guest" };

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(data?.user || null);
    }
    getUser();
  }, []);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  // ⚠️ If email not confirmed
  if (!user.email_confirmed_at) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>⚠️ Please confirm your email</h1>
        <p>
          We sent a confirmation link to <b>{user.email}</b>. <br />
          Confirm your email before continuing.
        </p>
      </div>
    );
  }

  // 🎉 If email confirmed
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎉 Welcome {name}!</h1>
      <p>Your email <b>{user.email}</b> has been confirmed ✅</p>
      {/* ✅ Button works now */}
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Go Home
      </button>
    </div>
  );
}

export default Booking_connected;
