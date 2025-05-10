# @pk/server

This is the backend server of the PK Calendar, providing API endpoints for managing calendars, events, sessions and
users.
It is designed to work in conjunction with the [PK Calendar UI](../ui/README.md).

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Maintainers](#maintainers)
- [License](#license)

## Install

```bash
# from the root of the monorepo
npm install
```

## Usage

| Command             | Description                          |
|---------------------|--------------------------------------|
| `npm run build`     | Build the application for production |
| `npm run lint`      | Lint the code                        |
| `npm run lint:fix`  | Lint the code and fix issues         |
| `npm run serve`     | Start the server                     |
| `npm run start`     | Start the server in production mode  |
| `npm run typecheck` | Type check the code using TypeScript |

## API

The server provides the following API endpoints:

- **Calendar API**: Manage calendars
- **Event API**: Manage events
- **Options API**: Manage application options
- **Session API**: Handle authentication
- **User API**: Manage users

The full spec can be found in [v1.0.0](./docs/v1.0.0.json).

## Environment Variables

| Name                  | Description                                    |
|-----------------------|------------------------------------------------|
| `AUTH_SEED`           | Seed for authentication (default: `undefined`) |
| `AUTH_ADMIN_PASSWORD` | Admin password (default: `'q'`)                |
| `DEBUG`               | Debug mode (default: `false`)                  |
| `PG_DATABASE`         | PostgreSQL database name (default: `'pk'`)     |
| `PG_HOST`             | PostgreSQL host (default: `'localhost'`)       |
| `PG_PASSWORD`         | PostgreSQL password (default: `''`)            |
| `PG_PORT`             | PostgreSQL port (default: `6000`)              |
| `PG_USER`             | PostgreSQL user (default: `'pk-admin'`)        |
| `SCHEDULE_SERVICE_ON` | Enable schedule service (default: `false`)     |

## Maintainers

This project is maintained by [Bartłomiej Wąś](https://github.com/KT-Trez).

## License

[GPL-3.0-or-later](../../LICENSE) © Bartłomiej Wąś