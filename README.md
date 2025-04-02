# Task Manager Backend

A robust task management system built with Node.js, Express, TypeScript, and TypeORM.

## Features

- User authentication with JWT
- Task management (CRUD operations)
- Team management with member roles
- PostgreSQL database with TypeORM
- Swagger API documentation
- TypeScript for type safety
- Express.js for routing and middleware

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create the database:

```bash
createdb taskmanager
```

4. Start the development server:

```bash
npm run dev
```

## API Documentation

The API documentation is available at `http://localhost:5000/api-docs` when the server is running. It provides:

- Interactive API testing interface
- Detailed request/response schemas
- Authentication requirements
- Example requests
- Response codes and their meanings

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `PUT /api/auth/update` - Update user profile

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Teams

- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:teamId/members` - Get team members
- `POST /api/teams/:teamId/members` - Invite team member
- `DELETE /api/teams/:teamId/members/:userId` - Remove team member

## Development

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # TypeORM entities
├── routes/         # API routes
├── types/          # TypeScript type definitions
└── index.ts        # Application entry point
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run typeorm` - Run TypeORM CLI commands
- `npm run migration:generate` - Generate a new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration

## Deployment

### Prerequisites for Deployment

1. Set up a PostgreSQL database on your hosting provider
2. Configure environment variables for production
3. Set up a process manager (e.g., PM2)
4. Configure a reverse proxy (e.g., Nginx)

### Deployment Steps

1. Build the application:

```bash
npm run build
```

2. Install production dependencies:

```bash
npm install --production
```

3. Set up environment variables for production:

```bash
# Create .env.production
cp .env .env.production
# Edit .env.production with production values
```

4. Start the application with PM2:

```bash
pm2 start dist/index.js --name taskmanager
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

- All endpoints except registration and login require JWT authentication
- Passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- CORS is enabled for frontend access
- Input validation is performed on all requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
