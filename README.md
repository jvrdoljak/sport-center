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

```bash
cp .env.local .env
docker-compose up -d mysql
nvm use
npm install
```

### Prod mode

```bash
cp .env.prod .env
docker-compose up --build
nvm use
npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
