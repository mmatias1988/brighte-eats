# GraphQL API Documentation

Complete reference for the Brighte Eats GraphQL API.

## Base URL

**Production**: `https://brighte-eats-production.up.railway.app/`  
**Local Development**: `http://localhost:4000/`

## GraphQL Playground

Apollo Server provides an interactive GraphQL playground. Navigate to the base URL in your browser to access it:
- Production: https://brighte-eats-production.up.railway.app/
- Local: http://localhost:4000/

The playground allows you to:
- Explore the schema
- Test queries and mutations
- View introspection data
- Debug API calls

---

## Schema Overview

The API supports operations for managing customer leads (expressions of interest) for Brighte Eats services.

### Types

- **Lead**: Customer expression of interest with contact details and service selections
- **LeadService**: Individual service selection with metadata
- **Service**: Enum of available service types
- **DateTime**: ISO 8601 formatted date/time scalar

---

## Queries

### Get All Leads

Retrieves all registered leads with their associated services.

**Query:**
```graphql
query GetLeads {
  leads {
    id
    name
    email
    mobile
    postcode
    services {
      id
      serviceType
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "leads": [
      {
        "id": "clx1234567890",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "mobile": "+61412345678",
        "postcode": "2000",
        "services": [
          {
            "id": "clx9876543210",
            "serviceType": "DELIVERY",
            "createdAt": "2024-01-15T10:30:00.000Z"
          },
          {
            "id": "clx9876543211",
            "serviceType": "PICKUP",
            "createdAt": "2024-01-15T10:30:00.000Z"
          }
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Example with cURL:**
```bash
curl -X POST https://brighte-eats-production.up.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { leads { id name email mobile postcode services { id serviceType createdAt } createdAt updatedAt } }"
  }'
