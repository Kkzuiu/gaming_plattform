# 🎮 Gaming Platform

A full-stack gaming platform where users can browse games, manage their personal library, and leave reviews. Built with **Next.js** on the frontend and **Express** + **MongoDB** on the backend.

---

## Tech Stack

### Frontend


| Technology                  | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| **Next.js 16** (App Router) | React framework with server-side rendering |
| **React 19**                | UI library                                 |
| **TypeScript**              | Type-safe JavaScript                       |
| **Tailwind CSS v4**         | Utility-first CSS framework                |
| **shadcn/ui** (Radix UI)    | Accessible component primitives            |
| **Lucide React**            | Icon library                               |
| **React Hook Form + Zod**   | Form handling & validation                 |
| **Recharts**                | Data visualisation / charts                |
| **next-themes**             | Dark / light mode support                  |

### Backend


| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| **Express 5**         | Web framework for Node.js       |
| **Mongoose 9**        | MongoDB ODM                     |
| **JSON Web Tokens**   | Stateless authentication        |
| **bcryptjs**          | Password hashing                |
| **express-validator** | Request validation middleware   |
| **dotenv**            | Environment variable management |
| **CORS**              | Cross-origin resource sharing   |

### Database


| Technology  | Purpose                 |
| ----------- | ----------------------- |
| **MongoDB** | NoSQL document database |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — either installed locally or via Docker

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://git.gibb.ch/m1651/gaming-platform.git
cd gaming-platform
```

### 2. Start MongoDB

Using **Docker** (recommended):

```bash
docker run -d --name mongo -p 27017:27017 mongo
```

Or start your local MongoDB instance if installed natively.

#### Restoring the Database Backup

To replicate the existing data (games, users, and reviews) on another device, you can restore the included database backup:

```bash
mongorestore --uri="mongodb://localhost:27017/gaming-platform" --drop db-backup/gaming-platform
```

### 3. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (or use the existing one) with:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/gaming-platform
JWT_SECRET=your-secret-key
```

Start the server:

```bash
node server.js
```

The API will be available at **http://localhost:5001**.

### 4. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## Quick Start (TL;DR)

Run all three services in separate terminals:

```bash
# Terminal 1 — Database
docker run -d --name mongo -p 27017:27017 mongo

# Terminal 2 — Backend
cd backend && npm install && node server.js

# Terminal 3 — Frontend
cd frontend && npm install && npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Project Structure

```
gaming-platform/
├── backend/
│   ├── config/          # Database connection config
│   ├── controllers/     # Route handler logic
│   ├── middleware/       # Auth, error handling, validation
│   ├── models/          # Mongoose schemas (User, Game, Review)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Helper utilities
│   ├── server.js        # Entry point
│   └── API.md           # API documentation
│
├── frontend/
│   ├── app/             # Next.js App Router pages
│   │   ├── auth/        # Login & Register
│   │   ├── games/       # Game catalogue & detail pages
│   │   └── profile/     # User profile
│   ├── components/      # Reusable UI components (shadcn/ui)
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # API client & utilities
│   └── styles/          # Global styles
│
└── README.md
```

---

## API Overview


| Method   | Endpoint                        | Auth | Description              |
| -------- | ------------------------------- | ---- | ------------------------ |
| `POST`   | `/api/auth/register`            | ✗   | Register a new user      |
| `POST`   | `/api/auth/login`               | ✗   | Login & receive JWT      |
| `GET`    | `/api/users/me`                 | ✓   | Current user profile     |
| `GET`    | `/api/users/me/library`         | ✓   | User's game library      |
| `POST`   | `/api/users/me/library/:gameId` | ✓   | Add game to library      |
| `DELETE` | `/api/users/me/library/:gameId` | ✓   | Remove game from library |
| `GET`    | `/api/games`                    | ✗   | List all games           |
| `GET`    | `/api/games/:id`                | ✗   | Get game details         |
| `POST`   | `/api/games`                    | ✗   | Create a game            |
| `PUT`    | `/api/games/:id`                | ✗   | Update a game            |
| `DELETE` | `/api/games/:id`                | ✗   | Delete a game            |
| `GET`    | `/api/reviews/game/:gameId`     | ✗   | Reviews for a game       |
| `POST`   | `/api/reviews`                  | ✓   | Create a review          |
| `PUT`    | `/api/reviews/:id`              | ✓   | Update own review        |
| `DELETE` | `/api/reviews/:id`              | ✓   | Delete own review        |

> Full API documentation is available in [`backend/API.md`](backend/API.md).

---

## Environment Variables

### Backend (`backend/.env`)


| Variable     | Default                                     | Description                 |
| ------------ | ------------------------------------------- | --------------------------- |
| `PORT`       | `5001`                                      | Server port                 |
| `MONGO_URI`  | `mongodb://localhost:27017/gaming-platform` | MongoDB connection string   |
| `JWT_SECRET` | —                                          | Secret key for signing JWTs |
