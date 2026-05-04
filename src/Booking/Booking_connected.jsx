import { useLocation, useNavigate } from "react-router-dom";
import useUserDisplayName from "../hooks/useUserDisplayName";

function Booking_connected() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationName = location.state?.name;
  const { user, name, loading } = useUserDisplayName(navigationName);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <h2>Please sign in first.</h2>;
  }

  if (!user.email_confirmed_at) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Please confirm your email</h1>
        <p>
          We sent a confirmation link to <b>{user.email}</b>. <br />
          Confirm your email before continuing.
        </p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome Back To Miray {name}!</h1>
      <p>
        Your email <b>{user.email}</b> has been confirmed
      </p>
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
