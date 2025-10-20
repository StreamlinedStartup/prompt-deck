# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prompt Deck is a full-stack web application for managing LLM prompts with variable substitution, organization via folders/tags, and markdown support. The monorepo contains a React TypeScript frontend and Node.js Express TypeScript backend with MongoDB.

## Tech Stack

**Frontend** (`client/`):
- React 18 + TypeScript + Vite
- TailwindCSS for styling
- Axios for API calls
- React Select, React Markdown, Lucide React icons, React Hot Toast

**Backend** (`server/`):
- Node.js + Express + TypeScript
- MongoDB with Mongoose ODM
- CORS, dotenv

## Development Commands

**Setup:**
```bash
npm run install:all  # Install dependencies for root, client, and server
```

**Development:**
```bash
npm run dev  # Run both frontend and backend concurrently
# Frontend: http://localhost:5173
# Backend: http://localhost:5032
```

**Individual services:**
```bash
# Frontend only
npm run dev --prefix client

# Backend only
npm run dev --prefix server
```

**Build:**
```bash
npm run build:client  # Build frontend for production
npm run build --prefix server  # Compile TypeScript to JavaScript for backend
```

**Linting:**
```bash
npm run lint --prefix client
npm run lint --prefix server
```

**Production:**
```bash
npm run start:server  # Start compiled backend (after building)
```

## Project Structure

```
prompt-deck/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components (Layout, Sidebar, PromptCard, PromptEditor, VariableModal)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer (axios)
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── vite.config.ts    # Vite config with proxy to backend
│
└── server/               # Express backend
    ├── src/
    │   ├── config/       # Database configuration
    │   ├── models/       # Mongoose models (Prompt, Folder, Tag)
    │   ├── controllers/  # Request handlers
    │   ├── routes/       # API routes
    │   ├── middleware/   # Error handling, etc.
    │   └── server.ts     # Express app entry point
    └── .env.example      # Environment variable template
```

## Architecture

### Backend (MVC Pattern)

The backend follows a classic MVC structure:

- **Models** (`server/src/models/`): Mongoose schemas for Prompt, Folder, and Tag
  - Prompts have references to Tags (array) and Folder (optional)
  - Text search indexing on title, description, and content fields

- **Controllers** (`server/src/controllers/`): Business logic for CRUD operations

- **Routes** (`server/src/routes/`): API endpoints mounted at `/api`
  - `/api/prompts` - Prompt CRUD
  - `/api/folders` - Folder CRUD
  - `/api/tags` - Tag CRUD
  - `/api/health` - Health check

- **Entry point** (`server/src/server.ts`): Express app with CORS, JSON parsing, and error handling middleware

### Frontend

- **Component-based architecture** with a single-page layout
- **Main component**: `Layout.tsx` orchestrates Sidebar and prompt management
- **Data flow**: Components → Services → Backend API
- **API proxy**: Vite dev server proxies `/api/*` to `http://localhost:5032`

### Data Model Relationships

```
Prompt (title, content, description)
  ├── folder: ObjectId → Folder (optional)
  └── tags: ObjectId[] → Tag[] (array)

Folder (name, description)
Tag (name)
```

### Variable Substitution

Prompts support variables using `{{variable_name}}` syntax. The VariableModal component parses these and presents a UI for filling them in.

## Configuration

### Backend Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5032                                    # Backend port (note: defaults to 5000 in .env.example but 5032 in code)
MONGODB_URI=mongodb://localhost:27017/prompt_library  # Local MongoDB
# MONGODB_URI=mongodb+srv://...              # Or MongoDB Atlas
CLIENT_URL=http://localhost:5173            # Frontend URL for CORS
```

**Important**: The default PORT in the code is `5032` (see `server/src/server.ts:11`), but the `.env.example` shows `5000`. The Vite config proxies to `5032`. Ensure consistency.

### Frontend Configuration

The Vite proxy is configured in `client/vite.config.ts`. If the backend port changes from `5032`, update the `target` field in the proxy configuration.

## Docker Deployment

```bash
docker-compose up --build
```

Services:
- Frontend (Nginx): `http://localhost:8082`
- Backend: `http://localhost:5032`

**Note**: Update `MONGODB_URI` in `docker-compose.yml` with your actual MongoDB connection string before deploying.

## API Design

All API routes are prefixed with `/api` and follow RESTful conventions:

- `GET /api/prompts` - List prompts with optional filtering
- `POST /api/prompts` - Create prompt
- `GET /api/prompts/:id` - Get prompt by ID
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

Similar patterns for `/api/folders` and `/api/tags`.

## TypeScript

Both frontend and backend use TypeScript. Models define interfaces (e.g., `IPrompt`) that extend Mongoose `Document`. Frontend types mirror backend data structures but may omit database-specific fields.

## Port Inconsistency Note

There's a minor inconsistency: `server/.env.example` shows `PORT=5000`, but `server/src/server.ts` defaults to `5032`, and `client/vite.config.ts` proxies to `5032`. When working with the codebase, use `5032` as the backend port or ensure all three locations are updated together if changing the port.
