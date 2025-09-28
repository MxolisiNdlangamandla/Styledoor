import React from "react";
import SignupForm from "../components/SignupForm";

function SignupProvider() {
  return (
    <div className="page-wrapper">
      <div className="container form-page">
        <SignupForm role="Provider" />
      </div>
    </div>
  );
}

export default SignupProvider;
