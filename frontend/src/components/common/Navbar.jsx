import React from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';

function Navbar() {
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();



    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }
    };

    return (
        <nav class="navbar">
            <span class="menu-btn material-symbols-outlined">
                Menu
            </span>
            <a href="#" class="logo">
                <img src="logo.png" alt="logo"/>
                <h2>CHAT CHIT</h2>
            </a>
            <ul class="links">
                <span class="close-btn material-symbols-outlined">close</span>
                {!isAuthenticated && <li><Link to="/">Home</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul>
            <button class="login-btn">
                LOGIN
            </button>
            {/* <ul>
                {!isAuthenticated && <li><Link to="/">Home</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
            </ul> */}
        </nav>
    );
}

export default Navbar;