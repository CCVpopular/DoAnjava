// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage'
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userpage/UpdateUser';
import UserManagementPage from './components/userpage/UserManagementPage';
import ProfilePage from './components/userpage/ProfilePage';
import ChatRoom  from './components/chatroom/ChatRoom';


import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPassword from './components/auth/ResetPassword';



function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {!UserService.isAuthenticated() && (
              <>
              <Route exact path="/" element={<LoginPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route exact path="/register" element={<RegistrationPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
              <Route path="/chatroom" element={<ChatRoom/>}/>
              </>
            )}
            {UserService.isAuthenticated() && (
              <>
                <Route path="/" element={<LoginPage />} />
                <Route path="/forgotPassword" element={<Navigate to="/chatroom" />} />
                <Route path="/resetPassword" element={<Navigate to="/chatroom" />} />
                <Route exact path="/register" element={<Navigate to="/chatroom" />} />
                <Route path="*" element={<Navigate to="/chatroom" />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chatroom" element={<ChatRoom/>}/>
              </>
            )}


            {UserService.adminOnly() && (
              <>
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;