import React, { useState } from 'react';
import axios from 'axios';

const AcceptFriendRequestForm = () => {
    const [requestId, setRequestId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/friends/accept', null, {
                params: { requestId }
            });
            setMessage(response.data);
        } catch (error) {
            console.error('Error accepting friend request:', error);
            setMessage('Lỗi khi chấp nhận yêu cầu kết bạn');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        ID Yêu Cầu Kết Bạn:
                        <input
                            type="text"
                            value={requestId}
                            onChange={(e) => setRequestId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Chấp Nhận Yêu Cầu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AcceptFriendRequestForm;