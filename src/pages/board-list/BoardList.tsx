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
  const updateBoardMembers = useBoardsStore((s) => s.updateBoardMembers);
  const deleteBoard = useBoardsStore((s) => s.deleteBoard);
  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const loading = useBoardsStore((s) => s.loading);
  const error = useBoardsStore((s) => s.error);
  const { currentUser } = useCurrentUser();
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<{ _id: string; name: string; memberIds?: string[]; ownerId?: string } | null>(null);

  useEffect(() => {
    fetchUsers();
    if (currentUser) {
      fetchBoards(currentUser._id);
    }
  }, [fetchUsers, fetchBoards, currentUser]);

  const handleSaveBoard = async (name: string, memberIds?: string[]) => {
    try {
      if (editingBoard) {
        await updateBoard(editingBoard._id, name);
        if (memberIds) {
          await updateBoardMembers(editingBoard._id, memberIds);
        }
      } else {
        if (!currentUser) return;
        await createBoard(name, currentUser._id, memberIds);
      }
      setShowModal(false);
      setEditingBoard(null);
      if (currentUser) {
        await fetchBoards(currentUser._id);
      }
    } catch (err: any) {
      console.error('Failed to save board:', err);
    }
  };

  const handleEditBoard = (board: { _id: string; name: string; memberIds?: string[]; ownerId: string }) => {
    setEditingBoard(board);
    setShowModal(true);
  };

  const handleCreateBoard = () => {
    if (!currentUser) {
      alert('Please select a user to create a board');
      return;
    }
    setEditingBoard(null);
    setShowModal(true);
  };

  const handleDeleteBoard = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this board?')) return;

    try {
      await deleteBoard(id);
      if (currentUser) {
        await fetchBoards(currentUser._id);
      }
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

  const getMemberNames = (memberIds?: string[]) => {
    if (!memberIds || memberIds.length === 0) return 'None';
    return memberIds
      .map(id => users.find(u => u._id === id)?.name || 'Unknown')
      .join(', ');
  };

  return (
    <div className="board-list">
      <h2>Boards</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {boards.length === 0 && !loading ? (
        <p className="no-boards">No boards yet</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board._id}>
              <Link to={`/boards/${board._id}/tasks`} className="board-link">
                <div className="board-info-section">
                  <strong>{board.name}</strong>
                  <div className="board-owner">Owner: {getOwnerName(board.ownerId)}</div>
                  <div className="board-members">Members: {getMemberNames(board.memberIds)}</div>
                </div>
              </Link>
              <div className="board-actions">
                <button className="btn-edit" onClick={() => handleEditBoard(board)}>Edit</button>
                <button className="btn-delete" onClick={(e) => handleDeleteBoard(board._id, e)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="actions">
        <Link to="/">← Back to Home</Link>
        <Link 
          onClick={handleCreateBoard}
          className={!currentUser ? 'disabled' : ''}
          style={{ opacity: !currentUser ? 0.5 : 1, cursor: !currentUser ? 'not-allowed' : 'pointer' }}
        >
          Create New Board
        </Link>
      </div>

      {showModal && (
        <BoardModal
          board={editingBoard}
          ownerName={currentUser?.name}
          ownerId={currentUser?._id}
          onSave={handleSaveBoard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BoardList;
