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
    echo -e "Backend: http://localhost:3000/api/v1"
    echo -e "Swagger: http://localhost:3000/api/docs"
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
    echo -e "${YELLOW}Building backend image...${NC}"
    sudo docker-compose build backend
    echo -e "${GREEN}✅ Build complete!${NC}"
    ;;
  
  migrate)
    echo -e "${YELLOW}Running database migrations...${NC}"
    sudo docker-compose exec backend pnpm prisma:migrate
    echo -e "${GREEN}✅ Migrations complete!${NC}"
    ;;
  
  seed)
    echo -e "${YELLOW}Seeding database...${NC}"
    sudo docker-compose exec backend pnpm seed
    echo -e "${GREEN}✅ Seeding complete!${NC}"
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
    echo "Usage: $0 {start|stop|restart|logs|build|migrate|seed|status|clean}"
    echo ""
    echo "Commands:"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - View logs (optionally specify service: logs backend)"
    echo "  build     - Build backend Docker image"
    echo "  migrate   - Run database migrations"
    echo "  seed      - Seed database with Pokemon data"
    echo "  status    - Show service status"
    echo "  clean     - Remove all containers, volumes, and images (⚠️ destructive)"
    exit 1
    ;;
esac
