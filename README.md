# Task Board Frontend

A collaborative Task Board web application built with React and TypeScript. Features board member management, task tracking with advanced filtering, inline comment editing, task history, and comprehensive CRUD operations.

## 📋 Features

- **User Management** — Create, edit, and delete users. Select active user for session context.
- **Board Management** — Create and manage boards with member collaboration. Board owners and members can view and manage tasks.
- **Board Members** — Add/remove members to boards for collaborative task management. Owner excluded from member selection.
- **Task Management** — Full CRUD operations with status tracking (To Do, In Progress, Done). Tasks include title, description, and assignee.
- **Advanced Filtering** — Filter tasks by status, assignee, title, and description with debounced text inputs.
- **Quick Status Updates** — Change task status directly from the task list with dropdown selection.
- **Task Comments** — Full CRUD operations: create, read, update (inline editing), and delete comments with user attribution.
- **Task History** — View complete history of task changes including field modifications and user who made changes.
- **History Page** — Centralized view of all task changes made by the current user.
- **Error Handling** — Global axios interceptor displays API errors to users via alerts.
- **User Context** — Session-based user selection for ownership and activity tracking.
- **Modular Architecture** — Organized page structure with component-based design and reusable components.
- **State Management** — Zustand stores for efficient state management per entity.
- **Type Safety** — Full TypeScript coverage with strict type checking.
- **Responsive Design** — Clean UI with SCSS styling and consistent design patterns.

## 🚀 Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- **Task Board API** running (see backend README)

## 📦 Installation & Setup

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
# API Backend URL
REACT_APP_API_URL=http://localhost:3001

# Development port (optional)
PORT=3002
```

**Production Example:**
```env
REACT_APP_API_URL=https://your-api.onrender.com
```
### 3. Run the application

```bash
# Development mode
npm start

# Production build
npm run build

# Serve production build locally
npm install -g serve
serve -s build -l 3002
```

The application will be available at `http://localhost:3002`

## 🗺️ Routes

- `/` — Home page with navigation
- `/users` — User management page
- `/boards` — Board list (filtered by selected user and boards where user is a member)
- `/boards/:id/tasks` — Task list for a specific board with filtering, comments, and history
- `/history` — Task history page showing all changes made by current user

## 📚 API Integration

All API calls use Axios client configured with base URL from `REACT_APP_API_URL`.

### Users API
```
GET    /users              - Fetch all users
POST   /users              - Create user
PATCH  /users/:id          - Update user
DELETE /users/:id          - Delete user
```

### Boards API
```
GET    /boards/user/:userId     - Fetch user's boards (owned + member of)
POST   /boards                  - Create board (with optional memberIds)
PATCH  /boards/:id              - Update board name
PATCH  /boards/:id/members      - Update board members
DELETE /boards/:id              - Delete board
```

### Tasks API
```
GET    /tasks?boardId=:id&status=:status&assigneeId=:id&title=:search&description=:search
       - Fetch board tasks with optional filters
POST   /tasks                   - Create task (title, status, boardId, description, assigneeId)
PATCH  /tasks/:id               - Update task (requires changedByUserId)
DELETE /tasks/:id               - Delete task
```

### Comments API
```
GET    /comments?taskId=:id     - Fetch task comments
POST   /comments                - Create comment (taskId, userId, text)
PATCH  /comments/:id            - Update comment text
DELETE /comments/:id            - Delete comment
```

### History API
```
GET    /history?taskId=:id      - Fetch task history
GET    /history/user/:userId    - Fetch user's change history
```

## 🏗️ Project Structure

```
src/
├── pages/                     # Page components
│   ├── home/                 # Home page
│   ├── board-list/           # Boards list with BoardModal
│   │   └── components/       # BoardModal
│   ├── task/                 # Task list with modals and components
│   │   └── components/       # TaskModal, TaskComments, TaskFilter, TaskHistory
│   ├── user-list/            # Users list with UserModal
│   └── history/              # Task history page
├── shared/                    # Shared utilities
│   ├── components/           # MembersModal (reusable)
│   └── hooks/                # useDebounce
├── store/                     # Zustand stores
│   ├── user/                 # Users store
│   ├── board/                # Boards store
│   ├── task/                 # Tasks store
│   ├── comments/             # Comments store
│   └── history/              # History store
├── components/                # Shared components (HamburgerMenu, UserSelector)
├── context/                   # React Context (CurrentUserContext)
├── api/                       # Axios client with error interceptor
├── types/                     # TypeScript types and enums
└── App.tsx                   # Main app & routing
```

