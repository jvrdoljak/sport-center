## Description

Sports complex would like to manage its sports classes through a new website. The sports complex
has a variety of sports, including baseball, basketball, and football. For each sport, they have classes,
which are usually held three times a week. The sports complex requires an admin dashboard where
its employees would be able to view, edit, and manage classes for each of the sports, change dates
and times for each week, and view users who applied for each course in a given period.

Assignment Requirements
- User registration with email and password
- Role-based authorization for enabling sports and user management
- Users should be able to filter and retrieve all sports classes, e.g.
/api/classes?sports=Basketball,Football
- Users should be able to retrieve details of each sports class (week schedule, class duration,
description), e.g. through endpoint /api/classes/{id}
- The user should be able to apply for a sport class
- Admin users should be able to manage sports classes (CRUD)
- API documentation should be made with Swagger
- Code should be stored in GitHub/GitLab repository

## Project setup

### Develop mode

Copy the values from .env.local into .env:
```bash
cp .env.local .env
```
Set and uncomment the next values in .env:
```bash
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD

DATABASE_USER
DATABASE_PASSWORD

JWT_SECRET
```
Run these commands:

```bash
docker network create sport-network
docker-compose up -d mysql
nvm use
pnpm install
pnpm migration:run
```

### Prod mode

Copy the values from .env.prod into .env:
```bash
cp .env.prod .env
```
Set and uncomment the next values in .env:
```bash
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD

DATABASE_USER
DATABASE_PASSWORD

JWT_SECRET
```
Run these commands:
```bash
docker network create sport-network
docker-compose up -d mysql
docker-compose up sport
```

## Compile and run the project

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```
## Database
### Migrations 
To generate migration run: 
```bash
pnpm migration:generate src/db/migrations/[migration-name] --dataSource src/db/data-source.ts
```

Replace [migration-name]. E.g.: ```src/db/migrations/InitialMigration ```
