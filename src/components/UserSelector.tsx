import React, { useEffect } from 'react';
import { useCurrentUser } from '../context/CurrentUserContext';
import { useUsersStore } from '../store';
import './UserSelector.scss';

const UserSelector: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="user-selector">
      <label>
        Current User:
        <select
          value={currentUser?._id || ''}
          onChange={(e) => {
            const user = users.find((u) => u._id === e.target.value);
            setCurrentUser(user || null);
          }}
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default UserSelector;
