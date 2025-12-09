import React, { useEffect, useState } from 'react';
import { useHistoryStore, useTasksStore, useUsersStore } from '../../store';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { Link } from 'react-router-dom';
import './History.scss';

const History: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const historyLogs = useHistoryStore((s) => s.historyLogs);
  const fetchUserHistory = useHistoryStore((s) => s.fetchUserHistory);
  const loading = useHistoryStore((s) => s.loading);
  const error = useHistoryStore((s) => s.error);
  const tasks = useTasksStore((s) => s.tasks);
  const users = useUsersStore((s) => s.users);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (currentUser) {
      fetchUserHistory(currentUser._id);
    }
  }, [currentUser, fetchUserHistory]);

  const getUserName = (userId?: string) => {
    if (!userId) return 'System';
    const user = users.find((u) => u._id === userId);
    return user?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFieldName = (field: string) => {
    const fieldNames: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      assigneeId: 'Assignee',
      boardId: 'Board',
    };
    return fieldNames[field] || field;
  };

  return (
    <div className="history-page">
      <h2>My History</h2>
      {!currentUser && (
        <p className="no-user-selected">Please select a user to view history.</p>
      )}

      {currentUser && (
        <p className="current-user-info">Viewing history for: <strong>{currentUser.name}</strong></p>
      )}

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Loading history...</div>}

      {!loading && historyLogs.length === 0 && currentUser ? (
        <p className="no-history">No history logs yet for this user.</p>
      ) : (
        <div className="history-list">
          {historyLogs.map((log) => (
            <div key={log._id} className="history-item">
              <div className="history-header">
                <span className="history-field">{formatFieldName(log.field)}</span>
                <span className="history-date">{formatDate(log.createdAt)}</span>
              </div>
              <div className="history-change">
                <div className="history-old">
                  <strong>Old:</strong> {log.oldValue || '(empty)'}
                </div>
                <div className="history-new">
                  <strong>New:</strong> {log.newValue || '(empty)'}
                </div>
              </div>
              <div className="history-user">
                Changed by: {getUserName(log.changedByUserId)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="actions">
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
};

export default History;
