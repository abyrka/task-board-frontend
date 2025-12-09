import { Task } from '../tasks/types';

export interface Board {
  _id: string;
  name: string;
  ownerId: string;
  memberIds?: string[];
  tasks?: Task[];
}
