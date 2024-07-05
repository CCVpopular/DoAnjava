import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';

function UpdateUser() {
    const navigate = useNavigate();
    const { userId } = useParams();


    const [userData, setUserData] = useState(
        {
            name: '',
            email: '',
            role: ''
        }
    );

    useEffect(() => {
        fetchUserDataById(userId); // Pass the userId to fetchUserDataById
    }, [userId]); //wheen ever there is a chane in userId, run this

    const fetchUserDataById = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await UserService.getUserById(userId, token); // Pass userId to getUserById
            const { name, email, role } = response.user;
            setUserData({ name, email, role });
        } 
        catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const confirmDelete = window.confirm('Are you sure you want to update this user?');
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const res = await UserService.updateUser(userId, userData, token);
            console.log(res)
            // Redirect to profile page or display a success message
            navigate("/admin/user-management")
        }

        } catch (error) {
            console.error('Error updating user profile:', error);
            alert(error)
        }
    };

return (
    <div className="auth-container">
        <div className="form-popup">
            <div class="form-box updateUser">
                <div class="form-content">
                    <h2>Cập nhật thông tin người dùng</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input type="text" name="name" value={userData.name} onChange={handleInputChange} />
                            <label>Họ Tên:</label>
                        </div>
                        <div className="input-field">
                            <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
                            <label>Email:</label>
                        </div>
                        <button type="submit">Xác nhận</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
);
}

export default UpdateUser;