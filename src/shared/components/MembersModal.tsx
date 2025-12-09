import React, { useState, useEffect } from 'react';
import { useUsersStore } from '../../store';
import './MembersModal.scss';

interface MembersModalProps {
  currentMemberIds?: string[];
  ownerId: string;
  onSave: (memberIds: string[]) => Promise<void>;
  onClose: () => void;
}

const MembersModal: React.FC<MembersModalProps> = ({ currentMemberIds, ownerId, onSave, onClose }) => {
  const users = useUsersStore((s) => s.users);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Filter out the owner from the users list
  const availableMembers = users.filter(user => user._id !== ownerId);

  useEffect(() => {
    setSelectedMembers(currentMemberIds || []);
  }, [currentMemberIds]);

  const handleToggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    await onSave(selectedMembers);
  };

  const handleClose = () => {
    setSelectedMembers([]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3>Manage Board Members</h3>
        
        <div className="form-group">
          <label>Members</label>
          <div className="members-list">
            {availableMembers.length === 0 ? (
              <p className="no-users">No other users available</p>
            ) : (
              availableMembers.map((user) => (
                <label key={user._id} className="member-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleToggleMember(user._id)}
                  />
                  <span>{user.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            Save Members
          </button>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
