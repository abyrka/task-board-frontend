import React, { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { Link } from 'react-router-dom';
import './UserList.scss';

const UserList: React.FC = () => {
  const users = useBoardStore((s) => s.users);
  const fetchUsers = useBoardStore((s) => s.fetchUsers);
  const loading = useBoardStore((s) => s.loading);
  const error = useBoardStore((s) => s.error);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="user-list">
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong>
            <div className="user-email">{user.email}</div>
          </li>
        ))}
      </ul>
      <div className="actions">
        <Link to="/">← Back to Home</Link>
        <Link to="/create-user">Create New User</Link>
      </div>
    </div>
  );
};

export default UserList;
