# CEMA Health Program Management System

## Overview

CEMA Health Information Management System is a solution designed to help healthcare providers manage clients and health programs efficiently. The system enables healthcare professionals to register clients, create health programs, and enroll clients into various programs while maintaining detailed records of the same.

## Table of Contents

- [CEMA Health Program Management System](#cema-health-program-management-system)
    - [Overview](#overview)
    - [Table of Contents](#table-of-contents)
    - [Features](#features)
    - [System Architecture](#system-architecture)
        - [Architecture Diagram](#architecture-diagram)
        - [Backend Architecture](#backend-architecture)
        - [Frontend Architecture](#frontend-architecture)
    - [Tech Stack](#tech-stack)
    - [Setup & Installation](#setup--installation)
        - [Prerequisites](#prerequisites)
        - [Manual Setup](#manual-setup)
        - [Docker Setup](#docker-setup)
    - [API Documentation](#api-documentation)
    - [Project Structure](#project-structure)
    - [Submission Requirements](#submission-requirements)
    - [Development Guidelines](#development-guidelines)
    - [Testing](#testing)
    - [Security Considerations](#security-considerations)
    - [License](#license)

## Features

- **Program Management**: Create and manage health programs (TB, Malaria, HIV, etc.)
- **Client Registration**: Register new clients with detailed profiles
- **Program Enrollment**: Enroll clients in one or more health programs
- **Client Search**: Advanced search functionality to find clients quickly
- **Client Profiles**: View comprehensive client profiles including program enrollments
- **RESTful API**: Expose client profiles and other data via APIs for integration with other systems

## System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────┐     ┌─────────────────────────┐
│            frontend                 │     │                         │
│  ┌─────────────---─────────────┐    │     │     External Systems    │
│  │   Next.js                   │    │     │                         │
│  └─────────────---─────────────┘    │     └───────────┬─────────────┘
└──────────┬──────────────────────────┘                 │
           │                                            │
           ▼                                            │
┌──────────────────────────────────────────────────┐    │
│               API Layer (RESTFUL)                │◄───┘
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │    Express     │  │     REST Endpoints     │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│                 Application Layer                │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │    Services    │  │         DTOs           │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│                  Domain Layer                    │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │    Entities    │  │     Repositories       │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│             Infrastructure Layer                 │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │    Database    │  │   Repository Impl      │  │
│  └────────────────┘  └────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Backend Architecture

The system follows a **Domain-Driven Design (DDD)** approach with a layered architecture to ensure separation of concerns, maintainability, and scalability. The key reasons for choosing this architecture:

1. **Clear Boundaries**: Each domain has well-defined responsibilities
2. **Independent Evolution**: Components can evolve independently
3. **Testability**: Easy to test components in isolation
4. **Flexibility**: Easier to refactor, modify, or extend functionality

The backend is structured into the following layers:

- **API Layer**: Handles HTTP requests, routing, and authentication
- **Application Layer**: Contains services that orchestrate business operations and DTOs
- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Infrastructure Layer**: External concerns like database connections, repository implementations

### Frontend Architecture

The frontend follows Next.js's App Router architecture with organized routes for different features, reusable components, and dedicated services for API communication.

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for API routing
- **TypeORM** for database interactions
- **PostgreSQL** as the database
- **Jest** for testing

### Frontend
- **Next.js 15**
- **React 19**
- **Tailwind CSS** for styling
- **Shadcn UI** for component library
- **Zod** for validation

## Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL 14+ (if running locally)
- pnpm or npm package managers
- Docker & Docker Compose (for containerized setup)

### Manual Setup

#### Backend Setup
1. Clone the repository
```bash
git clone https://github.com/gatimugabriel/cema-health-program.git
cd cema-health-program
```

2. Set up the backend
```bash
cd backend
pnpm install # or npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection details and other configurations
```

4. Start the backend server
```bash
pnpm run dev # or npm run dev
```

The backend API will be available at `http://localhost:8080` or at the `PORT` which you set in `.env`

#### Frontend Setup
1. Navigate to the frontend directory
```bash
cd ../frontend
pnpm install # or npm install
```

2. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your API URL and other configurations
```

3. Start the frontend server
```bash
pnpm run dev # or npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Setup

1. Clone the repository
```bash
git clone https://github.com/gatimugabriel/cema-health-program.git
cd cema-health-program
```

2. Build and run with Docker Compose
```bash
docker-compose up --build
```

This will start both the frontend and backend services:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

## API Documentation

- **Postman Collection**: [View and Interact Postman Workspace](https://www.postman.com/solar-equinox-291543/cema-health-program/overview)
- or
- import [this API collection](backend/docs/postman-collection.json) collection into your workspace


[//]: # (- **Swagger Documentation**: Available at `http://localhost:8080/api-docs` when the backend is running)

For detailed API specifications, refer to the [API Documentation](backend/README.md).

## Project Structure

```
.
├── backend                 # Backend application
│   ├── src
│   │   ├── api             # API layer (controllers, routes, middleware)
│   │   ├── application     # Application services and DTOs
│   │   ├── domain          # Core business logic and entities
│   │   ├── infrastructure  # Database and external integrations
│   │   └── shared          # Shared utilities and error handlers
│   ├── test                # Test files
│   └── ...
├── frontend                # Frontend application
│   ├── app                 # Next.js App Router structure
│   ├── components          # Reusable UI components
│   ├── lib                 # Utilities and services
│   └── ...
└── ...
```

For more details on the frontend structure, refer to the [Frontend README](frontend/README.md).

## Submission Requirements

- **GitHub Repository**: [View on GitHub](https://github.com/yourusername/cema-health-program)
- **Presentation**: [View Presentation](presentation-link)
- **Demo Video**: [Watch Demo](demo-link)
- **Deployed Application**: [Live Demo](https://deployed-app-url.com)

## Development Guidelines

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write unit tests for core if not all services
- Use feature branches and pull requests for changes
- Document code with JSDoc comments
### To contribute:
- create a `fork` and start a new feature at feat/intended-feature-name

## Testing
### Backend Testing
Test files written are unit tests and integration tests(incoming). I have placed unit tests in a `___tests___` directory, in the same directory where the service or file is located. 
The main test file or root path is the integration tests. Follow the same procedure if you will contribute.
- before you begin testing, make sure you have a database with the same name as your main database but with a `_test` extention
- If your database name is `cema`, make sure to have another once called `cema_test`

```bash
cd backend
pnpm test # or npm test
```

[//]: # (### Frontend Testing)

[//]: # (```bash)

[//]: # (cd frontend)

[//]: # (pnpm test # or npm test)

[//]: # (```)

## Security Considerations

- **Authentication**: JWT-based authentication
- **Data Validation**: Input validation using Zod
- **CORS**: Configured to allow only specific origins
- **Environment Variables**: Sensitive data stored in environment variables
- **SQL Injection Protection**: Using TypeORM's parameterized queries
