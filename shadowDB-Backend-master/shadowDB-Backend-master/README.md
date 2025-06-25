# Blacklist Companies API

A REST API for managing blacklisted companies with role-based authentication (admin/user).

## Features

- TypeScript + Express
- MongoDB with Mongoose
- JWT Authentication
- Role-based access control (admin/user)
- CRUD operations for companies and users
- Public search endpoint
- Error handling
- ESLint + Prettier

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd blacklist-companies-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blacklist-companies
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Companies (Admin only)
- `POST /api/companies` - Create a new company
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get a specific company
- `PUT /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Delete a company

### Companies (Public)
- `GET /api/companies/search?query=searchterm` - Search companies

### Users (Admin only)
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Company
```json
POST /api/companies
{
  "names": ["Company Name", "Alternative Name"],
  "location": "City, Country",
  "owner": "Owner Name",
  "phone": "+1234567890",
  "email": "company@example.com",
  "logoUrl": "https://example.com/logo.png"
}
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## License

ISC 