import React from "react";
import { Link } from "react-router-dom";

function FooterSmall() {
  return (
    <div className="footer-small">
      <span>ALREADY HAVE AN ACCOUNT? </span>
      <Link to="/login">LOG IN</Link>
    </div>
  );
}

export default FooterSmall;
