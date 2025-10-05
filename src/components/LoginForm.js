import React, { useState } from "react";

// LoginForm component receives an onLogin callback prop
function LoginForm({ onLogin }) {
  // State for email input
  const [email, setEmail] = useState("");
  // State for password input
  const [password, setPassword] = useState("");
  // State for error messages
  const [error, setError] = useState("");

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form reload
    setError(""); // Clears previous error
    try {
      // Sends POST request to backend login endpoint
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sends email and password_hash in request body
        body: JSON.stringify({ email, password_hash: password })
      });
      const data = await res.json(); // Parses response as JSON
      if (data.success) {
        // If login is successful, call onLogin with user data
        onLogin(data.user);
      } else {
        // If login fails, show error message
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      // Handles network or server errors
      setError("Login failed. Please try again.");
    }
  };

  // Renders the login form
  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)} // Updates email state
        required
        placeholder="Enter your email"
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)} // Updates password state
        required
        placeholder="Enter your password"
      />
      {/* Shows error message if present */}
      {error && <div className="lead" style={{ color: "red" }}>{error}</div>}
      <button className="btn primary" type="submit">Login</button>
    </form>
  );
}

export default LoginForm;