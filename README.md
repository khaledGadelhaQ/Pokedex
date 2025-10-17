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

### 4. Database Setup

#### Using Docker (Recommended)

```bash
# Start PostgreSQL container (requires sudo)
sudo docker-compose up -d

# Generate Prisma Client
cd apps/backend
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed the database with 151 Pokemon
pnpm seed
```

#### PostgreSQL Details
- **Host:** localhost
- **Port:** 5433 (to avoid conflict with local PostgreSQL)
- **Database:** pokedex
- **User:** postgres
- **Password:** postgres

### 5. Visualize Database (Optional)

```bash
cd apps/backend
npx prisma studio
# Opens at http://localhost:5555
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

## 🗄️ Database Management

### Seed Database
```bash
# Seed all 151 Pokemon from pokemons.json
pnpm backend:seed
```

### Import Individual Pokemon
```bash
# Import by ID or name from PokeAPI
pnpm backend:import-pokemon <id or name>

# Examples:
pnpm backend:import-pokemon 25        # Import Pikachu
pnpm backend:import-pokemon charizard # Import Charizard
```

### Visualize Database
```bash
cd apps/backend
npx prisma studio
# Opens Prisma Studio at http://localhost:5555
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`

## 📁 Project Structure

```
Pokedex/
├── apps/
│   ├── backend/                    # Nest.js backend application
│   │   ├── src/
│   │   │   ├── config/             # Configuration module
│   │   │   ├── prisma/             # Prisma module & service
│   │   │   ├── app.module.ts       # Root module
│   │   │   └── main.ts             # Application entry point
│   │   ├── prisma/
│   │   │   ├── migrations/         # Database migrations
│   │   │   ├── schema.prisma       # Database schema
│   │   │   ├── seed.ts             # Seed script for 151 Pokemon
│   │   │   └── import-pokemon.ts   # Import individual Pokemon from PokeAPI
│   │   ├── .env.development        # Development environment
│   │   ├── .env.production         # Production environment
│   │   ├── .env.test               # Test environment
│   │   └── package.json
│   │
│   └── frontend/                   # Vue.js frontend (Coming Soon)
│
├── pnpm-workspace.yaml             # pnpm workspace configuration
├── package.json                    # Root package.json
├── docker-compose.yml              # PostgreSQL container
└── README.md                       # This file
```

## 🎯 Backend Development Roadmap

### ✅ Step 1: Project Initialization & Monorepo Setup
- [x] Initialize Git repository
- [x] Set up pnpm workspace
- [x] Scaffold Nest.js backend
- [x] Configure environment variables
- [x] Set up API prefix and CORS

### ✅ Step 2: Database & Prisma Setup
- [x] Install Prisma dependencies
- [x] Initialize Prisma
- [x] Define Pokemon, Team, and User models
- [x] Run initial migration
- [x] Create PrismaModule and PrismaService
- [x] Configure Docker PostgreSQL with docker-compose

### ✅ Step 4: Data Seeding (Completed Early)
- [x] Create seed script for 151 Pokemon
- [x] Parse and transform pokemons.json
- [x] Seed database with initial data
- [x] Create import command for individual Pokemon from PokeAPI

### 🔄 Step 3: Module & CRUD Logic (In Progress)
- [ ] Implement Pokemon module (GET endpoints)
- [ ] Implement Team module (full CRUD)
- [ ] Implement Search functionality
- [ ] Create DTOs matching OpenAPI spec

### 📁 Step 5: File Uploads (Coming Soon)
- [ ] Configure Multer for local file storage
- [ ] Implement image upload endpoints
- [ ] Handle sprite uploads

### 🧪 Step 6: Testing & Documentation (Coming Soon)
- [ ] Write unit tests for services
- [ ] Write e2e tests for controllers
- [ ] Set up Swagger documentation

### 🐳 Step 7: Dockerization (Coming Soon)
- [ ] Create Dockerfile for backend
- [ ] Update docker-compose.yml for full stack
- [ ] Configure production environment

## 🎨 Frontend Development Roadmap

Coming soon! The frontend will be built with Vue.js 3, TypeScript, and Tailwind CSS.

## 📝 License

MIT
