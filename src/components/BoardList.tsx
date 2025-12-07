import React, { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { Link } from 'react-router-dom';
import './BoardList.scss';

const BoardList: React.FC = () => {
  const boards = useBoardStore((s) => s.boards);
  const fetchBoards = useBoardStore((s) => s.fetchBoards);
  const loading = useBoardStore((s) => s.loading);
  const error = useBoardStore((s) => s.error);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div className="board-list">
      <h2>Boards</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {boards.map((board) => (
          <li key={board._id}>
            <Link to={`/boards/${board._id}`}>
              <strong>{board.name}</strong>
              <div className="board-owner">Owner ID: {board.ownerId}</div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="actions">
        <Link to="/">← Back to Home</Link>
        <Link to="/create-board">Create New Board</Link>
      </div>
    </div>
  );
};

export default BoardList;
