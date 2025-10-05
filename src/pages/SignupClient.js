import React from "react"; // Import React for JSX rendering
import SignupForm from "../components/SignupForm"; // Import the reusable SignupForm component

// Define the SignupClient page component
function SignupClient() {
  return (
    // Main page wrapper for layout centering
    <div className="page-wrapper">
      {/* Container for the form, styled as a page */}
      <div className="container form-page">
        {/* Render the SignupForm component, passing role="Client" to customize the form for clients */}
        <SignupForm role="Client" />
      </div>
    </div>
  );
}

// Export the SignupClient component for use in routing
export default SignupClient;