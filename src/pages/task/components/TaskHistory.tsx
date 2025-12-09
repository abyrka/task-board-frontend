import React, { useEffect } from 'react';
import { useHistoryStore, useUsersStore } from '../../../store';
import './TaskHistory.scss';

interface TaskHistoryProps {
  taskId: string;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ taskId }) => {
  const users = useUsersStore((s) => s.users);
  const historyLogs = useHistoryStore((s) => s.historyLogs);
  const fetchTaskHistory = useHistoryStore((s) => s.fetchTaskHistory);
  const loading = useHistoryStore((s) => s.loading);

  useEffect(() => {
    fetchTaskHistory(taskId);
  }, [taskId, fetchTaskHistory]);

  const getUserName = (userId?: string) => {
    if (!userId) return 'System';
    const user = users.find((u) => u._id === userId);
    return user?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
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
    <div className="task-history" onClick={(e) => e.stopPropagation()}>
      <h4>History ({historyLogs.length})</h4>

      {loading && <div className="loading">Loading history...</div>}

      {!loading && historyLogs.length === 0 ? (
        <p className="no-history">No history yet</p>
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
    </div>
  );
};

export default TaskHistory;
