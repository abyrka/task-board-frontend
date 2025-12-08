import React, { useState, useEffect } from 'react';
import './BoardModal.scss';

interface BoardModalProps {
  board?: { _id: string; name: string } | null;
  ownerName?: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

const BoardModal: React.FC<BoardModalProps> = ({ board, ownerName, onSave, onClose }) => {
  const [boardName, setBoardName] = useState('');

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
    } else {
      setBoardName('');
    }
  }, [board]);

  const handleSave = async () => {
    if (!boardName.trim()) return;

    await onSave(boardName);
  };

  const handleClose = () => {
    setBoardName('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3>{board ? 'Edit Board' : 'Create New Board'}</h3>
        <input
          type="text"
          placeholder="Board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        {!board && ownerName && (
          <p className="owner-info">Owner: {ownerName}</p>
        )}
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
  );
};

export default BoardModal;
