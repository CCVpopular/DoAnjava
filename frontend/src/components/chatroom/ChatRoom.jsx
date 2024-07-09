import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import UserService from '../service/UserService';
import MessageService from '../service/MessageService';
import PrivateMessageService from '../service/PrivateMessageService';

import { MdOutlineGroups } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { MdVideoCall } from "react-icons/md";
// import { BsEmojiGrin } from "react-icons/bs";

var stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [selectedFile, setSelectedFile] = useState(null); // State cho tệp tin đã chọn
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [friendList, setFriendList] = useState([]);
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        fetchUserData();
        fetchMessages();
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (userData.username) {
            connect();
        }
    }, [userData.username]);

    const handleBeforeUnload = () => {
        if (stompClient && userData.connected) {
            var chatMessage = {
                senderName: userData.username,
                status: StatusEnum.LEAVE
            };
            stompClient.send("/app/imOnline", {}, JSON.stringify(chatMessage));
        }
    };

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.getYourProfile(token);
            setUserData({ ...userData, username: response.user.name });
            const friendListitem = await UserService.getFriends(response.user.id, token);
            setFriendList(friendListitem);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const publicResponse = await MessageService.getPublicMessages(token);
            setPublicChats(publicResponse.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        // stompClient.subscribe('/chatroom/public', onMessageReceived);
        userJoin();
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        stompClient.subscribe('/user/public/imOnline', onUserOnline); 

    }

    const StatusEnum = {
        JOIN: "JOIN",
        MESSAGE: "MESSAGE",
        LEAVE: "LEAVE"
    };
    
    const updateFriendStatus = (friend, onlineUserStatus) => {
        switch (onlineUserStatus) {
            case StatusEnum.JOIN:
                console.log("=================================================");
                return { ...friend, isOnline: true };
            case StatusEnum.LEAVE:
                console.log("-------------------------------------------------");
                return { ...friend, isOnline: false };
            default:
                return friend;
        }
    };
    
    const onUserOnline = (payload) => {
        const onlineUserStatus = JSON.parse(payload.body);
        const updatedFriendList = friendList.map(friend => {
            if (friend.name === onlineUserStatus.senderName) {
                return updateFriendStatus(friend, onlineUserStatus.status);
            }
            return friend;
        });
    
        setFriendList(updatedFriendList);
    };

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };

        var chatMessage11 = {
            senderName: userData.username,
            status: StatusEnum.JOIN
        };
        stompClient.send("/app/imOnline", {}, JSON.stringify(chatMessage11));
    }

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
        
    }

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
    
        setPrivateChats(prevPrivateChats => {
            const updatedChats = new Map(prevPrivateChats);
            
            let chatsToUpdate = updatedChats.get(payloadData.senderName);
    
            if (chatsToUpdate) {
                chatsToUpdate = [...chatsToUpdate, payloadData];
                updatedChats.set(payloadData.senderName, chatsToUpdate);
                console.log(updatedChats);
            } else {
                updatedChats.set(payloadData.senderName, [payloadData]);
            }
            
            return updatedChats;
        });
    }
    
    

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, "message": value });
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const sendValue = async () => {
        if (stompClient) {
            if (userData.message.trim() !== "") {
                var chatMessage = {
                    senderName: userData.username,
                    message: userData.message,
                    status: "MESSAGE",
                };
                console.log(chatMessage);
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                setUserData({ ...userData, message: "" });
            }
        }
    };

    const sendPrivateValue = async () => {
        if (stompClient && userData.message.trim() !== "") {

            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            setPrivateChats(prevPrivateChats => {
                const updatedChats = new Map(prevPrivateChats);
                
                let chatsToUpdate = updatedChats.get(tab);
        
                if (chatsToUpdate) {
                    chatsToUpdate = [...chatsToUpdate, chatMessage]; // Tạo một bản sao mới của mảng chatsToUpdate và thêm payloadData vào đó
                    updatedChats.set(tab, chatsToUpdate);
                    console.log(updatedChats);
                } else {
                    updatedChats.set(tab, [chatMessage]);
                }
                
                return updatedChats;
            });
    
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const fetchMessagesBetweenUsers = async (receiverName) => {
        try {
            setTab(receiverName);
            const token = localStorage.getItem('token');
            const response = await PrivateMessageService.getMessagesBetweenUsers(userData.username, receiverName, token);

            let chatList = [];
            response.forEach(message => {
                var chatMessage = {
                    senderName: message.senderName,
                    receiverName: message.receiverName,
                    message: message.message,
                    status: message.status
                };
                chatList.push(chatMessage);
            });

            privateChats.set(receiverName, chatList);
            setPrivateChats(new Map(privateChats));
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
    
    const sendFile = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('senderName', userData.username);
            formData.append('receiverName', tab === "CHATROOM" ? "" : tab);
            formData.append('file', selectedFile);
            formData.append('styleMessage', selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE');
            

            try {
                const token = localStorage.getItem('token');
                const response = await MessageService.sendMediaMessage(formData, token);
                console.log('File sent successfully:', response.data);
                if (tab === "CHATROOM") {
                    publicChats.push(response.data);
                    setPublicChats([...publicChats]);
                } else {
                    privateChats.get(tab).push(response.data);
                    setPrivateChats(new Map(privateChats));
                }
                setSelectedFile(null); // Clear selected file
            } catch (error) {
                console.error('Error sending file:', error);
            }
        }
    };

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <div className="search-box">
                            <div className="search-message">
                                <input type="text" className="input-message" maxLength={50} placeholder="Tìm kiếm tin nhắn" />
                                <button type="button" className="search-button" ><FaSearch  className='iconSearchMess'/></button>

                                <button type="button" className="search-button" ><MdVideoCall  className='iconSearchMess'/></button>
                            </div>
                        </div>
                        <ul>
                            <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}><MdOutlineGroups className='iconChatAll' /><div className='textChatAll'>Phòng chat tổng</div></li>
                            <ul>
                                {friendList.map((friend) => (
                                    <li key={friend.id} onClick={() => fetchMessagesBetweenUsers(friend.name)} className={`member ${tab === friend.name && "active"}`}>{friend.name} {friend.online ? <span className="online">online</span> : <span className="offline">offline</span>}</li>
                                ))}
                            </ul>
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    {chat.mediaUrl && chat.styleMessage === 'IMAGE' && (
                                    <div className="message-data">
                                        <img src={chat.mediaUrl}  alt="Attached Image" />
                                    </div>
                                    )}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">

                            <textarea type="text" className="input-messageAll" placeholder="Nhập tin nhắn" maxLength={254} value={userData.message} onChange={handleMessage} />
                            <input type="file" onChange={handleFileChange} />
                            <button type="button" className="send-button" onClick={sendFile}>Gửi file</button>
                            {/* <button type="button" className="send-button" ><BsEmojiGrin className='iconSendMess'/></button> */}

                            <button type="button" className="send-button" onClick={sendValue}><TbSend2 className='iconSendMess'/></button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {(privateChats.get(tab) || []).map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">

                            <input type="text" className="input-message" placeholder="Nhập tin nhắn" maxLength={254} value={userData.message} onChange={handleMessage} />
                            <input type="file" onChange={handleFileChange} />
                            <button type="button" className="send-button" onClick={sendFile}>Gửi file</button>
                            {/* <button type="button" className="send-button" ><BsEmojiGrin className='iconSendMess'/></button> */}

                            <button type="button" className="send-button" onClick={sendPrivateValue}><TbSend2 className='iconSendMess'/></button>
                        </div>
                    </div>}
                </div>
                :
                <div>
                    {/* Loading... */}
                    <div className='loader'></div>
                </div>
            }
        </div>
    )
}

export default ChatRoom;
