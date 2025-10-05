import React from "react"; // Import React library for JSX
import SignupForm from "../components/SignupForm"; // Import the reusable SignupForm component

// Define the SignupProvider page component
function SignupProvider() {
  return (
    // Main page wrapper for layout centering
    <div className="page-wrapper">
      {/* Container for the form, styled as a page */}
      <div className="container form-page">
        {/* Render the SignupForm component, passing role="Provider" to customize the form for providers */}
        <SignupForm role="Provider" />
      </div>
    </div>
  );
}

// Export the SignupProvider component for use in routing
export default SignupProvider;