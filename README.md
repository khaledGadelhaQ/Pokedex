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
- **Container Registry:** Multi-stage Docker builds
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
# By default, uses remote sprite URLs (fast, no downloads)
pnpm seed

# OR: Seed with downloaded images (slower, stores images locally)
SKIP_IMAGE_DOWNLOAD=false pnpm seed
```

> **Seeding Options:**
> - **Default (Fast):** `SKIP_IMAGE_DOWNLOAD=true` - Uses remote sprite URLs from PokeAPI, no local storage needed
> - **With Downloads:** `SKIP_IMAGE_DOWNLOAD=false` - Downloads and saves sprite images to `apps/backend/uploads/sprites/`, served statically at `/images/sprites/`
> 
> The `SKIP_IMAGE_DOWNLOAD` environment variable can be set in your `.env` files:
> - `.env.development` - Set to `true` for faster development
> - `.env.test` - Set to `true` for faster test runs
> - `.env.production` - Set to `false` if you want to serve images locally, or `true` if using a CDN

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

The entire stack can be run with Docker Compose:

```bash
# Start all services (PostgreSQL + Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ this will delete database data)
docker-compose down -v
```

**First time setup with Docker:**

```bash
# Start services
docker-compose up -d

# Wait for services to be healthy (check with docker-compose ps)

# Run migrations
docker-compose exec backend pnpm prisma:migrate

# Seed database (uses remote URLs by default, set in docker-compose.yml)
docker-compose exec backend pnpm seed

# OR: Seed with downloaded images
docker-compose exec backend sh -c "SKIP_IMAGE_DOWNLOAD=false pnpm seed"

# The API will be available at http://localhost:3000/api/v1
```

**Docker Services:**
- **PostgreSQL** - Available on port 5433
- **Backend API** - Available on port 3000
- **Persistent volumes** - Database and uploaded images are persisted

**Environment Variables:**
The docker-compose.yml uses production settings. To customize, create a `.env` file or modify the environment section in docker-compose.yml.

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

### Database Schema

Our database uses PostgreSQL with Prisma ORM. The schema consists of 4 main models with proper relationships:

**📊 Interactive Schema Viewer:** [View on dbdiagram.io](https://dbdiagram.io/d/Pokedex-68f2b4e42e68d21b410c4496)

**Schema Overview:**
- **Pokemon** - Stores all 151 original Pokemon with stats, abilities, types, and sprites
- **Team** - Represents a trainer's team (max 6 Pokemon)
- **User** - Trainer/user accounts
- **TeamPokemon** - Junction table for many-to-many relationship between Teams and Pokemon

**Key Relationships:**
- One Pokemon can be in many Teams (many-to-many)
- One Team can have many Pokemon (many-to-many)
- One User can have many Teams (one-to-many)
- TeamPokemon tracks position (1-6) and relationships

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

## � Authentication

Team creation and modification endpoints require authentication using a Bearer token:

**Protected Endpoints:**
- `POST /api/v1/teams` - Create a new team
- `POST /api/v1/teams/:id` - Update team Pokemon

**Token:** `pokedex-secret-token-2024`

**Usage Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/teams" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer pokedex-secret-token-2024" \
  -d '{"name": "My Team"}'
```

> **Note:** This is a development token. In production, implement proper JWT authentication.

##  API Documentation

The API is fully documented with **OpenAPI/Swagger**. Once the backend is running, access the interactive documentation:

**Swagger UI:** `http://localhost:3000/api/docs`
- Interactive API explorer
- Try out endpoints directly from the browser
- See request/response examples
- Test authentication with bearer token

**OpenAPI JSON:** `http://localhost:3000/api/docs-json`

### Features:
- ✅ All endpoints documented with examples
- ✅ Request/response schemas
- ✅ Authentication integration (test with bearer token)
- ✅ Query parameter validation
- ✅ Error responses documented

**Static Assets:**
- Pokemon sprites: `http://localhost:3000/images/sprites/{pokemonId}-{type}.png`
  - Example: `http://localhost:3000/images/sprites/25-front_default.png` (Pikachu)

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

### ✅ Step 3: Data Seeding
- [x] Create seed script for 151 Pokemon
- [x] Parse and transform pokemons.json
- [x] Seed database with initial data
- [x] Create import command for individual Pokemon from PokeAPI
- [x] Create shared PokeAPI type interfaces

### ✅ Step 4: Module & CRUD Logic
- [x] Implement Pokemon module with GET endpoints
- [x] Implement Team module with full CRUD
- [x] Create DTOs matching OpenAPI spec
- [x] Add validation with class-validator
- [x] Create database JSON type interfaces
- [x] Implement transform functions for type safety
- [x] Implement Search functionality (name & type search)
- [x] Add pagination support to Pokemon and Team endpoints

### ✅ Step 5: Authentication & Image Storage
- [x] Implement AuthGuard with hardcoded token for Team routes
- [x] Create image download utility for Pokemon sprites
- [x] Update seed script to download and save images locally
- [x] Update import-pokemon to download images
- [x] Configure static file serving for uploaded images
- [x] Store local image paths instead of external URLs
- [x] Create common folder structure (guards, filters)
- [x] Implement global exception filter with dev/prod modes

### ✅ Step 6: API Documentation
- [x] Set up Swagger/OpenAPI documentation
- [x] Document all endpoints with @ApiTags, @ApiOperation
- [x] Add request/response examples to DTOs
- [x] Document authentication with bearer token
- [x] Add query parameter validation documentation

### ✅ Step 7: Testing
- [x] Set up Jest testing framework
- [x] Write unit tests for Pokemon controller
- [x] Write unit tests for Teams controller
- [x] Write unit tests for Search controller
- [x] All unit tests passing (9 tests, 3 suites)
- [x] Write e2e tests for API endpoints
- [x] Test Pokemon endpoints (list, get by id, 404 handling)
- [x] Test Search endpoint (by name and type)
- [x] Test Team endpoints (list, create with auth)
- [x] Test authentication (valid token, invalid token, no token)
- [x] All e2e tests passing (10 tests)
- [ ] Write tests for services (optional)
- [ ] Improve test coverage (optional)

### ✅ Step 8: Dockerization
- [x] Create Dockerfile for backend
- [x] Multi-stage build for optimized image size
- [x] Update docker-compose.yml for full stack
- [x] Configure production environment variables
- [x] Add health checks for services
- [x] Set up persistent volumes for database and uploads
- [x] Create Docker network for service communication
- [x] Add .dockerignore for clean builds

## 🎨 Frontend Development Roadmap

Coming soon! The frontend will be built with Vue.js 3, TypeScript, and Tailwind CSS.

## 📝 License

MIT
