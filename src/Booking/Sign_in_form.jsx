import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Invalid credentials or user not found");

      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        navigate("/confirm-email", { state: { email: formData.email } });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, phone_number")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        await supabase.auth.signOut();
        alert("This account is not active. Please contact Miray support.");
        return;
      }

      if (!profile?.phone_number?.trim()) {
        navigate("/complete-profile");
        return;
      }

      navigate("/");
    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  }

  return (
    <motion.div
      className="sign-form-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="sign-form-box">
        <motion.form
          className="sign-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="sign-form-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="montserratText">Email:</label>
            <input
              className="textfields"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div
            className="sign-form-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="montserratText">Password:</label>
            <input
              className="textfields"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </motion.div>

          <motion.button
            className="body_button sign-submit"
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </motion.form>
        <motion.div
          className="sign-toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Don't have an account? Sign Up
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Sign_in_form;
