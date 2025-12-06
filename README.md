## Architecture Decision: Multi-Repo

This project uses a **multi-repo** structure:

- **Frontend** (this repo): React + TypeScript + Vite
- **Backend** (separate repo): Ruby on Rails API

### Reasoning

Both monorepo and multi-repo have valid use cases. **Multi-repo** was chosen here because the benefits of isolation outweigh the coordination cost for a system with two distinct services:

1. **Separation of Concerns** — Frontend and backend are distinct bounded contexts. The frontend owns presentation and user interaction; the backend owns business logic and data persistence. Separating at the repository level enforces this boundary and prevents accidental coupling. Each repo has its own dependencies, tooling, and test frameworks.

2. **Independent Evolution** — Each repository has one reason to change. The frontend changes for UI/UX reasons; the backend changes for business logic reasons. They can be deployed, scaled, and versioned independently. The API can serve multiple clients (web, mobile) without coupling releases.

3. **Flexibility** — The frontend can be swapped or rewritten without touching the backend. No need to manage Node.js and Ruby dependencies in the same repo, avoiding conflicts and keeping each project's configuration clean.

For a small project, a monorepo could also work. However, multi-repo better reflects real-world production setups and demonstrates understanding of service-oriented architecture.

---

## Quick Start

### Prerequisites

- Node.js v18+
- Rails backend running on `http://localhost:3000`

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Run Tests

```bash
npm test
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 18 |
| Language | TypeScript |
| Build | Vite |
| Data Fetching | React Query |
| Testing | Jest + React Testing Library |

---

## Project Structure

```
src/
├── components/
│   ├── TaskList.tsx      # Main container component
│   ├── TaskForm.tsx      # Task creation form
│   ├── TaskItem.tsx      # Individual task display
│   └── ErrorMessage.tsx  # Reusable error display
├── hooks/
│   ├── useTasks.ts       # Fetches tasks (useQuery)
│   └── useCreateTask.ts  # Creates tasks (useMutation)
├── services/
│   └── api.ts            # API client
├── types/
│   └── task.ts           # TypeScript types
└── __tests__/
    ├── components/       # Component tests
    ├── hooks/            # Hook tests
    ├── services/         # API tests
    └── utils/            # Shared test utilities
```

---

## Backend API Contract

The frontend expects these endpoints from the Rails API:

### `GET /tasks`

Returns all tasks (newest first).

```json
[
  { "id": 2, "description": "Newer task", "created_at": "2024-01-02T00:00:00Z" },
  { "id": 1, "description": "Older task", "created_at": "2024-01-01T00:00:00Z" }
]
```

### `POST /tasks`

Creates a new task.

**Request:**
```json
{ "description": "Task description" }
```

**Response (201):**
```json
{ "id": 1, "description": "Task description", "created_at": "2024-01-01T00:00:00Z" }
```

**Error Response (422):**
```json
{ "errors": ["Description can't be blank"] }
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## Configuration

API base URL is configured in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000';
```

---
