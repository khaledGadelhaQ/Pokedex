#!/bin/bash

# Pokedex Docker Helper Script
# Simple commands to manage the Dockerized application

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Pokedex Docker Manager${NC}\n"

case "$1" in
  start)
    echo -e "${YELLOW}Starting all services...${NC}"
    sudo docker-compose up -d
    echo -e "${GREEN}✅ Services started!${NC}"
    echo -e "Frontend: http://localhost:8080"
    echo -e "Backend API: http://localhost:3000/api/v1"
    echo -e "API Docs: http://localhost:3000/api"
    echo -e "PostgreSQL: localhost:5433"
    ;;
  
  stop)
    echo -e "${YELLOW}Stopping all services...${NC}"
    sudo docker-compose down
    echo -e "${GREEN}✅ Services stopped!${NC}"
    ;;
  
  restart)
    echo -e "${YELLOW}Restarting all services...${NC}"
    sudo docker-compose restart
    echo -e "${GREEN}✅ Services restarted!${NC}"
    ;;
  
  logs)
    if [ -z "$2" ]; then
      sudo docker-compose logs -f
    else
      sudo docker-compose logs -f "$2"
    fi
    ;;
  
  build)
    echo -e "${YELLOW}Building images...${NC}"
    if [ -z "$2" ]; then
      sudo docker-compose build
    else
      sudo docker-compose build "$2"
    fi
    echo -e "${GREEN}✅ Build complete!${NC}"
    ;;
  
  migrate)
    echo -e "${YELLOW}Running database migrations...${NC}"
    sudo docker-compose exec backend pnpm prisma:migrate
    echo -e "${GREEN}✅ Migrations complete!${NC}"
    ;;
  
  seed)
    echo -e "${YELLOW}Seeding database with Pokemon data...${NC}"
    sudo docker-compose exec backend pnpm seed
    echo -e "${GREEN}✅ Database seeded with 151 Pokemon!${NC}"
    ;;
  
  setup)
    echo -e "${YELLOW}Setting up the application...${NC}"
    echo -e "1. Starting services..."
    sudo docker-compose up -d
    echo -e "2. Waiting for services to be healthy (30 seconds)..."
    sleep 30
    echo -e "3. Seeding database..."
    sudo docker-compose exec backend pnpm seed
    echo -e "${GREEN}✅ Setup complete!${NC}"
    echo -e "\nAccess the application:"
    echo -e "  Frontend: http://localhost:8080"
    echo -e "  Backend API: http://localhost:3000/api/v1"
    echo -e "  API Docs: http://localhost:3000/api"
    ;;
  
  status)
    echo -e "${YELLOW}Service status:${NC}"
    sudo docker-compose ps
    ;;
  
  clean)
    echo -e "${RED}⚠️  This will remove all containers, volumes, and images!${NC}"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}Cleaning up...${NC}"
      sudo docker-compose down -v --rmi all
      echo -e "${GREEN}✅ Cleanup complete!${NC}"
    else
      echo -e "${YELLOW}Cancelled.${NC}"
    fi
    ;;
  
  *)
    echo "Usage: $0 {start|stop|restart|logs|build|migrate|seed|setup|status|clean}"
    echo ""
    echo "Commands:"
    echo "  start     - Start all services (postgres, backend, frontend)"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - View logs (optionally specify service: logs backend)"
    echo "  build     - Build Docker images (optionally specify service: build frontend)"
    echo "  migrate   - Run database migrations"
    echo "  seed      - Seed database with 151 Pokemon"
    echo "  setup     - Complete first-time setup (start + seed)"
    echo "  status    - Show service status and health"
    echo "  clean     - Remove all containers, volumes, and images (⚠️ destructive)"
    echo ""
    echo "Examples:"
    echo "  $0 start                 # Start all services"
    echo "  $0 logs backend          # View backend logs"
    echo "  $0 build frontend        # Rebuild only frontend"
    echo "  $0 setup                 # First-time setup"
    exit 1
    ;;
esac
