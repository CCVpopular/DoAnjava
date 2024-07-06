import React, { useState } from 'react';
import axios from 'axios';

const FriendRequestForm = () => {
    const [friendId, setFriendId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = 1; // ID của người dùng hiện tại, cần lấy từ trạng thái ứng dụng hoặc xác thực người dùng

        try {
            const response = await axios.post('/api/friends/request', null, {
                params: { userId, friendId }
            });
            setMessage(response.data);
        } catch (error) {
            console.error('Error sending friend request:', error);
            setMessage('Lỗi khi gửi yêu cầu kết bạn');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        ID Người Bạn Muốn Kết Bạn:
                        <input
                            type="text"
                            value={friendId}
                            onChange={(e) => setFriendId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Gửi Yêu Cầu Kết Bạn</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FriendRequestForm;