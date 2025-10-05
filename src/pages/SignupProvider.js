import React from "react"; // Import React for JSX rendering
import SignupFormProvider from "../components/ProviderSignupForm"; // Import the Provider signup form component

// Define the SignupProvider page component
function SignupProvider() {
  return (
    // Main page wrapper for layout centering
    <div className="page-wrapper">
      {/* Container for the form, styled as a page */}
      <div className="container form-page">
        {/* Render the SignupFormProvider component */}
        <SignupFormProvider />
      </div>
    </div>
  );
}

// Export the SignupProvider component for use in routing
export default SignupProvider;