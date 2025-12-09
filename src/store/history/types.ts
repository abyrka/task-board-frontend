export interface HistoryLog {
  _id: string;
  taskId: string;
  field: string;
  oldValue?: string;
  newValue?: string;
  changedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}
