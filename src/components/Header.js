
import React from "react";
import logo from "../assets/Logo.png";

function Header() {
  return (
    <header className="brand-header">
      <img src={logo} alt="WAASHA Logo" className="brand-logo" width={150} height={150}/>
      <h1 className="brand-title">WAASHA</h1>
      <div className="brand-slogan">The Future Of Service, Today</div>
    </header>
  );
}

export default Header;
