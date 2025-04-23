import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const user = localStorage.getItem('user'); // Check if the user is logged in
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/Signup');  // Navigate to Signup page after logout
    };

    return (
        <div>
            <nav className="nav-container">
                {/* Logo on the left side */}
                <div className="logo">
                    <img src="https://img.freepik.com/premium-vector/abstract-modern-ecommerce-logo-design-colorful-gradient-shopping-bag-logo-template_467913-995.jpg" alt="Logo" />
                </div>
                <ul className="nav-ul">
                    {user ? (
                        // If the user is logged in, show these links
                        <>
                            <li><Link to="/">Product</Link></li>
                            <li><Link to="/add">Add Product</Link></li>
                            {/* <li><Link to="/update">Update Product</Link></li> */}
                            <li><Link to="/profile">Profile</Link></li>
                            <li><button onClick={logout}>Logout</button>{JSON.parse(user).name}</li>
                        </>
                    ) : (
                        // If the user is not logged in, show SignUp and Login links
                        <>
                            <li className="signupbtn">
                                <Link to="/signup">SignUp</Link>
                            </li>
                            <li className="loginbtn">
                                <Link to="/login">Login</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Nav;
