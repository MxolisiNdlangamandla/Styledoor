import React from "react";
import SignupForm from "../components/SignupForm";

function SignupClient() {
  return (
    <div className="page-wrapper">
      <div className="container form-page">
        <SignupForm role="Client" />
      </div>
    </div>
  );
}

export default SignupClient;
