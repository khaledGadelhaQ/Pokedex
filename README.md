# Pokédex Full-Stack Application

A modern, full-stack Pokédex application for the original 151 Pokémon, built with Nest.js backend and Vue.js frontend in a monorepo architecture.

## 🚀 Tech Stack

### Backend
- **Framework:** Nest.js (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Jest (Unit & E2E)
- **Validation:** class-validator & class-transformer
- **Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** Vue.js 3 (TypeScript)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

### Infrastructure
- **Monorepo:** pnpm workspaces
- **Containerization:** Docker & Docker Compose
- **Version Control:** Git

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Docker & Docker Compose (for containerized setup)

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Pokedex
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Backend Setup

```bash
cd apps/backend

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 4. Database Setup (Coming in Step 2)

```bash
# Initialize Prisma
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed the database
pnpm prisma db seed
```

## 🏃 Running the Application

### Development Mode

From the root directory:

```bash
# Run backend
pnpm backend:dev

# Run frontend (when available)
pnpm frontend:dev
```

Or run from individual app directories:

```bash
# Backend
cd apps/backend
pnpm dev

# Frontend
cd apps/frontend
pnpm dev
```

### Production Mode

```bash
# Build backend
pnpm backend:build

# Start backend in production
pnpm backend:start:prod
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## 🧪 Testing

```bash
# Backend unit tests
pnpm backend:test

# Backend e2e tests
pnpm backend:test:e2e

# Backend test coverage
pnpm backend:test:cov
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

## 📁 Project Structure

```
Pokedex/
├── apps/
│   ├── backend/              # Nest.js backend application
│   │   ├── src/
│   │   │   ├── pokemons/     # Pokemon module
│   │   │   ├── teams/        # Team module
│   │   │   ├── search/       # Search module
│   │   │   └── main.ts       # Application entry point
│   │   ├── prisma/           # Database schema & migrations
│   │   ├── test/             # E2E tests
│   │   └── package.json
│   │
│   └── frontend/             # Vue.js frontend application (WIP)
│       ├── src/
│       ├── public/
│       └── package.json
│
├── pnpm-workspace.yaml       # pnpm workspace configuration
├── package.json              # Root package.json
├── docker-compose.yml        # Docker services configuration
└── README.md                 # This file
```

## 🎯 Development Roadmap

### ✅ Step 1: Project Initialization & Monorepo Setup
- [x] Initialize Git repository
- [x] Set up pnpm workspace
- [x] Scaffold Nest.js backend
- [x] Configure environment variables
- [x] Set up API prefix and CORS

### 🔄 Step 2: Database & Prisma Setup (Next)
- [ ] Install Prisma dependencies
- [ ] Initialize Prisma
- [ ] Define Pokemon & Team models
- [ ] Run initial migration

### 📝 Step 3: Module & CRUD Logic
- [ ] Implement Pokemon module (GET endpoints)
- [ ] Implement Team module (full CRUD)
- [ ] Implement Search functionality

### 🌱 Step 4: Data Seeding
- [ ] Create seed script
- [ ] Parse and transform pokemons.json
- [ ] Seed database with initial data

### 📁 Step 5: File Uploads
- [ ] Configure Multer for local file storage
- [ ] Implement image upload endpoints
- [ ] Handle sprite uploads

### 🧪 Step 6: Testing & Documentation
- [ ] Write unit tests for services
- [ ] Write e2e tests for controllers
- [ ] Set up Swagger documentation

### 🐳 Step 7: Dockerization
- [ ] Create Dockerfile for backend
- [ ] Create docker-compose.yml
- [ ] Configure PostgreSQL container

### 🎨 Step 8: Frontend Development
- [ ] Set up Vue.js project
- [ ] Implement responsive UI (mobile & tablet)
- [ ] Connect to backend API
- [ ] Implement routing
- [ ] Add state management

## 📝 License

MIT
