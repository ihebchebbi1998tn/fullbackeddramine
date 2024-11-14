import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Check if the error matches the specific error message we want to handle
    const targetError = "Cannot read properties of null (reading 'id')";
    if (error.message.includes(targetError)) {
      // Log the error and set state to initiate redirect
      console.error("Caught target error:", error, errorInfo);
      this.setState({ hasError: true, errorMessage: error.message });
    } else {
      // Handle other errors as needed or simply log them
      console.error("Caught an error:", error, errorInfo);
    }
  }

  componentDidUpdate() {
    // Redirect on specific error
    if (this.state.hasError) {
      window.location.href = "https://plateform.draminesaid.com";
    }
  }

  render() {
    if (this.state.hasError) {
      // Optionally show a custom fallback UI or nothing before redirection
      return null; // or <h1>Redirecting due to error...</h1>
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
