# CareerNest Backend

A Node.js/TypeScript backend for the CareerNest application.

## Features

- User Authentication (Register, Login, Logout)
- JWT-based authorization
- PostgreSQL database with Drizzle ORM
- TypeScript for type safety
- Express.js web framework

## Prerequisites

- Node.js 16+
- PostgreSQL database
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/careernest-backend.git
cd careernest-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Deploying to Render

1. Create a new Web Service on render.com
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy!

## API Documentation

### Auth Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login with username/email and password
- POST `/api/auth/logout` - Logout user

### Protected Routes

All protected routes require Bearer token authentication:
```
Authorization: Bearer <your_jwt_token>
```

## License

MIT
