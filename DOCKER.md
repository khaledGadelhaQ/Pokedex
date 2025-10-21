# Docker Setup Documentation

This document explains the Docker containerization setup for the Pokédex full-stack application.

## Overview

The application is containerized using Docker Compose with three main services:
- **PostgreSQL Database** - Data persistence layer
- **NestJS Backend** - RESTful API server
- **Vue.js Frontend** - Single Page Application served via Nginx

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Network                          │
│                   (pokedex-network)                         │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Frontend   │    │   Backend    │    │  PostgreSQL  │ │
│  │   (Nginx)    │───▶│   (NestJS)   │───▶│  Database    │ │
│  │   Port 8080  │    │   Port 3000  │    │   Port 5433  │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                                                   │
└─────────┼───────────────────────────────────────────────────┘
          │
          ▼
    User Browser
```

## Docker Compose Configuration

### Services

#### 1. PostgreSQL Database (`postgres`)

**Image:** `postgres:16-alpine`

**Purpose:** Persistent data storage for Pokemon data.

**Configuration:**
- **Container Name:** `pokedex-postgres`
- **Restart Policy:** `unless-stopped`
- **Port Mapping:** `5433:5432` (external:internal)
  - Maps to 5433 externally to avoid conflicts with local PostgreSQL
- **Environment Variables:**
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=pokedex`
- **Volume:** `postgres-data:/var/lib/postgresql/data` (persistent storage)
- **Health Check:** Runs `pg_isready -U postgres` every 10 seconds
- **Network:** Connected to `pokedex-network`

#### 2. Backend API (`backend`)

**Build Context:** Root directory with `apps/backend/Dockerfile`

**Purpose:** RESTful API for Pokemon data operations.

**Configuration:**
- **Container Name:** `pokedex-backend`
- **Restart Policy:** `unless-stopped`
- **Port Mapping:** `3000:3000`
- **Dependencies:** Waits for `postgres` to be healthy before starting
- **Environment Variables:**
  - `NODE_ENV=production`
  - `PORT=3000`
  - `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pokedex?schema=public`
  - `CORS_ORIGIN=*` (allows all origins)
  - `SKIP_IMAGE_DOWNLOAD=true` (uses remote Pokemon sprite URLs)
- **Volume:** `backend-uploads:/app/apps/backend/uploads` (for local image storage if needed)
- **Health Check:** HTTP GET to `/api/v1/pokemons` every 30 seconds
- **Network:** Connected to `pokedex-network`

**Multi-Stage Build Process:**

1. **Builder Stage:**
   - Base: `node:22-alpine`
   - Installs pnpm globally
   - Copies workspace files and backend package.json
   - Installs all dependencies (including devDependencies)
   - Generates Prisma Client
   - Builds the NestJS application

2. **Production Stage:**
   - Base: `node:22-alpine`
   - Installs pnpm and all dependencies (including ts-node for seeding)
   - Generates Prisma Client
   - Copies compiled application, source files, and pokemons.json
   - Creates uploads directory
   - Exposes port 3000
   - Runs application with `pnpm start:prod`

#### 3. Frontend App (`frontend`)

**Build Context:** Root directory with `apps/frontend/Dockerfile`

**Purpose:** Vue.js SPA served via Nginx.

**Configuration:**
- **Container Name:** `pokedex-frontend`
- **Restart Policy:** `unless-stopped`
- **Port Mapping:** `8080:80`
- **Dependencies:** Waits for `backend` to be healthy before starting
- **Environment Variables:**
  - `VITE_API_URL=http://localhost:3000` (API endpoint for frontend)
- **Health Check:** HTTP GET to `http://localhost` every 10 seconds
- **Network:** Connected to `pokedex-network`

**Multi-Stage Build Process:**

1. **Base Stage:**
   - Base: `node:22-alpine`
   - Enables corepack and activates latest pnpm

2. **Dependencies Stage:**
   - Copies workspace files and frontend package.json
   - Installs all dependencies with `pnpm install --frozen-lockfile`

3. **Build Stage:**
   - Copies node_modules from dependencies stage
   - Copies all source code
   - Builds Vue application with `pnpm build`
   - Outputs to `dist/` directory

4. **Production Stage (Nginx):**
   - Base: `nginx:alpine`
   - Copies built files to `/usr/share/nginx/html`
   - Copies custom nginx configuration
   - Exposes port 80
   - Runs nginx in foreground mode

### Volumes

- **postgres-data:** Persistent storage for PostgreSQL database
- **backend-uploads:** Storage for uploaded/downloaded Pokemon sprites (optional)

### Network

**Name:** `pokedex-network`  
**Driver:** `bridge`

All services communicate through this isolated network using service names as hostnames.

## Nginx Configuration

The frontend uses a custom Nginx configuration (`apps/frontend/nginx.conf`) for:

### 1. Static File Serving
```nginx
root /usr/share/nginx/html;
index index.html;
```
Serves the built Vue.js application from the nginx html directory.

### 2. API Proxy
```nginx
location /api {
    proxy_pass http://backend:3000;
    # ... proxy headers
}
```
Forwards all `/api/*` requests to the backend container using Docker's internal network.

**Key Proxy Headers:**
- `X-Real-IP`: Client's real IP address
- `X-Forwarded-For`: Complete forwarding chain
- `X-Forwarded-Proto`: Original request protocol (http/https)
- `Host`: Original host header
- Upgrade headers for WebSocket support

