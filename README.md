# Brighte Eats – Expressions of Interest API

## Project Overview

This project provides a backend system for collecting and viewing expressions of interest for a new product called **Brighte Eats**.

Customers can register their interest by providing basic contact details and selecting which Brighte Eats services they are interested in:
- Delivery
- Pick-up
- Payment

The system exposes a **GraphQL API** for registering leads and querying them via a dashboard. An optional frontend is included to demonstrate end-to-end usage.

---

## Requirements Summary

The system fulfills the following requirements:

- Relational database for persistent storage
- GraphQL API built with TypeScript running on Node.js
- One mutation:
  - `register` – registers a lead with name, email, mobile, postcode, and selected services
- Two queries:
  - `leads` – retrieves all registered leads
  - `lead` – retrieves a single lead by ID
- Ability to store multiple service interests per lead
- Unit tests for core functionality
- Clear setup instructions and runnable locally

---

## Tech Stack

### Backend
- Node.js
- TypeScript
- Apollo Server (GraphQL)
- Prisma ORM
- Jest (unit testing)

### Database
- PostgreSQL (Dockerized for local development)

### Frontend (Optional)
- React
- TypeScript

### Tooling
- Docker & Docker Compose
- npm