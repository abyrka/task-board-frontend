import React, { useEffect, useState } from 'react';
import { useUsersStore } from '../../store';
import { Link } from 'react-router-dom';
import UserModal from './components/UserModal';
import './UserList.scss';

const UserList: React.FC = () => {
  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const createUser = useUsersStore((s) => s.createUser);
  const updateUser = useUsersStore((s) => s.updateUser);
  const deleteUser = useUsersStore((s) => s.deleteUser);
  const loading = useUsersStore((s) => s.loading);
  const error = useUsersStore((s) => s.error);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{ _id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (name: string, email: string) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, name, email);
      } else {
        await createUser(name, email);
      }
      setShowModal(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (err: any) {
      console.error('Failed to save user:', err);
    }
  };

  const handleEditUser = (user: { _id: string; name: string; email: string }) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="user-list">
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {users.length === 0 && !loading ? (
        <p className="no-users">No users yet</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <div className="user-info">
                <strong>{user.name}</strong>
                <div className="user-email">{user.email}</div>
              </div>
              <div className="user-actions">
                <button className="btn-edit" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="actions">
        <Link to="/">← Back to Home</Link>
        <Link onClick={handleCreateUser}>Create New User</Link>
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserList;
