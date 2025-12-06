import React, { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { Link } from 'react-router-dom';

const BoardList: React.FC = () => {
  const boards = useBoardStore((s) => s.boards);
  const fetchBoards = useBoardStore((s) => s.fetchBoards);
  const loading = useBoardStore((s) => s.loading);
  const error = useBoardStore((s) => s.error);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Boards</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {boards.map((board) => (
          <li key={board._id}>
            <strong>{board.name}</strong> (Owner: {board.ownerId})
            {/* Add link to board details if needed */}
          </li>
        ))}
      </ul>
      <Link to="/create-board">Create New Board</Link>
    </div>
  );
};

export default BoardList;
