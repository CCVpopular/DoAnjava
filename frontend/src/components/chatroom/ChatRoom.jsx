import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import UserService from '../service/UserService';
import MessageService from '../service/MessageService';

import { MdOutlineGroups } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";

var stompClient = null;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        fetchUserData();
        fetchMessages(); // Load tin nhắn khi component được mount
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
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const publicResponse = await MessageService.getPublicMessages(token);
            setPublicChats(publicResponse.data);

            // Fetch private messages for each sender
            const privateResponse = await Promise.all(
                [...privateChats.keys()].map(sender =>
                    MessageService.getPrivateMessages(sender, userData.username, token)
                )
            );

            // Process private messages
            const privateMessagesMap = new Map(privateResponse.map((response, index) => [response.data.senderName, response.data.messages]));
            setPrivateChats(privateMessagesMap);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        console.log(userData);
    }, [userData]);

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
                const token = localStorage.getItem('token');
                await MessageService.savePublicMessage(chatMessage, token);
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

            // Save message to the database
            const token = localStorage.getItem('token');
            await MessageService.savePrivateMessage(chatMessage, token);

            setUserData({ ...userData, "message": "" });
        }
    }

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                    <div className="member-list">
                        <div className="search-box">
                            <div className="search-message">
                                <input type="text" className="input-message" placeholder="Tìm kiếm tin nhắn" />
                                <button type="button" className="search-button" ><FaSearch  className='iconSearchMess'/></button>
                            </div>
                        </div>
                        <ul>
                            <li onClick={() => { setTab("CHATROOM") }} className={`member ${tab === "CHATROOM" && "active"}`}><MdOutlineGroups className='iconChatAll' /><div className='textChatAll'>Phòng chat tổng</div></li>
                            {[...privateChats.keys()]
                                .filter(name => name !== userData.username) 
                                .map((name, index) => (
                                    <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
                                ))}
                        </ul>
                    </div>
                    {tab === "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {publicChats.map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Nhập tin nhắn" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendValue}><TbSend2 className='iconSendMess'/></button>
                        </div>
                    </div>}
                    {tab !== "CHATROOM" && <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="send-message">
                            <input type="text" className="input-message" placeholder="Nhập tin nhắn" value={userData.message} onChange={handleMessage} />
                            <button type="button" className="send-button" onClick={sendPrivateValue}><TbSend2 className='iconSendMess'/></button>
                        </div>
                    </div>}
                </div>
                :
                <div>Loading...</div>
            }
        </div>
    )
}

export default ChatRoom;