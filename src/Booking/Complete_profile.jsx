import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Complete_profile({ onToggle }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    job: "",
    adress: "",
    phone_number: "",
    birth_date: "",
    email : "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

async function handleSubmit(e) {
  e.preventDefault();
  try {
    // Get logged in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("No user found");

    // Insert new profile
    const { error } = await supabase.from("profiles").insert({
      id: user.id, // keep it equal to auth user id
      email: user.email, // comes from auth.users
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_name: formData.user_name,
      job: formData.job,
      adress: formData.adress,
      phone_number: formData.phone_number,
      birth_date: formData.birth_date,
    });

    if (error) throw error;

    // Redirect after success
    navigate("/Booking_connected", {
      state: { name: formData.first_name },
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
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        paddingLeft: "100px",
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
          justifyContent: "space-between",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">First Name:</label>
            <input className="textfields" type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Last Name:</label>
            <input className="textfields" type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Username:</label>
            <input className="textfields" type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Job:</label>
            <input className="textfields" type="text" name="job" value={formData.job} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Address:</label>
            <input className="textfields" type="text" name="adress" value={formData.adress} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <label className="montserratText">Phone Number:</label>
            <input className="textfields" type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
            <label className="montserratText">Birth Date:</label>
            <input className="textfields" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="body_button" type="submit">Save Profile</button>
          </div>
        </form>

        {onToggle && (
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
              Already have an account? Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Complete_profile;
