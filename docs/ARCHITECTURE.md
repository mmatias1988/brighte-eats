# Brighte Eats - Architecture Documentation

This document provides a comprehensive overview of the Brighte Eats project architecture, design decisions, file structure, and trade-offs.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [System Architecture](#system-architecture)
3. [File Structure](#file-structure)
4. [Design Patterns](#design-patterns)
5. [Technology Stack Rationale](#technology-stack-rationale)
6. [Pros and Cons](#pros-and-cons)
7. [Scalability Considerations](#scalability-considerations)

---

## Architecture Overview

Brighte Eats follows a **modular, layered architecture** with clear separation of concerns. The system is built using:

- **Backend**: Node.js with TypeScript, Apollo Server (GraphQL), and Prisma ORM
- **Database**: PostgreSQL (containerized with Docker)
- **Frontend**: React with TypeScript and Apollo Client
- **Testing**: Jest with 100% test coverage

The architecture emphasizes:
- **Separation of Concerns**: Clear boundaries between layers (API, Business Logic, Data Access)
- **Modularity**: Feature-based module organization
- **Type Safety**: Full TypeScript coverage
- **Testability**: Comprehensive unit tests for all layers

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React Client  │
│  (Frontend)     │
└────────┬────────┘
         │ GraphQL
         │ (HTTP)
         ▼
┌─────────────────┐
│  Apollo Server  │
│  (GraphQL API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service Layer  │
│ (Business Logic)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Repository Layer│
│  (Data Access)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

### Request Flow

1. **Client Request**: Frontend sends GraphQL query/mutation via Apollo Client
2. **GraphQL Resolver**: Apollo Server routes to appropriate resolver
3. **Service Layer**: Business logic validation and orchestration
4. **Repository Layer**: Data access operations via Prisma
5. **Database**: PostgreSQL executes queries
6. **Response**: Data flows back through layers to client

---

## File Structure

### Root Directory

```
brighte-eats/
├── src/                    # Backend source code
│   ├── index.ts           # Application entry point
│   ├── lib/               # Shared utilities
│   │   └── prisma.ts      # Prisma client singleton
│   └── modules/           # Feature modules
│       └── leads/         # Leads feature module
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── graphql/       # GraphQL queries
│   │   └── types.ts       # TypeScript types
│   └── package.json
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docs/                  # Documentation
│   ├── SETUP.md
│   ├── TESTING.md
│   └── ARCHITECTURE.md
├── coverage/              # Test coverage reports
├── docker-compose.yaml    # Docker services configuration
├── package.json           # Backend dependencies
└── tsconfig.json          # TypeScript configuration
```

### Backend Module Structure (`src/modules/leads/`)

Each feature module follows a consistent structure:

```
leads/
├── __tests__/             # Unit tests
│   ├── errors.test.ts
│   ├── repository.test.ts
│   ├── resolvers.test.ts
│   ├── service.test.ts
│   ├── typeDefs.test.ts
│   └── validator.test.ts
├── errors.ts              # Custom error classes
├── index.ts               # Public API exports
├── repository.ts          # Data access layer
├── resolvers.ts           # GraphQL resolvers
├── service.ts             # Business logic layer
├── typeDefs.ts            # GraphQL schema definitions
├── types.ts               # TypeScript type definitions
└── validator.ts           # Input validation logic
```

### Layer Responsibilities

#### 1. **GraphQL Layer** (`resolvers.ts`, `typeDefs.ts`)
- **Purpose**: API contract definition and request handling
- **Responsibilities**:
  - Define GraphQL schema (types, queries, mutations)
  - Map GraphQL operations to service methods
  - Handle GraphQL-specific concerns (scalars, errors)

#### 2. **Service Layer** (`service.ts`)
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Coordinate between validators and repositories
  - Enforce business rules (e.g., duplicate email check)
  - Transform data between layers
  - Error handling and custom exceptions

#### 3. **Repository Layer** (`repository.ts`)
- **Purpose**: Data access abstraction
- **Responsibilities**:
  - Database operations via Prisma
  - Query optimization
  - Data mapping between database and domain models

#### 4. **Validation Layer** (`validator.ts`)
- **Purpose**: Input validation
- **Responsibilities**:
  - Validate user input
  - Sanitize data
  - Return structured validation errors

#### 5. **Error Handling** (`errors.ts`)
- **Purpose**: Custom error types
- **Responsibilities**:
  - Domain-specific error classes
  - Consistent error messaging
  - Error categorization

---

## Design Patterns

### 1. **Layered Architecture**

The application follows a strict layered architecture:

```
┌─────────────────────┐
│   Presentation      │  GraphQL Resolvers
├─────────────────────┤
│   Application       │  Service Layer
├─────────────────────┤
│   Domain            │  Business Logic
├─────────────────────┤
│   Infrastructure    │  Repository, Prisma
└─────────────────────┘
```

**Benefits**:
- Clear separation of concerns
- Easy to test each layer independently
- Maintainable and scalable

### 2. **Repository Pattern**

The `LeadRepository` class abstracts database operations:

```typescript
class LeadRepository {
  async create(data): Promise<LeadWithServices>
  async findAll(options): Promise<LeadWithServices[]>
  async findById(id): Promise<LeadWithServices | null>
  async findByEmail(email): Promise<Lead | null>
}
```

**Benefits**:
- Decouples business logic from database implementation
- Easy to swap database providers
- Simplifies testing with mock repositories

### 3. **Service Pattern**

The `LeadService` class encapsulates business logic:

```typescript
class LeadService {
  async createLead(input): Promise<LeadWithServices>
  async getLeads(options): Promise<LeadWithServices[]>
  async getLeadById(id): Promise<LeadWithServices>
}
```

**Benefits**:
- Centralized business rules
- Reusable across different interfaces (GraphQL, REST, etc.)
- Transaction management

### 4. **Module Pattern**

Features are organized as self-contained modules:

- Each module exports only what's needed (`index.ts`)
- Modules are independent and can be developed/tested separately
- Clear public API boundaries

### 5. **Dependency Injection**

Services and repositories accept dependencies via constructor:

```typescript
constructor(client: PrismaClient = prisma) {
  this.repository = new LeadRepository(client);
}
```

**Benefits**:
- Easy to mock for testing
- Flexible dependency management
- Loose coupling

---

## Technology Stack Rationale

### Backend Technologies

#### **Node.js + TypeScript**
- **Why**: Type safety, modern JavaScript features, large ecosystem
- **Trade-off**: Compilation step adds complexity but catches errors early

#### **Apollo Server (GraphQL)**
- **Why**: 
  - Flexible querying (fetch only needed data)
  - Strong typing with schema
  - Single endpoint for all operations
  - Built-in introspection and playground
- **Trade-off**: Learning curve, potential over-fetching if not careful

#### **Prisma ORM**
- **Why**:
  - Type-safe database queries
  - Automatic migrations
  - Excellent developer experience
  - Strong TypeScript integration
- **Trade-off**: Vendor lock-in, but provides excellent DX

#### **PostgreSQL**
- **Why**:
  - Robust relational database
  - ACID compliance
  - Excellent for structured data
  - Strong ecosystem
- **Trade-off**: Requires more setup than NoSQL, but provides data integrity

### Frontend Technologies

#### **React + TypeScript**
- **Why**: Component-based, type-safe, large community
- **Trade-off**: More boilerplate than vanilla JS, but better maintainability

#### **Apollo Client**
- **Why**: 
  - Seamless GraphQL integration
  - Built-in caching
  - Type generation from schema
- **Trade-off**: Additional bundle size, but simplifies data fetching

#### **Vite**
- **Why**: Fast development server, modern build tool
- **Trade-off**: Newer tool, but excellent performance

### Testing

#### **Jest**
- **Why**: 
  - Comprehensive testing framework
  - Built-in mocking
  - Coverage reporting
  - TypeScript support via ts-jest
- **Trade-off**: Can be slower than alternatives, but feature-rich

---

## Pros and Cons

### Pros ✅

#### **Architecture & Design**
1. **Clear Separation of Concerns**
   - Each layer has a single responsibility
   - Easy to understand and maintain
   - Changes in one layer don't affect others

2. **Type Safety**
   - Full TypeScript coverage
   - Compile-time error detection
   - Better IDE support and autocomplete

3. **Testability**
   - 100% test coverage
   - Each layer can be tested independently
   - Easy to mock dependencies

4. **Modularity**
   - Feature-based organization
   - Easy to add new features
   - Modules can be developed in parallel

5. **GraphQL Benefits**
   - Flexible data fetching
   - Strong typing with schema
   - Single endpoint
   - Built-in documentation (introspection)

6. **Developer Experience**
   - Prisma provides excellent DX
   - Type-safe database queries
   - Automatic migrations
   - Hot reload in development

7. **Scalability**
   - Easy to add new modules
   - Repository pattern allows database scaling
   - GraphQL can be optimized with DataLoader

### Cons ❌

#### **Complexity**
1. **Learning Curve**
   - Multiple technologies to learn (GraphQL, Prisma, TypeScript)
   - Layered architecture requires understanding of patterns
   - More setup than simple REST API

2. **Over-Engineering for Small Projects**
   - Full layered architecture might be overkill for very simple CRUD
   - More files and boilerplate than minimal solutions

3. **GraphQL Complexity**
   - N+1 query problems (though solvable with DataLoader)
   - Caching can be more complex than REST
   - Requires understanding of resolver patterns

#### **Technology-Specific**
4. **Prisma Limitations**
   - Vendor lock-in to Prisma
   - Some advanced SQL features not directly supported
   - Migration complexity for complex schemas

5. **TypeScript Compilation**
   - Build step required
   - Slightly slower development iteration
   - More complex build configuration

6. **Docker Dependency**
   - Requires Docker for local development
   - Additional resource usage
   - Platform-specific setup (WSL on Windows)

#### **Performance**
7. **GraphQL Overhead**
   - Query parsing overhead
   - Potential for over-fetching if not careful
   - More complex than simple REST endpoints

8. **No Built-in Caching**
   - GraphQL doesn't have HTTP caching like REST
   - Requires custom caching strategies
   - Apollo Client caching helps but needs configuration

#### **Testing**
9. **Test Setup Complexity**
   - Multiple layers to test
   - Requires mocking Prisma client
   - More test files to maintain

---

## Scalability Considerations

### Current Architecture Strengths

1. **Horizontal Scaling**
   - Stateless GraphQL server can be scaled horizontally
   - Database connection pooling via Prisma
   - Frontend can be served via CDN

2. **Database Scaling**
   - Repository pattern allows easy database sharding
   - PostgreSQL supports read replicas
   - Prisma can be configured for connection pooling

3. **Module Expansion**
   - Easy to add new feature modules
   - Modules don't interfere with each other
   - Clear boundaries for team collaboration

### Potential Improvements for Scale

1. **Caching Layer**
   - Add Redis for query caching
   - Implement DataLoader for N+1 query prevention
   - Cache frequently accessed data

2. **API Gateway**
   - Add rate limiting
   - Request validation middleware
   - Authentication/authorization layer

3. **Monitoring & Observability**
   - Add logging (Winston, Pino)
   - APM tools (New Relic, Datadog)
   - Error tracking (Sentry)

4. **Database Optimization**
   - Add database indexes for common queries
   - Implement pagination for large datasets
   - Consider read replicas for read-heavy workloads

5. **GraphQL Optimizations**
   - Implement DataLoader for batch loading
   - Add query complexity analysis
   - Implement field-level permissions

6. **Microservices Migration**
   - Current monolith can be split into services
   - Each module could become a microservice
   - Requires API gateway and service discovery

---

## Conclusion

The Brighte Eats architecture is designed for **maintainability, type safety, and testability**. While it may seem complex for a simple CRUD application, the layered architecture and modular design provide:

- **Long-term maintainability**: Easy to understand and modify
- **Team collaboration**: Clear boundaries for parallel development
- **Quality assurance**: Comprehensive testing at every layer
- **Scalability path**: Architecture supports growth

The trade-offs (complexity, learning curve) are justified by the benefits of a well-structured, maintainable codebase that can evolve with the project's needs.

---

## Related Documentation

- [Setup Guide](SETUP.md) - How to set up the development environment
- [Testing Guide](TESTING.md) - Testing strategies and practices
- [Main README](../README.md) - Project overview and quick start
