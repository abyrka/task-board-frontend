export type TaskStatus = 'todo' | 'in-progress' | 'done';

export const TASK_STATUS = {
  TODO: 'todo' as TaskStatus,
  IN_PROGRESS: 'in-progress' as TaskStatus,
  DONE: 'done' as TaskStatus
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done'
};
