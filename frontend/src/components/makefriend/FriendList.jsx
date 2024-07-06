import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const userId = 1; // ID của người dùng hiện tại, cần lấy từ trạng thái ứng dụng hoặc xác thực người dùng

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/api/friends', {
                    params: { userId }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
                setError('Lỗi khi lấy danh sách bạn bè');
            }
        };

        fetchFriends();
    }, [userId]);

    return (
        <div>
            <h2>Danh Sách Bạn Bè</h2>
            {error && <p>{error}</p>}
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>{friend.friend.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;