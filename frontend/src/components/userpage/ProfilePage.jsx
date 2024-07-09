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
        <div className="container">
            <div className='chat-box proFileContent'>
                    <div class="form-content">
                        <h2>Thông tin tài khoản</h2>
                        <form>
                            <div className="input-field" >
                                <input type="text" value={profileInfo.name} />
                                <label>Họ Tên </label>
                            </div>
                            <div className="input-field">
                                <input type="text" value={profileInfo.email}/>
                                <label>Email </label>
                            </div>
                        </form>
                        <br></br>
                        <div className='contenerBtnUpdate' >
                            {profileInfo.role === "ADMIN" && (
                                <button className="listliFriendName"><Link className='profileLinkUpdateUser' to={`/update-user/${profileInfo.id}`}>Update This Profile</Link></button>
                            )}
                        </div>
                    </div>

            </div>
        </div>
    );
}

export default ProfilePage;