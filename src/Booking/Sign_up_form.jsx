import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Booking.css";

function Sign_up_form({ onToggle }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/complete-profile`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("No user returned from signUp");

      await supabase.auth.signOut();
      navigate("/confirm-email", { state: { email: formData.email } });
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

          <motion.div
            className="sign-form-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="montserratText">Confirm Password:</label>
            <input
              className="textfields"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
            />
          </motion.div>

          <motion.button
            className="body_button sign-submit"
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </motion.form>
        <motion.div
          className="sign-toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Already have an account? Sign In
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Sign_up_form;
