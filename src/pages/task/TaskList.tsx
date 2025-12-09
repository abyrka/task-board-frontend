import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardsStore, useTasksStore, useUsersStore } from '../../store';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { TaskStatus, TASK_STATUS_LABELS } from '../../types';
import TaskModal from './components/TaskModal';
import TaskComments from './components/TaskComments';
import TaskFilter from './components/TaskFilter';
import TaskHistory from './components/TaskHistory';
import { useDebounce } from '../../shared/hooks/useDebounce';
import './TaskList.scss';

const TaskList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useCurrentUser();
  const boards = useBoardsStore((s) => s.boards);
  const tasks = useTasksStore((s) => s.tasks);
  const users = useUsersStore((s) => s.users);
  const fetchBoards = useBoardsStore((s) => s.fetchBoards);
  const fetchFilteredTasks = useTasksStore((s) => s.fetchFilteredTasks);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);
  const loading = useTasksStore((s) => s.loading);
  const error = useTasksStore((s) => s.error);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<{ _id: string; title: string; status: string; description?: string; assigneeId?: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('');
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [descriptionFilter, setDescriptionFilter] = useState<string>('');

  // Debounce text filters
  const debouncedTitleFilter = useDebounce(titleFilter, 1000);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter, 1000);

  const board = boards.find((b) => b._id === id);

  useEffect(() => {
    if (id && currentUser) {
      if (users.length === 0) {
        fetchUsers();
      }
      if (boards.length === 0) {
        fetchBoards(currentUser._id).then(() => applyFilters());
      } else {
        applyFilters();
      }
    }
  }, [id, currentUser, fetchBoards, fetchUsers, boards.length, users.length]);

  useEffect(() => {
    if (id) {
      applyFilters();
    }
  }, [statusFilter, assigneeFilter, debouncedTitleFilter, debouncedDescriptionFilter]);

  const applyFilters = () => {
    if (!id) return;

    const filters: any = { boardId: id };
    if (statusFilter !== 'all') filters.status = statusFilter;
    if (assigneeFilter) filters.assigneeId = assigneeFilter;
    if (debouncedTitleFilter) filters.title = debouncedTitleFilter;
    if (debouncedDescriptionFilter) filters.description = debouncedDescriptionFilter;

    fetchFilteredTasks(filters);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setAssigneeFilter('');
    setTitleFilter('');
    setDescriptionFilter('');
  };

  const handleSaveTask = async (title: string, status: TaskStatus, description: string, assigneeId?: string) => {
    if (!id || !currentUser) return;

    try {
      if (editingTask) {
        await updateTask(editingTask._id, { title, status, description, assigneeId }, currentUser._id);
      } else {
        const createTask = useTasksStore.getState().createTask;
        await createTask(id, title, status, description, assigneeId);
      }
      setShowModal(false);
      setEditingTask(null);
      applyFilters();
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleEditTask = (task: { _id: string; title: string; status: string; description?: string; assigneeId?: string }) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?') || !id) return;

    try {
      await deleteTask(taskId);
      applyFilters();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!currentUser) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    try {
      await updateTask(taskId, { status: newStatus }, currentUser._id);
      applyFilters();
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const getOwnerName = (ownerId: string) => {
    const owner = users.find((u) => u._id === ownerId);
    return owner?.name || 'Unknown';
  };

  if (loading) return <div className="board-detail">Loading...</div>;

  if (!board) {
    return (
      <div className="board-detail">
        <p>Board not found</p>
        <Link to="/boards">← Back to Boards</Link>
      </div>
    );
  }

  return (
    <div className="board-detail">
      <h2>{board.name}</h2>
      <p className="board-info">Owner: {getOwnerName(board.ownerId)}</p>

      {error && <div className="error">{error}</div>}

      <TaskFilter
        statusFilter={statusFilter}
        assigneeFilter={assigneeFilter}
        titleFilter={titleFilter}
        descriptionFilter={descriptionFilter}
        onStatusChange={setStatusFilter}
        onAssigneeChange={setAssigneeFilter}
        onTitleChange={setTitleFilter}
        onDescriptionChange={setDescriptionFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="tasks-section">
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks found</p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li
                key={task._id}
                className={`task-item ${selectedTask === task._id ? 'active' : ''}`}
                onClick={() => setSelectedTask(selectedTask === task._id ? null : task._id)}
              >
                <div className="task-header">
                  <span className="task-title">{task.title}</span>
                  <select
                    className={`task-status-select status-${task.status}`}
                    value={task.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(task._id, e.target.value as TaskStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <div className="task-actions">
                    <button
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="task-description">
                  Description: {task.description || 'n/a'}
                </div>
                <div className="task-assignee">
                  Assigned to: {task.assigneeId ? (users.find(u => u._id === task.assigneeId)?.name || 'Unknown') : 'n/a'}
                </div>
                {selectedTask === task._id && (
                  <div className="task-comments-wrapper">
                    <TaskComments taskId={task._id} />
                    <TaskHistory taskId={task._id} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="actions">
        <Link to="/boards" >
          ← Back to Boards
        </Link>
         <Link onClick={(e) => { e.preventDefault(); handleCreateTask(); }} to="#">
          Create Task
        </Link>
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TaskList;
