import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";


function Sign_up_form({ onToggle }) {
  const [formData, setFormData] = useState({
   /* first_name: "",*/
    /*last_name: "",*/
   /* user_name: "",*/
   /* job: "",*/
   /* adress: "",*/
   /* phone_number: "",*/
    email: "",
   /* birth_date: "",*/
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //Check password confirmation before hitting Supabase
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return; // stop here
    }

    try {
      // 1️⃣ Create account in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
         emailRedirectTo: "http://localhost:5173/Complete_profile"
  }
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("No user returned from signUp");

      // 2️⃣ (Optional) Insert extra profile data
      // await supabase.from("profiles").insert([
      //   {
      //     id: user.id,
      //     first_name: formData.first_name,
      //     last_name: formData.last_name,
      //     user_name: formData.user_name,
      //     job: formData.job,
      //     adress: formData.adress,
      //     phone_number: formData.phone_number,
      //     email: formData.email,
      //     birth_date: formData.birth_date,
      //   },
      // ]);

      // 3️⃣ Redirect (even if email needs confirmation)
      navigate("/Booking_connected", {
        state: { name: formData.first_name },
      });

    } catch (err) {
      console.error(err.message);
      alert("Error: " + err.message);
    }
  }

  return (
    <div style={{ display: "flex", 
    justifyContent: "flex-start", 
    alignItems: "center", 
    height: "100vh",
    paddingLeft: "100px"
    }}>
      <div style={{ width: "400px", 
      height: "600px",
      border: "2px solid gold", 
      borderRadius: "12px",
       padding: "20px", 
       overflowY: "auto",
       display: "flex",
       flexDirection: "column",
       justifyContent: "space-between"
}}>
        <form onSubmit={handleSubmit}>
         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" ,  }}>
            <label className="montserratText">First Name:</label>
            <input className="textfields" type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>*/}

         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Last Name:</label>
            <input className="textfields" type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>*/}

         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText" >Username:</label>
            <input className="textfields" type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
          </div>*/}

         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Job:</label>
            <input className="textfields" type="text" name="job" value={formData.job} onChange={handleChange} />
          </div>*/}

         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <label className="montserratText">Address:</label>
            <input className="textfields" type="text" name="adress" value={formData.adress} onChange={handleChange} />
          </div>*/}

          {/*<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <label className="montserratText">Phone Number:</label>
            <input className="textfields" type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>*/}

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <label className="montserratText">Email:</label>
            <input className="textfields" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <label className="montserratText">Password:</label>
            <input className="textfields" type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <label className="montserratText">Confirm Password:</label>
            <input className="textfields" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} />
          </div>

         {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "50px" }}>
            <label className="montserratText">Birth Date:</label>
            <input className="textfields" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
          </div>*/}
          <div style={{textAlign: "center"  }}>
                      <button  className="body_button" type="submit">Sign Up</button>

          </div>
        </form>
        <div style={{ textAlign: "center", marginTop: "20px" 
}}>
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
      </div>
    </div>
  );
}

export default Sign_up_form;
