import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    company: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    category: '',
    company: ''
  });

  const { id } = useParams(); // Get the productId from the URL params
  const navigate = useNavigate();

  // Get the authentication token from localStorage
  const token = JSON.parse(localStorage.getItem('token')); // Assuming the token is stored in localStorage under the key 'token'

  // Fetch product data when component mounts or when the productId (from URL) changes
  useEffect(() => {
    if (id) {
      // Fetch product details for the given productId
      fetch(`http://localhost:5000/get-product/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` // Include the Bearer token in the headers
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Product not found');
          }
          return response.json();
        })
        .then((data) => {
          if (data === "No Product Found") {
            console.error("No product found with this ID.");
            return;
          }

          // Prefill the form fields with fetched product data
          setProduct({
            name: data.name || '',
            price: data.price || '',
            category: data.category || '',
            company: data.company || ''
          });
        })
        .catch((err) => {
          console.error("Error fetching product data:", err);
          alert("There was an error fetching the product data.");
        });
    }
  }, [id, token]); // Depend on 'id' from useParams() and 'token'

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    // Validate product name
    if (!product.name.trim()) {
      newErrors.name = "Product name is required.";
      formIsValid = false;
    }

    // Validate price
    if (!product.price.trim()) {
      newErrors.price = "Price is required.";
      formIsValid = false;
    } else if (isNaN(product.price) || product.price <= 0) {
      newErrors.price = "Price must be a valid number greater than 0.";
      formIsValid = false;
    }

    // Validate category
    if (!product.category.trim()) {
      newErrors.category = "Category is required.";
      formIsValid = false;
    }

    // Validate company
    if (!product.company.trim()) {
      newErrors.company = "Company is required.";
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop the form from submitting if validation fails
    }

    // Get the logged-in user's ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      alert('User is not logged in or user ID is missing.');
      return;
    }

    const userId = user._id;

    try {
      // Send the updated product data to the backend
      const response = await fetch(`http://localhost:5000/update-product/${id}`, {
        method: "PUT", // Assuming the update API uses PUT method
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the Bearer token for authentication
        },
        body: JSON.stringify({ ...product, userId }), // Send the updated product data
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      console.log("Product updated:", data);

      if (data.message === "Product updated successfully") {
        alert('Product updated successfully!');
        navigate('/'); // Redirect to the product list page ("/products")
      }

    } catch (error) {
      console.error("Error:", error);
      alert("There was an error updating the product.");
    }
  };

  return (
    <div className="update-product-container">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
            className={errors.price ? "input-error" : ""}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter product category"
            className={errors.category ? "input-error" : ""}
          />
          {errors.category && <div className="error">{errors.category}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="company">Company:</label>
          <input
            type="text"
            id="company"
            name="company"
            value={product.company}
            onChange={handleChange}
            placeholder="Enter product company"
            className={errors.company ? "input-error" : ""}
          />
          {errors.company && <div className="error">{errors.company}</div>}
        </div>

        <button type="submit" className="submit-button">Update Product</button>
      </form>
    </div>
  );
};

export default UpdateProduct;
