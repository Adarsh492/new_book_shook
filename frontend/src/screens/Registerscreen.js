import React, { useState } from "react";
import "./screen.css";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import axios from "axios";

const Registerscreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function register() {
    if (!name || !email || !password || !cpassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== cpassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = { name, email, password };
    
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      setSuccess(false); // Reset success state

      await axios.post("https://bookshook-backend.onrender.com/api/users/register", user);

      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setCpassword("");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Registration failed. Try again.");
    }
  }

  return (
    <div>
      {loading && <Loader />}
      
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success && <Success message="Registration Successful" />}
          {error && <Error message={error} />}
          
          <div className="bs">
            <h1 id="h_one">Register</h1>
            
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />

            <div className="button">
              <button className="btn btn-primary mt-3" onClick={register}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerscreen;
