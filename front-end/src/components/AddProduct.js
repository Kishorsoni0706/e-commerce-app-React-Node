import React, { useState } from "react";


const AddProduct = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });

    // Clear error messages as the user types
    setErrors({
      ...errors,
      [name]: ''
    });
  };

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

  // Handling form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop the form from submitting if validation fails
    }

    const userId = JSON.parse(localStorage.getItem('user'))._id;

    // Get the token from localStorage
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) {
    console.error("No token found");
    return; // Prevent submission if no token exists
  }

    // API call to save product data
    try {
      const response = await fetch("http://localhost:5000/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add the token here
        },
        body: JSON.stringify({ ...product, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      console.log("Product added:", data);

      // Clear form after successful submission (Optional)
      setProduct({
        name: '',
        price: '',
        category: '',
        company: ''
      });

    } catch (error) {
      console.error("Error:", error);
      // Optionally show a user-friendly error message here
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
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

        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
