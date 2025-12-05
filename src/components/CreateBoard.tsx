import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';

const CreateBoard: React.FC = () => {
  const navigate = useNavigate();
  const createBoard = useBoardStore((s) => s.createBoard);
  const fetchUsers = useBoardStore((s) => s.fetchUsers);
  const users = useBoardStore((s) => s.users);

  const [name, setName] = useState<string>('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!users || users.length === 0) fetchUsers().catch(() => {});
  }, [fetchUsers, users]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const pickedOwner = ownerId || (users && users[0]?._id) || '';
      if (!pickedOwner) throw new Error('Please select or create a user first');
      await createBoard(name, pickedOwner);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Board</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
        <label>
          Board name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Owner
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">-- select owner --</option>
            {users && users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </label>

        <div>
          <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Board'}</button>
          <button type="button" onClick={() => navigate('/')} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {(!users || users.length === 0) && <div style={{ marginTop: 8 }}>No users found — create a user first.</div>}
      </form>
    </div>
  );
};

export default CreateBoard;
