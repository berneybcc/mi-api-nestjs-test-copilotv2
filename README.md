# mi-api-nestjs-test-copilotv2

A complete NestJS API project with TypeScript, testing, and validation.

## Description

This is a [NestJS](https://nestjs.com/) project built with TypeScript. It includes a basic API structure with health check endpoints, validation, and comprehensive testing setup.

## Features

- RESTful API endpoints
- Global validation using class-validator
- Health check endpoint
- Unit tests with Jest
- End-to-end (e2e) tests
- ESLint and Prettier configuration
- TypeScript support

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode (hot reload)
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

The application will run on `http://localhost:3000`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint (returns status and timestamp)

## Test

```bash
# unit tests
$ npm run test

# watch mode
$ npm run test:watch

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e
```

## Build

```bash
$ npm run build
```

## Linting

```bash
# run linter
$ npm run lint

# format code
$ npm run format
```

## Project Structure

```
├── src/
│   ├── main.ts           # Application entry point
│   ├── app.module.ts     # Root module
│   ├── app.controller.ts # Main controller
│   ├── app.service.ts    # Main service
│   └── app.controller.spec.ts # Unit tests
├── test/
│   ├── app.e2e-spec.ts   # E2E tests
│   └── jest-e2e.json     # Jest E2E configuration
├── package.json
├── tsconfig.json         # TypeScript configuration
├── tsconfig.build.json   # Build-specific TS config
├── nest-cli.json         # NestJS CLI configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
└── .gitignore
```

## Technologies

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Jest](https://jestjs.io/) - Testing framework
- [class-validator](https://github.com/typestack/class-validator) - Validation decorators
- [class-transformer](https://github.com/typestack/class-transformer) - Object transformation

## License

UNLICENSED
