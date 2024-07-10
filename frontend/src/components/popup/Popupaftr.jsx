import React, { useState } from 'react';
import UserService from '../service/UserService';
import './Popup.css';

const Popup = ({ show,  onClose, chatRoomId, sendInvite}) => {

    const [friendName, setFriendName] = useState('');
    const [usersSearch, setUsersSearch] = useState([]);

    const handleFriendName = async (event) => {
        const { value } = event.target;
        setFriendName(value);
        if (value.length > 2) {
            try {
                const token = localStorage.getItem('token');
                const response = await UserService.getUsersByNameNotInChatRoom(chatRoomId, value, token);
                setUsersSearch(response.userList || []);
            } catch (error) {
                console.error('Error fetching users by name:', error);
                setUsersSearch([]);
            }
        } else {
            setUsersSearch([]);
        }
    };

    if (!show) {
        return null;
    }

    const handleSubmit = (senderName) => {
        sendInvite(chatRoomId, senderName);
    };

    return (
        <div className="popup setZindexx10">
        <div className="popup-inner">
            <button className="close-btn" onClick={onClose}>X</button>
            <div className="findFriendspop">
                <div className="box-findFriend">
                    <h3>Mời bạn bè </h3>
                    <input type="text" value={friendName} placeholder="Tìm kiếm bạn bè" onChange={handleFriendName} required />
                </div>
                <div>
                    {usersSearch.length > 0 && (
                        <div>
                            <h3>Bạn Bè: </h3>  
                            <br></br>
                            <div className="box-listUlFriend">
                                {usersSearch.map((usersSearch) => (
                                    <ul  key={usersSearch.id}>
                                        <li className="box-listliFriend">
                                            <div className="listliFriend">
                                                <div className="listliFriendName">
                                                    {usersSearch.name}
                                                </div>
                                                <button className="listliFriendBtn" onClick={() => handleSubmit(usersSearch.name)} >Mời bạn bè</button>
                                            </div>
                                        </li>
                                    </ul>
                                ))}
                            </div>                    
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Popup;
