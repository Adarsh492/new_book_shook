import React, { useState } from "react";
import "./screen.css";
import Loader from "../components/Loader";
import Error from "../components/Error";
import axios from "axios";

const Loginscreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function login() {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const user = { email, password };

    try {
      setLoading(true);
      const result = (
        await axios.post("https://bookshook-backend.onrender.com/api/users/login", user)
      ).data;
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error message="Invalid Credentials" />}
          <div className="bs">
            <h1 id="h_one">Login</h1>
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
            <div className="button">
              <button className="btn btn-primary mt-3" onClick={login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginscreen;
