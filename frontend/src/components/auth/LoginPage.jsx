import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import { Link } from 'react-router-dom';


function LoginPage(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userData = await UserService.login(email, password)
        console.log(userData)
        if (userData.token) {
            localStorage.setItem('token', userData.token)
            localStorage.setItem('role', userData.role)
            navigate('/profile')
        }else{
            setError(userData.message)
        }
        
    } catch (error) {
        console.log(error)
        setError(error.message)
        setTimeout(()=>{
            setError('');
        }, 5000);
    }
}


    return(
        <div className="auth-container ">
            <div className="blur-bg-overlay"></div>
            <div className="form-popup">
                <span class="close-btn material-symbols-outlined">
                    close
                </span>
                <div class="form-box login">
                    <div class="form-details">
                        <h2>Chào mừng !</h2>
                        <p>Để bắt đầu "CHAT CHIT" vui lòng đăng nhập tài khoản.</p>
                    </div>
                    <div class="form-content">
                        <h2>Đăng ký</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                <label>Email </label>
                            </div>
                            <div className="input-field">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                <label>Mật Khẩu </label>
                            </div>
                            <button type="submit">Đăng nhập</button>
                            <button class="loginBtn loginBtn--facebook">
                                Đăng nhập Facebook
                            </button>
                            <button class="loginBtn loginBtn--google">
                                Đăng nhập Google
                            </button>
                        </form>
                        <div className="divForgotPassword">
                            <button class="forgotPasswordBtn"><Link to={`/forgotPassword`}>Quên Mật Khẩu</Link></button>
                        </div>
                        <div class="bottom-link">
                            Bạn có tài khoản không ?
                            <a href="https://github.com/CCVpopular/DoAnjava" id="signup-link"> Tạo tài khoản mới</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;