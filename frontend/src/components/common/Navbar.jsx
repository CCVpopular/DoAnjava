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
            window.location.reload();
        }
    };

    return (
        <nav className="navbar">
            <a href="#" className="logo">
                <img src="logo.png" alt="logo"/>
                <h2>CHAT CHIT</h2>
            </a>
            <ul className="links">
                {!isAuthenticated && <li><Link to="/">Trang chủ</Link></li>}
                {isAuthenticated && <li><Link to="/profile">Tài khoản</Link></li>}
                {isAuthenticated && <li><Link to="/chatroom">Tin nhắn</Link></li>}
                {isAuthenticated && <li><Link to="/videocall">Phòng thoại</Link></li>}
                {isAuthenticated && <li><Link to="/friends">Bạn bè</Link></li>}
                {isAdmin && <li><Link to="/admin/user-management">QL Tài khoản</Link></li>}
                {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Đăng xuất</Link></li>}
            </ul>
            <button className="login-btn">
                HelloWord
            </button>
        </nav>
    );
}

export default Navbar;