### 3. SPA Routing
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
Ensures all routes fallback to `index.html` for Vue Router to handle client-side navigation.

### 4. Performance Optimizations

**Gzip Compression:**
- Enabled for text, CSS, JavaScript, JSON, XML
- Minimum file size: 1024 bytes
- Varies by Accept-Encoding header

**Static Asset Caching:**
- Images, fonts, CSS, JS cached for 1 year
- Cache-Control header: `public, immutable`

**Security Headers:**
- `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
- `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
- `X-XSS-Protection: 1; mode=block` (XSS protection)

## Docker Ignore

The `.dockerignore` file optimizes build context by excluding:
- `node_modules/` (installed during build)
- `.git/` (version control not needed in container)
- `dist/` and `build/` (built during Docker build)
- Environment files (`.env*`)
- Documentation files (`*.md`)
- IDE configurations (`.vscode/`, `.idea/`)
- Test files and coverage reports
- Docker files themselves
- Temporary files and logs

This reduces build context size from ~600MB to ~77MB, significantly speeding up builds.

## Usage

### Starting the Application

```bash
# Start all services in detached mode
sudo docker-compose up -d

# View logs for all services
sudo docker-compose logs -f

# View logs for specific service
sudo docker-compose logs -f frontend
```

### Initial Database Setup

After starting services for the first time:

```bash
# Wait for services to be healthy (30-60 seconds)
sudo docker-compose ps

# Seed the database with 151 Pokemon
sudo docker-compose exec backend pnpm seed

# The seed uses remote sprite URLs by default (SKIP_IMAGE_DOWNLOAD=true)
# To download sprites locally instead:
sudo docker-compose exec backend sh -c "SKIP_IMAGE_DOWNLOAD=false pnpm seed"
```

### Stopping the Application

```bash
# Stop all services (preserves data)
sudo docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
sudo docker-compose down -v
```

### Rebuilding After Code Changes

```bash
# Rebuild all services
sudo docker-compose up -d --build

# Rebuild specific service
sudo docker-compose up -d --build backend
```

## Accessing the Application

Once all services are healthy:

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000/api/v1
- **API Documentation (Swagger):** http://localhost:3000/api

## Service Dependencies

The services start in order based on health checks:

```
postgres (healthy)
    ↓
backend (depends_on postgres healthy)
    ↓
frontend (depends_on backend healthy)
```

This ensures:
1. Database is ready before backend attempts connection
2. Backend API is available before frontend starts
3. No race conditions during startup

## Health Checks

### PostgreSQL
- **Command:** `pg_isready -U postgres`
- **Interval:** 10 seconds
- **Timeout:** 5 seconds
- **Retries:** 5

### Backend
- **Command:** Node.js HTTP GET to `/api/v1/pokemons`
- **Interval:** 30 seconds
- **Timeout:** 3 seconds
- **Start Period:** 40 seconds (allows time for app initialization)
- **Retries:** 3

### Frontend
- **Command:** `wget` to `http://localhost`
- **Interval:** 10 seconds
- **Timeout:** 5 seconds
- **Start Period:** 5 seconds
- **Retries:** 5

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
sudo docker-compose logs [service-name]

# Check container status
sudo docker-compose ps
```

### Database Connection Issues

```bash
# Verify postgres is healthy
sudo docker-compose ps postgres

# Check database logs
sudo docker-compose logs postgres

# Test connection from backend
sudo docker-compose exec backend sh -c "node -e \"console.log(process.env.DATABASE_URL)\""
```

### Frontend Can't Reach Backend

1. Verify backend is healthy: `sudo docker-compose ps backend`
2. Check nginx configuration: `sudo docker-compose exec frontend cat /etc/nginx/conf.d/default.conf`
3. Test API directly: `curl http://localhost:3000/api/v1/pokemons`

### Rebuilding from Scratch

```bash
# Stop everything
sudo docker-compose down -v

# Remove images
sudo docker rmi pokedex_backend pokedex_frontend

# Rebuild
sudo docker-compose up -d --build
```

## Environment Variables

### Backend
- `NODE_ENV` - Node environment (production/development)
- `PORT` - Application port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Allowed CORS origins (* for all)
- `SKIP_IMAGE_DOWNLOAD` - Skip downloading sprites during seed (true/false)

### Frontend
- `VITE_API_URL` - Backend API endpoint URL

## Production Considerations

For production deployment:

1. **Security:**
   - Change default PostgreSQL password
   - Set specific CORS_ORIGIN instead of `*`
   - Use HTTPS with SSL certificates
   - Add rate limiting in Nginx

2. **Performance:**
   - Consider using a reverse proxy (Nginx/Traefik) in front of all services
   - Enable Nginx caching for API responses
   - Use CDN for static assets
   - Implement connection pooling for database

3. **Monitoring:**
   - Add container monitoring (Prometheus/Grafana)
   - Configure log aggregation
   - Set up alerts for health check failures

4. **Backup:**
   - Implement automated database backups
   - Use managed volumes or external storage
   - Test restore procedures regularly

## Development vs Production

**Development Mode:**
- Run services locally without Docker
- Hot-reload for frontend and backend
- Direct database access for debugging

**Production Mode (Docker):**
- Isolated containerized environment
- Optimized multi-stage builds
- Automated health checks and restarts
- Consistent deployment across environments
