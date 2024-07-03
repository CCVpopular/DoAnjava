import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";


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
                        <h2>Wellcome Back</h2>
                        <p>Please log in to start messaging.</p>
                    </div>
                    <div class="form-content">
                        <h2>LOGIN</h2>
                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-field">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                                <label>Email: </label>
                            </div>
                            <div className="input-field">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                                <label>Password: </label>
                            </div>
                            <a href="https://github.com/CCVpopular/DoAnjava" class="forgot-pass">Forgot password</a>
                            <button type="submit">Login</button>
                            <button class="loginBtn loginBtn--facebook">
                                Login with Facebook
                            </button>
                            <button class="loginBtn loginBtn--google">
                                Login with Google
                            </button>
                        </form>
                        <div class="bottom-link">
                            Don't have an account?
                            <a href="https://github.com/CCVpopular/DoAnjava" id="signup-link">Signup</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LoginPage;