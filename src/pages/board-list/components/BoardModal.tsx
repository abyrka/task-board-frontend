import React, { useState, useEffect } from 'react';
import MembersModal from '../../../shared/components/MembersModal';
import './BoardModal.scss';

interface BoardModalProps {
  board?: { _id: string; name: string; memberIds?: string[]; ownerId?: string } | null;
  ownerName?: string;
  ownerId?: string;
  onSave: (name: string, memberIds?: string[]) => Promise<void>;
  onClose: () => void;
}

const BoardModal: React.FC<BoardModalProps> = ({ board, ownerName, ownerId, onSave, onClose }) => {
  const [boardName, setBoardName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
      setSelectedMembers(board.memberIds || []);
    } else {
      setBoardName('');
      setSelectedMembers([]);
    }
  }, [board]);

  const handleSave = async () => {
    if (!boardName.trim()) return;

    await onSave(boardName, selectedMembers);
  };

  const handleSaveMembers = async (memberIds: string[]) => {
    setSelectedMembers(memberIds);
    setShowMembersModal(false);
  };

  const handleClose = () => {
    setBoardName('');
    setSelectedMembers([]);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose}>×</button>
          <h3>{board ? 'Edit Board' : 'Create New Board'}</h3>
          
          <div className="form-group">
            <label>Board Name *</label>
            <input
              type="text"
              placeholder="Board name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              autoFocus
            />
          </div>

          {!board && ownerName && (
            <p className="owner-info">Owner: {ownerName}</p>
          )}

          <div className="form-group">
            <label>Members</label>
            <button 
              type="button"
              className="btn-select-members"
              onClick={() => setShowMembersModal(true)}
            >
              Select Members ({selectedMembers.length})
            </button>
          </div>

          <div className="form-actions">
            <button className="btn-save" onClick={handleSave}>
              {board ? 'Update Board' : 'Save Board'}
            </button>
            <button className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showMembersModal && (
        <MembersModal
          currentMemberIds={selectedMembers}
          ownerId={board?.ownerId || ownerId || ''}
          onSave={handleSaveMembers}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </>
  );
};

export default BoardModal;
