import React from 'react';
import { TaskStatus } from '../../../types';
import { useUsersStore } from '../../../store';
import './TaskFilter.scss';

interface TaskFilterProps {
  statusFilter: TaskStatus | 'all';
  assigneeFilter: string;
  titleFilter: string;
  descriptionFilter: string;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onAssigneeChange: (assigneeId: string) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onClearFilters: () => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({
  statusFilter,
  assigneeFilter,
  titleFilter,
  descriptionFilter,
  onStatusChange,
  onAssigneeChange,
  onTitleChange,
  onDescriptionChange,
  onClearFilters,
}) => {
  const users = useUsersStore((s) => s.users);

  const hasActiveFilters = 
    statusFilter !== 'all' || 
    assigneeFilter !== '' || 
    titleFilter !== '' || 
    descriptionFilter !== '';

  return (
    <div className="task-filter">
      <div className="filter-row">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}>
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Assignee:</label>
          <select value={assigneeFilter} onChange={(e) => onAssigneeChange(e.target.value)}>
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Title:</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={titleFilter}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Search by description..."
            value={descriptionFilter}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <div className="filter-group">
            <button className="clear-filters" onClick={onClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
