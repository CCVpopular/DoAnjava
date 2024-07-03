import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(UserService.isAuthenticated());
            setIsAdmin(UserService.isAdmin());
        };

        const subscription = UserService.subscribe(handleAuthChange);

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }
    };

    return (
        <nav>
            <ul>
                {!isAuthenticated && <li><Link to="/">Home</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
