import React, { useState, useEffect } from "react";
import UserService from "../service/UserService";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Friends = () => {

    const [friendName, setFriendName] = useState('');
    const [usersSearch, setUsersSearch] = useState([]);
    const [token, setToken] = useState('');
    const [myName, setmyName] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            setToken(token);
            const response = await UserService.getYourProfile(token);
            setmyName(response);
            const userId = localStorage.getItem('userId');
            console.log("Searching for:", token);
            const addFriendlist = await UserService.getAddFriendList(userId, token);
            setNotifications(addFriendlist.friends);
            setupWebSocket();
        } 
        catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleFriendName = async (event) => {
        const { value } = event.target;
        setFriendName(value);
        if (value.length > 2) {
            try {
                console.log("Searching for:", value);
                console.log("myName:", myName.user.name); 
                const response = await UserService.getUsersByName(myName.user.name, value, token);
                console.log("Search response:", response); 
                setUsersSearch(response.userList || []); 
            } catch (error) {
                console.error('Error fetching users by name:', error);
                setUsersSearch([]);
            }
        } else {
            setUsersSearch([]);
        }
    };

    const AddFriend = async (friend) => {
        try {
            var addFriendData = {
                user: myName.user.id,
                friend: friend.id,
                status: "PENDING",
                hasRead: false,
            };
            stompClient.send("/app/add-friend", {}, JSON.stringify(addFriendData));
        } 
        catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const setupWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            console.log('Connected');
            setStompClient(client);
            client.subscribe('/addFriend/req', addFriendReceived)
        }, (error) => {
            console.error('Error connecting to WebSocket:', error);
        });
    };

    
    const addFriendReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
            const userId = localStorage.getItem("userId")
            const userIdString = String(userId).trim();
            const friendIdString = String(payloadData.friend.id).trim();
            if(userIdString === friendIdString){
                setNotifications((prevNotifications) => {
                    // Kiểm tra nếu thông báo đã tồn tại trong mảng notifications
                    const isDuplicate = prevNotifications.some(
                        (notification) => notification.id === payloadData.id
                    );
        
                    // Nếu không có thông báo trùng lặp, thêm thông báo mới
                    if (!isDuplicate) {
                        return [...prevNotifications, payloadData];
                    } else {
                        return prevNotifications;
                    }
                });
            }        
    }

    return (
        <div className="user-management-container">
            <div>
                <label> ID Người Bạn Muốn Kết Bạn: </label>
                <input type="text" value={friendName} onChange={handleFriendName} required />
            </div>
            <div>
                {usersSearch.length > 0 && (
                    <div>
                        <h3>Kết quả tìm kiếm:</h3>                      
                            {usersSearch.map((usersSearch) => (
                                <ul key={usersSearch.id}>
                                    <li>{usersSearch.name}</li>
                                    <li>
                                    <button onClick={() => AddFriend(usersSearch)}>Add Friend</button>
                                    </li>
                                </ul>
                            ))}
                    </div>
                )}
            </div>
            <div>
            <h3>Notifications:</h3>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification.user.name}
                            <button onClick={() => AddFriend(usersSearch)} >Chấp Nhận</button>
                            <button onClick={() => AddFriend(usersSearch)} >Từ Chối</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Friends;
