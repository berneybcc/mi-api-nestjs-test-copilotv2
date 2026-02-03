# University Grade Administration System - mi-api-nestjs-test-copilotv2

A comprehensive NestJS API for managing university subjects, teachers, groups, and assignments.

## Features

- 📚 **Subject Management**: Create, read, update, and soft delete subjects
- 👨‍🏫 **Teacher Management**: Manage teacher information and profiles
- 👥 **Group Management**: Organize students into groups by semester and year
- 🔗 **Assignment System**: Assign teachers to subjects and groups
- ✅ **Validation**: Comprehensive input validation with class-validator
- 📖 **API Documentation**: Interactive Swagger/OpenAPI documentation
- 🗄️ **Database**: PostgreSQL with TypeORM
- 🧪 **Testing**: Unit and integration tests with Jest

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL 15+ (or use Docker Compose)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/berneybcc/mi-api-nestjs-test-copilotv2.git
cd mi-api-nestjs-test-copilotv2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your database configuration.

4. Start PostgreSQL (using Docker):
```bash
docker-compose up -d
```

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The application will be running at `http://localhost:3000`

## API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api

## Available Endpoints

### Subjects
- `POST /admin/subjects` - Create a new subject
- `GET /admin/subjects` - List all subjects
- `GET /admin/subjects/:id` - Get subject by ID
- `PUT /admin/subjects/:id` - Update subject
- `DELETE /admin/subjects/:id` - Delete (soft) subject

### Teachers
- `POST /admin/teachers` - Create a new teacher
- `GET /admin/teachers` - List all teachers
- `GET /admin/teachers/:id` - Get teacher by ID
- `PUT /admin/teachers/:id` - Update teacher
- `DELETE /admin/teachers/:id` - Delete (soft) teacher

### Groups
- `POST /admin/groups` - Create a new group
- `GET /admin/groups` - List all groups
- `GET /admin/groups/:id` - Get group by ID
- `PUT /admin/groups/:id` - Update group
- `DELETE /admin/groups/:id` - Delete (soft) group

### Assignments
- `POST /admin/assignments/teacher-subject` - Assign teacher to subject
- `GET /admin/assignments/teacher-subjects` - List all teacher-subject assignments
- `DELETE /admin/assignments/teacher-subject/:id` - Delete assignment
- `POST /admin/assignments/teacher-group` - Assign teacher to group and subject
- `GET /admin/assignments/teacher-groups` - List all teacher-group assignments
- `DELETE /admin/assignments/teacher-group/:id` - Delete assignment

## Database Schema

### Entities

- **Subject (Materia)**: Represents academic subjects
- **Teacher (Profesor)**: Teacher information
- **Group (Grupo)**: Student groups by semester
- **TeacherSubjectAssignment**: Links teachers to subjects
- **TeacherGroupAssignment**: Links teachers to groups and subjects

All entities support soft deletion to maintain historical data.

## Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Linting and Formatting

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── admin/                    # Admin module
│   ├── admin.controller.ts   # REST endpoints
│   ├── admin.service.ts      # Business logic
│   ├── admin.module.ts       # Module definition
│   ├── admin.controller.spec.ts
│   └── admin.service.spec.ts
├── dto/                      # Data Transfer Objects
│   ├── create-subject.dto.ts
│   ├── create-teacher.dto.ts
│   ├── create-group.dto.ts
│   └── ...
├── entities/                 # TypeORM entities
│   ├── subject.entity.ts
│   ├── teacher.entity.ts
│   ├── group.entity.ts
│   └── ...
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=university_notes

# Application
PORT=3000
NODE_ENV=development
```

## Business Rules

1. A teacher cannot be assigned to the same subject multiple times (active assignments)
2. A teacher cannot be assigned to the same group-subject combination multiple times
3. All entities use soft deletion to preserve historical data
4. Unique constraints on subject codes, teacher emails, and group codes
5. Input validation ensures data integrity

## Technologies Used

- **NestJS**: Progressive Node.js framework
- **TypeORM**: ORM for TypeScript and JavaScript
- **PostgreSQL**: Relational database
- **Swagger**: API documentation
- **Jest**: Testing framework
- **class-validator**: Declarative validation
- **class-transformer**: Object transformation

## License

ISC

## Author

University Grade Administration System
