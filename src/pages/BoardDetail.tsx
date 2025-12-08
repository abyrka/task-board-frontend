import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import { TaskStatus, TASK_STATUS_LABELS } from '../types';
import TaskModal from '../components/TaskModal';
import './BoardDetail.scss';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const boards = useBoardStore((s) => s.boards);
  const tasks = useBoardStore((s) => s.tasks);
  const users = useBoardStore((s) => s.users);
  const fetchBoards = useBoardStore((s) => s.fetchBoards);
  const fetchBoardTasks = useBoardStore((s) => s.fetchBoardTasks);
  const fetchUsers = useBoardStore((s) => s.fetchUsers);
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const loading = useBoardStore((s) => s.loading);
  const error = useBoardStore((s) => s.error);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<{ _id: string; title: string; status: string } | null>(null);

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
        const createTask = useBoardStore.getState().createTask;
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
              <li key={task._id} className="task-item">
                <span className="task-title">{task.title}</span>
                <span className={`task-status status-${task.status}`}>
                  {TASK_STATUS_LABELS[task.status as TaskStatus]}
                </span>
                <div className="task-actions">
                  <button className="btn-edit" onClick={() => handleEditTask(task)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
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

export default BoardDetail;
