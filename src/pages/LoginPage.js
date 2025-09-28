import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // For now just log and navigate to home. Later you will call your backend here.
    console.log("Login submitted", form);
    navigate("/"); // after login, go to landing (placeholder behavior)
  }

  return (
    <div className="page-wrapper">
      <div className="container form-page">
        <div className="card-top">
          <Link to="/" className="back-link">←</Link>
          <div className="top-text">
            <div className="small-brand">Welcome to WAASHA</div>
            <div className="small-slogan">The Future Of Service, Today</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Log In</h2>

          <form onSubmit={handleSubmit} className="form">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter email..."
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password..."
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="btn submit" type="submit">LOG IN</button>
          </form>

          <div className="card-footer">
            <a href="#forgot">FORGOT PASSWORD?</a>
            <Link to="/signup-client">SIGNUP</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
