import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Sign_in_form({ onToggle }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1️⃣ Try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Invalid credentials or user not found");

      // 2️⃣ Redirect after login
      navigate("/Booking_connected", {
        state: { name: user.user_metadata?.first_name || "User" },
      });
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
            paddingLeft: "100px"

      }}
    >
      <div
        style={{
          width: "400px",
          height: "600px",
          border: "2px solid gold",
          borderRadius: "12px",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex", justifyContent: "space-between", marginBottom: "15px"
            }}
          >
            <label className="montserratText">Email:</label>
            <input  className="textfields"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                border: "none",
                borderBottom: "2px solid #ccc",
                outline: "none",
                fontSize: "14px",
                transition: "border-color 0.3s ease",
                backgroundColor: "transparent",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "200",
                fontSize: "12px"
              }}
            />
          </div>

          <div
            style={{
              display: "flex", justifyContent: "space-between", marginBottom: "50px"
            }}
          >
            <label className="montserratText">Password:</label>
            <input  className="textfields"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                border: "none",
                borderBottom: "2px solid #ccc",
                outline: "none",
                fontSize: "14px",
                transition: "border-color 0.3s ease",
                backgroundColor: "transparent",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "200",
                fontSize: "12px"
              }}
            />
          </div>
           <div style={{textAlign: "center" }}>
             <button className="body_button" type="submit">Sign In</button>
 
           </div>
        </form>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={onToggle}
            style={{
              background: "none",
              border: "none",
              color: "gold",
              cursor: "pointer",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sign_in_form;
