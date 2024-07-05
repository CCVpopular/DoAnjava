import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const location = useLocation();
    const tokenPassword = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const status = await UserService.ResetPassword(tokenPassword, newPassword)
            if (status.statusCode === 200) {
                alert(status.message);
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
        <div class="card">
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label>Mật khẩu mới </label>
                </div>
                <button type="submit">Lưu</button>
            </form>
        </div>
    );
};

export default ResetPassword;
