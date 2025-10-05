import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import enhanced global reset and base styles first
import "./App.css"; // Import app-specific styles (components, layout, etc.)
import App from "./App";

// Error boundary component to catch JavaScript errors anywhere in the component tree
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI that matches your app's design
      return (
        <div className="app-root">
          <div className="container">
            <div className="brand-header">
              <div className="logo-circle">W</div>
              <div className="brand-title">Waasha</div>
              <div className="brand-slogan">Something went wrong</div>
            </div>
            <div className="card">
              <div className="card-title">Oops! Something went wrong</div>
              <p className="lead" style={{ color: 'var(--error)', textAlign: 'center' }}>
                We encountered an unexpected error. Please refresh the page to try again.
              </p>
              <button 
                className="btn primary" 
                onClick={() => window.location.reload()}
                style={{ width: '100%', marginTop: '16px' }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the app with error handling
function initializeApp() {
  try {
    // Get the root element
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error('Root element not found. Make sure you have a div with id="root" in your HTML.');
    }

    // Add accessibility attributes
    rootElement.setAttribute('role', 'application');
    rootElement.setAttribute('aria-label', 'Waasha Service Platform');

    // Create React root
    const root = ReactDOM.createRoot(rootElement);

    // Render the app with error boundary and accessibility improvements
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          {/* Skip to main content link for screen readers */}
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          <main id="main-content">
            <App />
          </main>
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log('🚀 Waasha app initialized successfully!');

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback: Show error message directly in the DOM
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: Inter, sans-serif;
          background: #f3f6fb;
          color: #0b2545;
          padding: 20px;
          text-align: center;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 14px;
            box-shadow: 0 10px 25px rgba(11, 32, 64, 0.08);
            max-width: 420px;
          ">
            <h1 style="margin-bottom: 16px; font-size: 22px; font-weight: 700;">Waasha</h1>
            <p style="margin-bottom: 20px; color: #6b7280; line-height: 1.5;">
              Sorry, we couldn't start the app. Please refresh the page to try again.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="
                background: linear-gradient(90deg, #2b6ef6, #3ea0ff);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 999px;
                font-weight: 700;
                cursor: pointer;
                font-size: 14px;
              "
            >
              Refresh Page
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Global error handlers for better debugging and user experience
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser error dialog
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Global JavaScript error:', event.error);
});

// Initialize the application
initializeApp();