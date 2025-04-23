import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');  // Redirect to home if the user is logged in
    }
  }, [navigate]); // Empty dependency array ensures this runs once on component mount
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
    const { name, email, password } = formData;

    // Basic validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Clear previous errors and success messages
    setError("");
    setSuccess("");

    // Set loading to true while waiting for the API response
    setLoading(true);

    try {
      // Send a POST request to your API
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("data", data);

      if (response.ok) {
        // Handle successful signup (you can also redirect user here if needed)
        setSuccess("Signup successful! Please check your email for verification.");
        setFormData({ name: "", email: "", password: "" });
        // Store user data and JWT token in localStorage
        localStorage.setItem("user", JSON.stringify(data.result)); // Save user data (without password)
        localStorage.setItem("token",JSON.stringify( data.auth)); // Save JWT token
        navigate("/");
      } else {
        // Handle errors from the API
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Error during signup:", error);
      setError("An error occurred. Please try again.");
    } finally {
      // Set loading to false after API call finishes
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={loading} // Disable the input when loading
          />
        </div>

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
          {loading ? "Signing Up..." : "Signup"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