```

---

### Get Single Lead by ID

Retrieves a specific lead by its unique identifier.

**Query:**
```graphql
query GetLead($id: ID!) {
  lead(id: $id) {
    id
    name
    email
    mobile
    postcode
    services {
      id
      serviceType
      createdAt
    }
    createdAt
    updatedAt
  }
}
```

**Variables:**
```json
{
  "id": "clx1234567890"
}
```

**Response:**
```json
{
  "data": {
    "lead": {
      "id": "clx1234567890",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "+61412345678",
      "postcode": "2000",
      "services": [
        {
          "id": "clx9876543210",
          "serviceType": "DELIVERY",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Example with cURL:**
```bash
curl -X POST https://brighte-eats-production.up.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetLead($id: ID!) { lead(id: $id) { id name email mobile postcode services { id serviceType createdAt } createdAt updatedAt } }",
    "variables": { "id": "clx1234567890" }
  }'
```

**Error Response (Lead Not Found):**
```json
{
  "errors": [
    {
      "message": "Lead with id clx1234567890 not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

---

### Health Check

Simple health check endpoint to verify API availability.

**Query:**
```graphql
query Health {
  health
}
```

**Response:**
```json
{
  "data": {
    "health": "OK"
  }
}
```

---

## Mutations

### Register Lead

Registers a new customer lead with their contact information and service interests.

**Mutation:**
```graphql
mutation RegisterLead($input: RegisterLeadInput!) {
  register(input: $input) {
    id
    name
    email
    mobile
    postcode
    services {
      id
      serviceType
      createdAt
    }
    createdAt
  }
}
```

**Variables:**
```json
{
  "input": {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "mobile": "+61498765432",
    "postcode": "3000",
    "services": ["DELIVERY", "PAYMENT"]
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "id": "clx1234567891",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "mobile": "+61498765432",
      "postcode": "3000",
      "services": [
        {
          "id": "clx9876543212",
          "serviceType": "DELIVERY",
          "createdAt": "2024-01-15T11:00:00.000Z"
        },
        {
          "id": "clx9876543213",
          "serviceType": "PAYMENT",
          "createdAt": "2024-01-15T11:00:00.000Z"
        }
      ],
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Example with cURL:**
```bash
curl -X POST https://brighte-eats-production.up.railway.app/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RegisterLead($input: RegisterLeadInput!) { register(input: $input) { id name email mobile postcode services { id serviceType createdAt } createdAt } }",
    "variables": {
      "input": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "mobile": "+61498765432",
        "postcode": "3000",
        "services": ["DELIVERY", "PAYMENT"]
      }
    }
  }'
```

---

## Type Definitions

### Lead

Represents a customer expression of interest.

```graphql
type Lead {
  id: ID!                    # Unique identifier
  name: String!              # Customer full name
  email: String!             # Customer email address
  mobile: String!            # Customer mobile phone number
  postcode: String!          # Customer postcode
  services: [LeadService!]!  # Array of selected services
  createdAt: DateTime!       # ISO 8601 timestamp of registration
  updatedAt: DateTime!       # ISO 8601 timestamp of last update
}
```

### LeadService

Represents an individual service selection.

```graphql
type LeadService {
  id: ID!            # Unique identifier
  serviceType: Service!  # Type of service selected
  createdAt: DateTime!   # ISO 8601 timestamp of when service was selected
}
```

### Service Enum

Available service types.

```graphql
enum Service {
  DELIVERY  # Delivery service
  PICKUP    # Pick-up service
  PAYMENT   # Payment service
}
```

### RegisterLeadInput

Input type for registering a new lead.

```graphql
input RegisterLeadInput {
  name: String!           # Required: Customer full name
  email: String!          # Required: Valid email address
  mobile: String!         # Required: Mobile phone number
  postcode: String!       # Required: Postcode
  services: [Service!]!   # Required: Array of at least one service type
}
```

**Validation Rules:**
- `name`: Non-empty string, trimmed
- `email`: Valid email format, unique (no duplicates allowed)
- `mobile`: Non-empty string, trimmed
- `postcode`: Non-empty string, trimmed
- `services`: Array containing at least one service, each must be `DELIVERY`, `PICKUP`, or `PAYMENT`

### DateTime Scalar

ISO 8601 formatted date/time string (e.g., `"2024-01-15T10:30:00.000Z"`).

---

## Error Handling

The API uses standard GraphQL error responses with error codes in the `extensions.code` field.

### Error Codes

| Code | Description | HTTP Equivalent |
|------|-------------|-----------------|
| `BAD_USER_INPUT` | Invalid input data or validation failure | 400 |
| `NOT_FOUND` | Requested resource not found | 404 |
| `INTERNAL_SERVER_ERROR` | Server-side error | 500 |

### Error Response Format

```json
{
  "errors": [
    {
      "message": "Error message describing what went wrong",
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

### Common Errors

#### Validation Error

**Triggered when:** Input validation fails (e.g., invalid email format, missing required fields)

```json
{
  "errors": [
    {
      "message": "Invalid email format",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

#### Duplicate Email Error

**Triggered when:** Attempting to register a lead with an email that already exists

```json
{
  "errors": [
    {
      "message": "A lead with email john.doe@example.com already exists",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

#### Lead Not Found Error

**Triggered when:** Querying a lead with an ID that doesn't exist

```json
{
  "errors": [
    {
      "message": "Lead with id clx1234567890 not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

#### Internal Server Error

**Triggered when:** Unexpected server-side error occurs

```json
{
  "errors": [
    {
      "message": "Failed to retrieve leads",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```

---

## Usage Examples

### JavaScript/TypeScript (Apollo Client)

```typescript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://brighte-eats-production.up.railway.app/',
  cache: new InMemoryCache(),
});

// Query all leads
const GET_LEADS = gql`
  query GetLeads {
    leads {
      id
      name
      email
      services {
        serviceType
      }
    }
  }
`;

const { data } = await client.query({ query: GET_LEADS });

// Register a new lead
const REGISTER_LEAD = gql`
  mutation RegisterLead($input: RegisterLeadInput!) {
    register(input: $input) {
      id
      name
      email
    }
  }
`;

const { data } = await client.mutate({
  mutation: REGISTER_LEAD,
  variables: {
    input: {
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '+61412345678',
      postcode: '2000',
      services: ['DELIVERY', 'PICKUP']
    }
  }
});
```

### Python (gql)

```python
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

transport = RequestsHTTPTransport(
    url="https://brighte-eats-production.up.railway.app/",
    use_json=True,
)

client = Client(transport=transport, fetch_schema_from_transport=True)

# Query all leads
query = gql("""
    query {
        leads {
            id
            name
            email
            services {
                serviceType
            }
        }
    }
""")

result = client.execute(query)

# Register a new lead
mutation = gql("""
    mutation RegisterLead($input: RegisterLeadInput!) {
        register(input: $input) {
            id
            name
            email
        }
    }
""")

variables = {
    "input": {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "+61412345678",
        "postcode": "2000",
        "services": ["DELIVERY", "PICKUP"]
    }
}

result = client.execute(mutation, variable_values=variables)
```

### Node.js (fetch)

```javascript
const response = await fetch('https://brighte-eats-production.up.railway.app/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      mutation RegisterLead($input: RegisterLeadInput!) {
        register(input: $input) {
          id
          name
          email
        }
      }
    `,
    variables: {
      input: {
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '+61412345678',
        postcode: '2000',
        services: ['DELIVERY', 'PICKUP']
      }
    }
  })
});

const data = await response.json();
```