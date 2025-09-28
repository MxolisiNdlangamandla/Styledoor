import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupForm({ role = "Client" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  function change(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    // placeholder: log the data. Later you send this to a backend.
    console.log(`Sign up (${role})`, form);
    // After successful signup you might navigate to login
    navigate("/login");
  }

  return (
    <>
      <div className="card-top">
        <Link to="/" className="back-link">←</Link>
        <div className="top-text">
          <div className="small-brand">Welcome to WAASHA</div>
          <div className="small-slogan">The Future Of Service, Today</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Sign Up</h2>

        <form onSubmit={submit} className="form">
          <label>First Name</label>
          <input name="firstName" value={form.firstName} onChange={change} placeholder="Enter first name..." required />

          <label>Last Name</label>
          <input name="lastName" value={form.lastName} onChange={change} placeholder="Enter last name..." required />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={change} placeholder="Enter email..." required />

          <label>Phone Number</label>
          <input name="phone" value={form.phone} onChange={change} placeholder="Enter phone number..." required />

          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={change} placeholder="Enter password..." required />

          <button type="submit" className="btn submit">SIGN UP</button>
        </form>

        <div className="card-footer">
          <span>Already have an account? </span>
          <Link to="/login">LOG IN</Link>
        </div>
      </div>
    </>
  );
}

export default SignupForm;
