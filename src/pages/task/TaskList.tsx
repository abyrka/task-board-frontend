import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardsStore, useTasksStore, useUsersStore } from '../../store';
import { TaskStatus, TASK_STATUS_LABELS } from '../../types';
import TaskModal from './components/TaskModal';
import TaskComments from './components/TaskComments';
import './TaskList.scss';

const TaskList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boards = useBoardsStore((s) => s.boards);
  const tasks = useTasksStore((s) => s.tasks);
  const users = useUsersStore((s) => s.users);
  const fetchBoards = useBoardsStore((s) => s.fetchBoards);
  const fetchBoardTasks = useTasksStore((s) => s.fetchBoardTasks);
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);
  const loading = useTasksStore((s) => s.loading);
  const error = useTasksStore((s) => s.error);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<{ _id: string; title: string; status: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const board = boards.find((b) => b._id === id);

  useEffect(() => {
    if (id) {
      if (users.length === 0) {
        fetchUsers();
      }
      if (boards.length === 0) {
        fetchBoards().then(() => fetchBoardTasks(id));
      } else {
        fetchBoardTasks(id);
      }
    }
  }, [id, fetchBoards, fetchBoardTasks, fetchUsers, boards.length, users.length]);

  const handleSaveTask = async (title: string, status: TaskStatus) => {
    if (!id) return;

    try {
      if (editingTask) {
        await updateTask(editingTask._id, { title, status });
      } else {
        const createTask = useTasksStore.getState().createTask;
        await createTask(id, title, status);
      }
      setShowModal(false);
      setEditingTask(null);
      await fetchBoardTasks(id);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  };

  const handleEditTask = (task: { _id: string; title: string; status: string }) => {
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
      await fetchBoardTasks(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
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

      <div className="tasks-section">
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet</p>
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
                  <span className={`task-status status-${task.status}`}>
                    {TASK_STATUS_LABELS[task.status as TaskStatus]}
                  </span>
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
                {selectedTask === task._id && (
                  <div className="task-comments-wrapper">
                    <TaskComments taskId={task._id} />
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
