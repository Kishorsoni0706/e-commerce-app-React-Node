import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Functional Component for Product List
const ProductList = () => {
  // State to store products
  const [products, setProducts] = useState([]);
  // State for loading state
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);
  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // The bearer token (this could be passed in as a prop or stored in localStorage)
  const token = JSON.parse(localStorage.getItem("token")); // Example of retrieving token from localStorage

 // console.warn(token)

  // Fetch products data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Fetch products data based on the search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        return; // Don't fetch if the search query is empty
      }
      try {
        const response = await fetch(`http://localhost:5000/search/${searchQuery}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSearchResults();
  }, [searchQuery, token]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle Delete function
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      alert("Product deleted successfully");
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err.message);
      alert(`Error deleting product: ${err.message}`);
    }
  };

  // Render loading or error state
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Product List</h1>

      {/* Search Box */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search products..."
        style={styles.searchBox}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S. No.</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Company</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} style={styles.tableRow}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{product.name}</td>
              <td style={styles.td}>${product.price}</td>
              <td style={styles.td}>{product.category}</td>
              <td style={styles.td}>{product.company}</td>
              <td style={styles.td}>
                <button style={styles.button}>
                  <Link to={`/update/${product._id}`}>Edit</Link>
                </button>
                <button
                  style={styles.buttonDelete}
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Basic styling for the component
const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    fontFamily: "'Arial', sans-serif",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  header: {
    color: "#333",
    marginBottom: "20px",
  },
  searchBox: {
    padding: "10px",
    width: "80%",
    fontSize: "16px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
  },
  table: {
    width: "90%",
    margin: "0 auto",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  th: {
    padding: "12px",
    backgroundColor: "#f9f9f9",
    borderBottom: "2px solid #ddd",
    textAlign: "center",
    color: "#333",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    textAlign: "center",
    color: "#555",
  },
  tableRow: {
    transition: "background-color 0.3s ease",
  },
  button: {
    margin: "0 5px",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
  buttonDelete: {
    margin: "0 5px",
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
  },
};

export default ProductList;
