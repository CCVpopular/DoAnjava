import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function RegistrationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        city: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the register method from UserService

            await UserService.register(formData);

            // Clear the form fields after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                city: ''
            });
            alert('User registered successfully');
            navigate('/login');

        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user');
        }
    };

    return (
        <div className="auth-container">
            <div className="blur-bg-overlay"></div>
            <div className="form-popup">
                <div>
                    <Link to={`/login`}><span class="close-btn material-symbols-outlined">Close</span></Link>
                </div>
                <div class="form-box signup">
                    <div class="form-details">
                        <h2>Tạo tài khoản mới !</h2>
                        <p>Hãy tạo tài khoản mới đã cùng nhắn tin nào.</p>
                    </div>
                    <div class="form-content">
                        <h2>Tại tài khoản mới</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                <label>Họ tên</label>
                            </div>
                            <div className="input-field">
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                <label>Email</label>
                            </div>
                            <div className="input-field">
                                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                                <label>Mật khẩu</label>
                            </div>
                            <div className="input-field">
                                <input type="text" name="role" value={formData.role} onChange={handleInputChange} required />
                                <label>Quyền</label>
                                {/* placeholder="Enter your role" */}
                            </div>
                            <div className="input-field">
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                                <label>Thành phố</label>
                                {/* placeholder="Enter your city" */}
                            </div>
                            <button type="submit">Đăng ký</button>
                        </form>
                        <div class="bottom-link ">
                            Bạn đã có tài khoản ?
                            <Link to={`/`}> Đăng nhập tài khoản</Link>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
}

export default RegistrationPage;