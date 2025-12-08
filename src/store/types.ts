export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  boardId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
  comments?: Comment[];
}

export interface Board {
  _id: string;
  name: string;
  ownerId: string;
  members?: string[];
  tasks?: Task[];
}

export interface BoardStore {
  loading: boolean;
  error: string | null;
}
