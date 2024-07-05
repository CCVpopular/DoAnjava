import React, {useState} from "react";
import UserService from "../service/UserService";
import { Link } from 'react-router-dom';

function ForgotPasswordPage(){
const [email, setEmail] = useState('')
const [error, setError] = useState('')

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const status = await UserService.ForgotPassword(email)
        if (status.statusCode === 200) {
            alert('Password reset email sent');
        }else{
            alert('Error sending email');
            console.log(status.statusCode)
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
        <div className="auth-container">
            <div class="card">
                <div>
                    <Link to={`/login`}><span class="close-btn material-symbols-outlined">Close</span></Link>
                </div>
                <p class="lock-icon"><i> </i></p>
                <h2>Quên mật khẩu?</h2>
                <p>Nhập email để nhận mail reset mật khẩu.</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <input type="email" class="passInput" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <label>Email </label>
                    </div>
                    <button type="submit">Gửi</button>
                </form>
            </div>
        </div>
    )

}

export default ForgotPasswordPage;