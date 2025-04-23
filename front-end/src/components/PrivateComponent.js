import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
    const [auth, setAuth] = useState(localStorage.getItem('user'));

    useEffect(() => {
        // Listen for changes in localStorage (e.g., when logging out)
        const handleStorageChange = () => {
            setAuth(localStorage.getItem('user'));
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // If user is not authenticated, redirect to signup
    if (!auth) {
        return <Navigate to="/Signup" />;
    }

    return <Outlet />;
};

export default PrivateComponent;
