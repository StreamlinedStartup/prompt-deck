# Prompt Library - Full Stack Application

This application provides a web interface to store, organize, and use LLM (Large Language Model) prompts with support for variable substitution. It's built using React (TypeScript, TailwindCSS) for the frontend and Node.js (Express, MongoDB) for the backend.

## Features

*   **Prompt Management:** Create, Read, Update, Delete (CRUD) prompts.
*   **Organization:** Organize prompts into folders/collections and assign tags.
*   **Variable Substitution:** Define variables in prompts using `{{variable_name}}` format. A modal helps fill in variables and copies the final prompt.
*   **Markdown Support:** Write prompt content using Markdown for formatting.
*   **Filtering & Search:** Filter prompts by folder, tag, or search term.
*   **Responsive UI:** Interface adapts to different screen sizes using TailwindCSS.
*   **RESTful API:** Backend provides a clean API for managing data.

## Tech Stack

*   **Frontend:**
    *   React 18
    *   TypeScript
    *   Vite
    *   TailwindCSS
    *   Axios (for API calls)
    *   React Select (for tag/folder selection)
    *   React Markdown (for rendering markdown)
    *   Lucide React (for icons)
    *   React Hot Toast (for notifications)
*   **Backend:**
    *   Node.js
    *   Express
    *   TypeScript
    *   MongoDB (with Mongoose ODM)
    *   dotenv (for environment variables)
    *   cors
*   **Development:**
    *   `concurrently` (to run frontend and backend together)
    *   `nodemon` (for backend auto-reloading)
    *   ESLint

## Project Structure

prompt-library/
├── client/ # React Frontend (Vite)
├── server/ # Node.js Backend (Express)
├── .gitignore
├── package.json # Root package for concurrent execution
└── README.md

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   MongoDB (running locally or a connection string for a cloud instance like MongoDB Atlas)

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd prompt-library
    ```

2.  **Install Dependencies:**
    Install dependencies for the root, client, and server projects.
    ```bash
    npm run install:all
    # or
    # npm install
    # npm install --prefix client
    # npm install --prefix server
    ```

3.  **Backend Configuration (`server/.env`):**
    *   Navigate to the `server` directory: `cd server`
    *   Create a `.env` file by copying the example: `cp .env.example .env`
    *   Edit the `.env` file and set your `MONGODB_URI`.
        *   For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/prompt_library`
        *   For MongoDB Atlas: Use the connection string provided by Atlas.
    *   You can adjust `PORT` (default: 5000) and `CLIENT_URL` (default: `http://localhost:5173`) if needed.
    *   Go back to the root directory: `cd ..`

4.  **Frontend Configuration (Optional):**
    *   The frontend uses Vite's proxy feature (`client/vite.config.ts`) to forward `/api` requests to the backend (defaulting to `http://localhost:5000`). If your backend runs on a different port, update the `target` in `vite.config.ts`.

## Running the Application

**Development Mode (Recommended):**

This command uses `concurrently` to start both the backend (with `nodemon` for auto-restarts) and the frontend (Vite dev server) simultaneously.

```bash
npm run dev