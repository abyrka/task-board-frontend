import React, { useState, useEffect } from 'react';
import './UserModal.scss';

interface UserModalProps {
  user?: { _id: string; name: string; email: string } | null;
  onSave: (name: string, email: string) => Promise<void>;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onSave, onClose }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
    } else {
      setUserName('');
      setUserEmail('');
    }
  }, [user]);

  const handleSave = async () => {
    if (!userName.trim() || !userEmail.trim()) return;

    await onSave(userName, userEmail);
  };

  const handleClose = () => {
    setUserName('');
    setUserEmail('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3>{user ? 'Edit User' : 'Create New User'}</h3>
        <input
          type="text"
          placeholder="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <input
          type="email"
          placeholder="Email address"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            {user ? 'Update User' : 'Save User'}
          </button>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
