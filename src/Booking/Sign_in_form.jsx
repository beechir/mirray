import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

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
    <div className="sign-form-wrapper">
      <div className="sign-form-box">
        <form className="sign-form" onSubmit={handleSubmit}>
          <div className="sign-form-row">
            <label className="montserratText">Email:</label>
            <input  className="textfields"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="sign-form-row">
            <label className="montserratText">Password:</label>
            <input  className="textfields"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="body_button sign-submit" type="submit">Sign In</button>
        </form>
        <div className="sign-toggle">
          <button
            onClick={onToggle}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sign_in_form;
