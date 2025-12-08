import React, { useEffect, useState } from 'react';
import { useBoardsStore, useUsersStore } from '../../store';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { Link } from 'react-router-dom';
import BoardModal from './components/BoardModal';
import './BoardList.scss';

const BoardList: React.FC = () => {
  const boards = useBoardsStore((s) => s.boards);
  const fetchBoards = useBoardsStore((s) => s.fetchBoards);
  const createBoard = useBoardsStore((s) => s.createBoard);
  const updateBoard = useBoardsStore((s) => s.updateBoard);
  const deleteBoard = useBoardsStore((s) => s.deleteBoard);
  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const loading = useBoardsStore((s) => s.loading);
  const error = useBoardsStore((s) => s.error);
  const { currentUser } = useCurrentUser();
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<{ _id: string; name: string } | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchBoards();
  }, [fetchUsers, fetchBoards]);

  const handleSaveBoard = async (name: string) => {
    try {
      if (editingBoard) {
        await updateBoard(editingBoard._id, name);
      } else {
        if (!currentUser) return;
        await createBoard(name, currentUser._id);
      }
      setShowModal(false);
      setEditingBoard(null);
      await fetchBoards();
    } catch (err: any) {
      console.error('Failed to save board:', err);
    }
  };

  const handleEditBoard = (board: { _id: string; name: string }) => {
    setEditingBoard(board);
    setShowModal(true);
  };

  const handleCreateBoard = () => {
    setEditingBoard(null);
    setShowModal(true);
  };

  const handleDeleteBoard = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this board?')) return;

    try {
      await deleteBoard(id);
      await fetchBoards();
    } catch (err: any) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBoard(null);
  };

  const getOwnerName = (ownerId: string) => {
    const owner = users.find((u) => u._id === ownerId);
    return owner?.name || 'Unknown';
  };

  return (
    <div className="board-list">
      <h2>Boards</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {boards.map((board) => (
          <li key={board._id}>
            <Link to={`/boards/${board._id}/tasks`} className="board-link">
              <div className="board-info-section">
                <strong>{board.name}</strong>
                <div className="board-owner">Owner: {getOwnerName(board.ownerId)}</div>
              </div>
            </Link>
            <div className="board-actions">
              <button className="btn-edit" onClick={() => handleEditBoard(board)}>Edit</button>
              <button className="btn-delete" onClick={(e) => handleDeleteBoard(board._id, e)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="actions">
        <Link to="/">← Back to Home</Link>
        <Link onClick={handleCreateBoard}>Create New Board</Link>
      </div>

      {showModal && (
        <BoardModal
          board={editingBoard}
          ownerName={currentUser?.name}
          onSave={handleSaveBoard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BoardList;
