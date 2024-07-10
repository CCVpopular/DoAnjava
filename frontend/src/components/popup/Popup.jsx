import React, { useState } from 'react';
import './Popup.css'

const Popup = ({ show, onClose, onSubmit}) => {
  const [name, setName] = useState('');

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
    onClose();
  };

  return (
    <div className="popup setZindexx10">
      <div className="popup-inner">
        <button className="close-btn setclosePoppup" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <label className='setnamenewroomchat'>
            <div className="input-field setnamenewroomchat">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label>Nhập tên phòng chat mới </label>
            </div>
            {/* Nhập tên:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            /> */}
          </label>
          <button type="submit">Tạo</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
