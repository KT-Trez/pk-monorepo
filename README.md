# PK Calendar

[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

> PK Calendar system

PK Calendar is a solution for parsing and viewing WIiT schedule as a calendar. It also supports creating and managing
custom calendars and events.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

PK Calendar is designed to help manage university timetables and schedules. It allows users to create and manage
calendars and events with different permission levels for different user roles. It consists of a backend server, a web
UI, and a schedule parser service that fetches and parses the schedule from the university website.

## Install

This project uses [npm](https://www.npmjs.com/) for package management.

```bash
# from the root of the monorepo
npm install
```

## Usage

| Command             | Description                                                           |
|---------------------|-----------------------------------------------------------------------|
| `npm run build`     | Build all applications and packages for production                    |
| `npm run lint`      | Lint the code in all applications and packages                        |
| `npm run lint:fix`  | Lint the code in all applications and packages and fix issues         |
| `npm run serve`     | Start the development server for all applications                     |
| `npm run typecheck` | Type check the code in all applications and packages using TypeScript |

## Project Structure

This is a monorepo managed with [Turborepo](https://turbo.build/repo). It contains the following packages:

### Apps

- [apps/server](./apps/server): Backend server that offers CRUD operations for calendars, events, sessions, and users
- [apps/timetable-parser-service](./apps/timetable-parser-service): Service that parses schedule from the university
  website
- [apps/ui](./apps/ui): Web UI that provides a frontend for managing calendars, events, and users

### Packages

- [packages/ts-config](./packages/ts-config): Shared TypeScript configuration
- [packages/timetable-parser](./packages/timetable-parser-core): Core functionality for schedule parsing
- [packages/types](./packages/types): Shared TypeScript types
- [packages/utils](./packages/utils): Shared utilities

## Maintainers

This project is maintained by [Bartłomiej Wąś](https://github.com/KT-Trez).

## Contributing

Feel free to dive in! [Open an issue](https://github.com/yourusername/pk-plan/issues/new) or submit PRs.

## License

[GPL-3.0-or-later](LICENSE) © Bartłomiej Wąś