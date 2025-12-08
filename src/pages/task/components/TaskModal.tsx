import React, { useState, useEffect } from 'react';
import { TaskStatus } from '../../../types';
import './TaskModal.scss';

interface TaskModalProps {
  task?: { _id: string; title: string; status: string } | null;
  onSave: (title: string, status: TaskStatus) => Promise<void>;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskStatus(task.status as TaskStatus);
    } else {
      setTaskTitle('');
      setTaskStatus('todo');
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskTitle.trim()) return;

    await onSave(taskTitle, taskStatus);
  };

  const handleClose = () => {
    setTaskTitle('');
    setTaskStatus('todo');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>×</button>
        <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
        <input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
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
