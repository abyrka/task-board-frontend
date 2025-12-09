# Task Board Frontend

A Trello-like Task Board web application built with React and TypeScript. Features user management, board creation, task tracking with status updates, and real-time commenting system.

## 📋 Features

- **User Management** — Create, edit, and delete users. Select active user for session context.
- **Board Management** — Create and manage boards owned by users. User-specific board views.
- **Task Management** — Full CRUD operations with status tracking (To Do, In Progress, Done).
- **Task Comments** — Add, view, and delete comments on tasks with user attribution.
- **User Context** — Session-based user selection for ownership and activity tracking.
- **Modular Architecture** — Organized page structure with component-based design.
- **State Management** — Zustand stores for efficient state management per entity.
- **Type Safety** — Full TypeScript coverage with strict type checking.
- **Responsive Design** — Clean UI with SCSS styling.

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
- `/boards` — Board list (filtered by selected user)
- `/boards/:id/tasks` — Task list for a specific board

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
GET    /boards/user/:userId   - Fetch user's boards
POST   /boards                - Create board
PATCH  /boards/:id            - Update board
DELETE /boards/:id            - Delete board
```

### Tasks API
```
GET    /tasks?boardId=:id  - Fetch board tasks
POST   /tasks              - Create task
PATCH  /tasks/:id          - Update task
DELETE /tasks/:id          - Delete task
```

### Comments API
```
GET    /comments?taskId=:id  - Fetch task comments
POST   /comments             - Create comment
PATCH  /comments/:id         - Update comment
DELETE /comments/:id         - Delete comment
```

## 🏗️ Project Structure

```
src/
├── pages/                  # Page components
│   ├── home/              # Home page
│   ├── board-list/        # Boards list with BoardModal
│   ├── task/              # Task list with TaskModal & TaskComments
│   └── user-list/         # Users list with UserModal
├── store/                 # Zustand stores (users, board, tasks, comments)
├── components/            # Shared components (HamburgerMenu, UserSelector)
├── context/               # React Context (CurrentUserContext)
├── api/                   # Axios client
├── types/                 # TypeScript types
└── App.tsx               # Main app & routing
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

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App configuration.

## 🔒 Business Logic

- Must select a user to create boards
- Boards are filtered by selected user
- Cannot delete user who owns boards (backend validation)
- Cannot delete board with tasks (backend validation)
- Comments require selected user
- Task status: To Do, In Progress, Done

## 🎨 Key Features

### User Selection
- UserSelector dropdown in header
- Persists in CurrentUserContext
- Required for creating boards and comments

### Empty States
- "No users yet" - when no users exist
- "No boards yet" - when no boards for selected user
- "No tasks yet" - when board has no tasks
- "No comments yet" - when task has no comments

### Modular Architecture
Each page has its own folder with:
- Page component (PageName.tsx)
- Page styles (PageName.scss)
- Page-specific components in `components/` subfolder

### State Management
- Separate Zustand store for each entity (users, boards, tasks, comments)
- Located in `store/entity/` folders
- Each with types, store, and index exports

## 🐛 Troubleshooting

**Network Error**
- Ensure backend API is running on `http://localhost:3001`
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS enabled on backend

**"No boards yet" with existing boards**
- Select a user in UserSelector dropdown
- Check browser console for API errors

**Comment input closes when clicking**
- Fixed with event propagation prevention

## 📖 Learn More

## 📖 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

This project is MIT licensed.

---

**Built with ❤️ using React & TypeScript**

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
