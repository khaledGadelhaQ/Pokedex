# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package files
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Copy entire Prisma folder (schema, seed scripts, types)
COPY apps/backend/prisma ./apps/backend/prisma

# Install all dependencies (including dev dependencies for seeding)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client in production stage
WORKDIR /app/apps/backend
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/apps/backend/dist ./dist

# Copy source files (needed for seeding with ts-node)
COPY --from=builder /app/apps/backend/src ./src

# Copy tsconfig for TypeScript module resolution
COPY --from=builder /app/apps/backend/tsconfig.json ./tsconfig.json

# Copy pokemons.json (required for seeding)
COPY pokemons.json /app/pokemons.json

# Create uploads directory
RUN mkdir -p uploads/sprites

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/pokemons', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["pnpm", "start:prod"]
