import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const location = useLocation();
    const tokenPassword = new URLSearchParams(location.search).get('token');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const status = await UserService.ResetPassword(tokenPassword, newPassword)
            if (status.statusCode === 200) {
                alert(status.message);
                navigate('/login')
            }else{
                alert(status.message);
                console.log(status.statusCode)
            }
        } catch (error) {
            console.error(error);
            console.log(error)
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
