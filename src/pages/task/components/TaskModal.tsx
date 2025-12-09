import React, { useState, useEffect } from 'react';
import { TaskStatus } from '../../../types';
import { useUsersStore } from '../../../store';
import './TaskModal.scss';

interface TaskModalProps {
  task?: { _id: string; title: string; status: string; description?: string; assigneeId?: string } | null;
  onSave: (title: string, status: TaskStatus, description: string, assigneeId?: string) => Promise<void>;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const users = useUsersStore((s) => s.users);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskAssignee, setTaskAssignee] = useState<string>('');

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskStatus(task.status as TaskStatus);
      setTaskDescription(task.description || '');
      setTaskAssignee(task.assigneeId || '');
    } else {
      setTaskTitle('');
      setTaskStatus('todo');
      setTaskDescription('');
      setTaskAssignee('');
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskTitle.trim()) return;

    await onSave(taskTitle, taskStatus, taskDescription, taskAssignee || undefined);
  };

  const handleClose = () => {
    setTaskTitle('');
    setTaskStatus('todo');
    setTaskDescription('');
    setTaskAssignee('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Task description (optional)"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label>Assignee</label>
          <select
            value={taskAssignee}
            onChange={(e) => setTaskAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            {task ? 'Update Task' : 'Save Task'}
          </button>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
