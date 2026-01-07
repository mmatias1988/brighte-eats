# Brighte Eats - Setup Guide

This guide will walk you through setting up the entire tech stack for the Brighte Eats project from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Database Setup](#database-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Service URLs](#service-urls)

---

## Prerequisites

### 1. Install Node.js and npm

Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended).

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Docker Desktop

- **Windows/Mac**: Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Follow [Docker installation guide](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker compose version
```

### 3. Windows Subsystem for Linux (WSL) - Windows Only

If you're on Windows, enable WSL for better Docker performance:

```powershell
# Run PowerShell as Administrator
wsl --install
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

After running these commands, restart your computer.

---

## Backend Setup

### 1. Initialize Project (if starting fresh)

```bash
npm init -y
```

### 2. Install TypeScript and Development Dependencies

```bash
npm install typescript ts-node-dev @types/node --save-dev
npx tsc --init
```

### 3. Install Apollo Server and GraphQL

```bash
npm install @apollo/server graphql
```

### 4. Install Prisma ORM

```bash
npm install prisma @prisma/client
```

### 5. Install PostgreSQL Adapter

```bash
npm install @prisma/adapter-pg pg
```

### 6. Install Testing Dependencies

```bash
npm install --save-dev jest @types/jest @jest/globals ts-jest
npm install --save-dev cross-env
```

### 7. Install Additional Development Tools

```bash
npm install --save-dev dotenv tsx
```

---

## Database Setup

### 1. Create Environment File

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:<DB_PORT>/<DB_NAME>?schema=public"
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=brighte_eats
```

**Note**: Replace the placeholder values with your actual database credentials. For local development, you can use the default PostgreSQL credentials, but make sure they match your `docker-compose.yaml` configuration.

### 2. Pull PostgreSQL Image (Linux/Mac)

```bash
docker pull postgres:18
docker images postgres
```

### 3. Start Docker Containers

**Windows:**
```bash
docker compose up -d
```

**Linux/Mac:**
```bash
docker compose up
```

This will start:
- PostgreSQL database on port 5432
- Adminer (database management UI) on port 8080

### 4. View Database Logs (Optional)

```bash
docker compose logs -f db
```

### 5. Initialize Prisma Schema

```bash
# Pull existing schema from database (if database already has tables)
prisma db pull

# OR create initial migration (if starting fresh)
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React
- TypeScript
- Apollo Client
- GraphQL
- Vite

### 3. Install Additional Frontend Dependencies (if needed)

```bash
npm install @apollo/client graphql
npm install --save-dev @vitejs/plugin-react
```

---

## Running the Application

### 1. Start Database Services

Make sure Docker is running, then:

```bash
# Start services in detached mode
docker compose up -d

# To stop services
docker compose down
```

### 2. Run Database Migrations (if needed)

```bash
npx prisma migrate dev
```

### 3. Start Backend Server

From the root directory:

```bash
# Development mode (with hot reload)
npm run dev

# Production mode (after building)
npm run build
npm start
```

The GraphQL server will be available at `http://localhost:4000`

### 4. Start Frontend Development Server

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## Service URLs

Once everything is running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **GraphQL API** | http://localhost:4000 | Apollo Server GraphQL endpoint |
| **GraphQL Playground** | http://localhost:4000 | Interactive GraphQL IDE |
| **Frontend** | http://localhost:3000 | React application |
| **Adminer** | http://localhost:8080 | Database management UI |
| **PostgreSQL** | localhost:5432 | Database server (direct connection) |
| **Prisma Studio** | npx prisma studio | Database GUI (runs on port 51212) |

### Accessing Prisma Studio

To open Prisma Studio (database GUI):

```bash
npx prisma studio
```

This will open a browser window at `http://localhost:51212`

---

## Troubleshooting

### Database Connection Issues

1. **Check if Docker containers are running:**
   ```bash
   docker compose ps
   ```

2. **Check database logs:**
   ```bash
   docker compose logs -f db
   ```

3. **Verify DATABASE_URL in .env file matches docker-compose.yaml settings**

### Port Already in Use

If a port is already in use:

1. **Find the process using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :4000
   
   # Linux/Mac
   lsof -i :4000
   ```

2. **Kill the process or change the port in configuration**

### Prisma Client Not Generated

If you see Prisma client errors:

```bash
npx prisma generate
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
# Stop containers
docker compose down

# Remove volumes
docker compose down -v

# Start fresh
docker compose up -d
npx prisma migrate dev
```

---

## Quick Start Commands Summary

```bash
# 1. Start database
docker compose up -d

# 2. Run migrations
npx prisma migrate dev

# 3. Start backend (terminal 1)
npm run dev

# 4. Start frontend (terminal 2)
cd frontend && npm run dev
```

---

## Next Steps

- Read the [main README](../README.md) for project overview
- Check the GraphQL schema at `http://localhost:4000`
- Explore the API using GraphQL Playground
- Run tests: `npm test`

---

## Additional Resources

- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Docker Documentation](https://docs.docker.com/)

