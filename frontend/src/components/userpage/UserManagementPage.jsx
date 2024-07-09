import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../service/UserService";

function UserManagementPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
    // Fetch users data when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage
            const response = await UserService.getAllUsers(token);
            //   console.log(response);
            setUsers(response.userList); // Assuming the list of users is under the key 'ourUsersList'
        } 
        catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const deleteUser = async (userId) => {
        try {
        // Prompt for confirmation before deleting the user
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (confirmDelete) {
            await UserService.deleteUser(userId, token);
            // After deleting the user, fetch the updated list of users
            fetchUsers();
        }
        } 
        catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="container">
            <div className="chat-box">
                <div className="user-management-container">
                    <div className="newUser">
                        <h2>Quản Lý Người Dùng</h2>
                        <button className="reg-button">
                        {" "}
                        <Link className="reg-buttonAddUser" to="/register">Thêm Người Dùng</Link>
                        </button>
                    </div>
                    <div className="tabox-listUserManagele" >
                        <table id="customers" className="table sticky">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên</th>
                                    <th>Email</th>
                                    <th>Chọn</th>
                                </tr>
                            </thead>
                            <tbody >
                                    {users.map((user) => (
                                        <tr  key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <div className="btnacctionuser">
                                                    <button className="delete-button btntableuserdelete" onClick={() => deleteUser(user.id)}>Xóa</button>
                                                    <button className="btntableuserupdate">
                                                        <Link className="nameupdateuser" to={`/update-user/${user.id}`}>Cập Nhật</Link>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserManagementPage;