## 🛠️ Tech Stack

- **React** 18.x
- **TypeScript** 5.x
- **Zustand** - State management
- **React Router** 6.x - Routing
- **Axios** - HTTP client
- **SCSS** - Styling

## 🧪 Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3002`

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run lint`
Runs ESLint to check code quality and style

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App configuration.

## 🔒 Business Logic

- Must select a user to create boards and tasks
- Boards show for owner and members (via memberIds)
- Board owner is automatically excluded from member selection
- Members can be managed from board list and task page
- Cannot delete user who owns boards (backend validation)
- Cannot delete board with tasks (backend validation)
- Tasks require title, status, and boardId
- Tasks can have optional description and assignee
- Task updates tracked with changedByUserId (not required on creation)
- Task status changes tracked in history
- Comments require selected user and can be edited/deleted by creator
- History shows all task changes with timestamp and user
- Task filters: status (dropdown), assignee (dropdown), title (text), description (text)
- Text filters debounced (1000ms) to prevent excessive API calls
- Task status: To Do, In Progress, Done
- Global error handling via axios interceptor

## 🎨 Key Features

### User Selection
- UserSelector dropdown in header
- Persists in CurrentUserContext
- Required for creating boards, tasks, and comments
- Tracked for task changes (changedByUserId)

### Board Members Management
- MembersModal reusable component used in BoardList and TaskList
- Select/deselect members with checkboxes
- Owner automatically excluded from member selection
- Members displayed with "Manage Members" button
- Updates via PATCH /boards/:id/members

### Task Filtering
- Status filter (dropdown: All, To Do, In Progress, Done)
- Assignee filter (dropdown: All users)
- Title filter (text input, debounced 1000ms)
- Description filter (text input, debounced 1000ms)
- Clear all filters button
- useDebounce hook prevents input focus loss

### Task Status Updates
- Dropdown selection directly in task list
- Immediate update on change
- Tracked in task history

### Comment Management
- Inline editing with Save/Cancel buttons
- Edit/Delete buttons for own comments
- Real-time updates via comments store
- User attribution displayed

### Task History
- TaskHistory component shows changes below comments
- Displays field name, old value, new value
- Shows who made the change and when
- Color-coded old/new values for clarity
- History page shows all changes by current user

### Empty States
- "No users yet" - when no users exist
- "No boards yet" - when no boards for selected user
- "No tasks found" - when filters return no results
- "No comments yet" - when task has no comments
- "No history found" - when no changes exist
- "No other users available" - when only owner exists for member selection

### Modular Architecture
Each page has its own folder with:
- Page component (PageName.tsx)
- Page styles (PageName.scss)
- Page-specific components in `components/` subfolder
- Shared components in `src/shared/components/`
- Custom hooks in `src/shared/hooks/`

### State Management
- Separate Zustand store for each entity:
  - useUsersStore (users)
  - useBoardsStore (boards, members)
  - useTasksStore (tasks with filtering)
  - useCommentsStore (comments CRUD)
  - useHistoryStore (task and user history)
- Located in `store/entity/` folders
- Each with types.ts, useEntityStore.ts, and index.ts

## 🐛 Troubleshooting

**Network Error**
- Ensure backend API is running on `http://localhost:3001`
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS enabled on backend

**"No boards yet" with existing boards**
- Select a user in UserSelector dropdown
- Boards show for owner AND members (check memberIds)
- Check browser console for API errors

**Filters not working**
- Text filters are debounced (1000ms delay)
- Check network tab for API requests with query parameters
- Ensure backend supports filtering query params

**Task history not showing**
- Verify task has been updated (changedByUserId required)
- Check GET /history?taskId=:id endpoint
- History only shows changes, not initial creation

**Comment editing issues**
- Can only edit/delete own comments
- Ensure user is selected in UserSelector
- Check userId matches comment.userId

**Members modal issues**
- Owner is automatically excluded from selection
- Ensure users exist in the system
- Check PATCH /boards/:id/members endpoint

**API errors not displaying**
- Errors shown via alert() in axios interceptor
- Check browser console for interceptor errors
- Verify error.response.data.message format from API

## 📖 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [React Router Documentation](https://reactrouter.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 📄 License

This project is MIT licensed.

---

**Built with ❤️ using React & TypeScript**
