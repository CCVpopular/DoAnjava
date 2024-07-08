import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import UserService from '../service/UserService';
import MessageService from '../service/MessageService';
import PrivateMessageService from '../service/PrivateMessageService';

import { MdOutlineGroups } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { BsEmojiGrin } from "react-icons/bs";

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
    }, []);

    useEffect(() => {
        if (userData.username) {
            connect();
        }
    }, [userData.username]);

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
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
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
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else { 
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
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

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
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

                            </div>
                        </div>
                        <ul>
                            <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}><MdOutlineGroups className='iconChatAll' /><div className='textChatAll'>Phòng chat tổng</div></li>
                            <ul>
                                {friendList.map((friend) => (
                                    <li key={friend.id} onClick={() => fetchMessagesBetweenUsers(friend.name)} className={`member ${tab === friend.name && "active"}`}>{friend.name}</li>
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
