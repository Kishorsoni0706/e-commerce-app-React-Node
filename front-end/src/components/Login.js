import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');  // Redirect to home if the user is already logged in
    }
  }, [navigate]);

  // State for handling error messages
  const [error, setError] = useState("");

  // State for handling success message
  const [success, setSuccess] = useState("");

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Basic validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    // Clear previous errors and success messages
    setError("");
    setSuccess("");

    // Set loading to true while waiting for the API response
    setLoading(true);

    try {
      // Send a POST request to your login API
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data); // Log the full response data for debugging

      if (response.ok) {
        // Check for necessary properties in the API response
        if (data && data.user  && data.auth) {
          // Save user data (without password) and token
          localStorage.setItem('user', JSON.stringify(data.user)); 
          localStorage.setItem('token',JSON.stringify( data.auth)); // Save the JWT token as string directly
          
          // Handle successful login
          setSuccess("Login successful!");
          navigate("/"); // Redirect to homepage after successful login
        } else {
          setError("Invalid login response structure: Missing 'result' or 'auth'.");
        }
      } else {
        // Handle errors from the API, ensure proper response message
        const errorMessage = data.message || "Invalid credentials. Please try again.";
        setError(errorMessage);
      }
      
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    } finally {
      // Set loading to false after API call finishes
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={loading} // Disable the input when loading
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={loading} // Disable the input when loading
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
