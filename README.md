# Web Nexus
*Project created as part of the JS Advanced Course @ FMI*

*Project Contributors:*
- [Filip Filchev](https://github.com/RoronoaFilip)
- [Aleksandar I. Petrov](https://github.com/PetrovAlex1)

## Project Overview

### Goal
   - `Web Nexus` simplifies the process of enhancing websites with complex functionalities effortlessly. The project offers a library, packaged with Webpack, providing users with straightforward functions to seamlessly integrate complex logic into their HTML files.
   - Simple example:
     * I am building a Website and I want to integrade a Live Chat System. Through `Web Nexus` I can do it by just providing an empty div and some Configuration. Everything else is handled for me by `Web Nexus`.

### Functionalities Available

1. **Live Chat**
   - Facilitates real-time communication on websites through an easy-to-use live chat functionality.

2. **Infinite Scroll**
   - Provides the user with an easy way to integrate an infinite scroll and visualize content dynamically.

*(More functionalities to be determined)*

### Implementation

#### Backend Integration

*The general idea for the backend is that all the needed data will come from it, including the HTML elements for different functionalities. The library will append them where needed and attach event listeners.*

1. **Express Server API**
   - Serves as the primary data source for dynamic HTML content generation by the library.
   - Responsible for processing all data and forwarding it to the library for seamless integration.

2. **Socket Communication**
   - Utilizes sockets for live chat and other functionalities requiring periodic live updates.

3. **Authorization Mechanism**
   - All calls to the backend must undergo authorization.
   - Authorization is implemented using Json Web Tokens (JWT).

4. **Redis Integration**
   - **Usage:** Planned for yet-to-be-determined functionality.
   - **Purpose:** Enhance the backend with Redis for optimized data storage, caching, or other potential use cases.

#### Library
- Consists of functions that call the backend.
- Dynamically appends received data or HTML elements in the appropriate HTML files.
- Attaches event listeners to the elements.

---
## How to run the Postgres Data Base

### Requirements
- [WSL](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-10#1-overview) If you are on Windows
- Docker Engine
- Docker Compose

### Steps to run the __Docker Compose File__

#### 1. Navigate to Project Directory
```
cd /path/to/your/project
```

#### 2. Run Docker Compose
```
docker compose up
```

If you want to run it in detached mode

```
docker compose up -d
```

#### 3. Verify Containers
```
docker ps
```

Note that sometimes it requires __sudo__ in front of the command.

---

## How to Make Migrations and Seeds

#### 1. Migrations
Open terminal and navigate to the __db__ folder
```
cd /src/config/db
```
Then type:
```
npx knex migrate:make <migration file name> --knexfile knexfile.js
```

#### 2. Seed
Open terminal and navigate to the __db__ folder
```
cd /src/config/db
```
Then type:
```
npx seed:make <seed file name> --knexfile knexfile.js
```

#### 3.Execution

In __package.json__ there are configured commands for both migrations and seeds. When you execute in terminal
one of the following commands:

```
npm run migrate
npm run seed
```

This instructs Knex to run the migration files that have not been executed yet. 
It looks at the knex_migrations table in your database to determine which migrations 
have been applied and which are pending, and it applies the pending migrations.

Knex maintains a knex_seed table (or a table name specified in the configuration)
in your database to track which seed files have been executed. When you run knex seed:run,
it checks this table to determine which seeds have already been applied.

---

## Versions

### Version 1.6.1
- Fix Authentication Bugs

### Version 1.6.0
- Create authentication with JWT. Add Register, Login and Authentication Logic in SDK and Backend.

### Version 1.5.0
- Create Infinite Scroll V2. Extract shared Infinite Scroll Logic in common.js.

### Version 1.4.0
- Add migrations and seeds with Knex.

### Version 1.3.1
- Move Config Files to a Config Directory.

### Version 1.3.0
- Addes Postgress DB Dockerfile and docker-compose.

### Version 1.2.0
- Restructured the Directory Hierarchy.
- Added a Router Logic for the API.
- Added Initial Version of the Infinite Scroll Functionality.

### Version 1.1.0
- Added Live Chat Functionality.

### Version 1.0.0
- Initial commit.
