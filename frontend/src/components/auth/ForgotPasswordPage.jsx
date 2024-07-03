import React, {useState} from "react";
import UserService from "../service/UserService";

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
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit">Gui Link</button>
            </form>
        </div>
    )

}

export default ForgotPasswordPage;