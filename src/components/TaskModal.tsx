import React, { useState, useEffect } from 'react';
import { TaskStatus, TASK_STATUS, TASK_STATUS_LABELS } from '../types';
import './TaskModal.scss';

interface TaskModalProps {
  task?: { _id: string; title: string; status: string } | null;
  onSave: (title: string, status: TaskStatus) => Promise<void>;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TASK_STATUS.TODO);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskStatus(task.status as TaskStatus);
    } else {
      setTaskTitle('');
      setTaskStatus(TASK_STATUS.TODO);
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskTitle.trim()) return;

    await onSave(taskTitle, taskStatus);
  };

  const handleClose = () => {
    setTaskTitle('');
    setTaskStatus(TASK_STATUS.TODO);
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
          <option value={TASK_STATUS.TODO}>{TASK_STATUS_LABELS[TASK_STATUS.TODO]}</option>
          <option value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS]}</option>
          <option value={TASK_STATUS.DONE}>{TASK_STATUS_LABELS[TASK_STATUS.DONE]}</option>
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
