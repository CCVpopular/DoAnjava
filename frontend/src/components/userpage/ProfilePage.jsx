import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';



function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response.user);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h2>Thông tin tài khoản</h2>
            <p className="profileText">Họ tên: {profileInfo.name}</p>
            <p className="profileText">Email: {profileInfo.email}</p>
            <div className='contenerBtnUpdate' >
                {profileInfo.role === "ADMIN" && (
                    <button className="profileBtn"><Link className='profileLinkUpdateUser' to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;