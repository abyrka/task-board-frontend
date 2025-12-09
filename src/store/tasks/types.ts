import { Comment } from '../comments/types';

export interface Task {
  _id: string;
  boardId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
  comments?: Comment[];
}
