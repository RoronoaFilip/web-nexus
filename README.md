# Web Nexus

*Project created as part of the JS Advanced Course @ FMI*

*Project Contributors:*

- [Filip Filchev](https://github.com/RoronoaFilip)
- [Aleksandar I. Petrov](https://github.com/PetrovAlex1)

## Project Overview

### Goal

- `Web Nexus` simplifies the process of enhancing websites with complex functionalities effortlessly. The project offers
  a library, packaged with Webpack, providing users with straightforward functions to seamlessly integrate complex logic
  into their HTML files.
- Simple example:
    * I am building a Website and I want to integrade a Live Chat System. Through `Web Nexus` I can do it by just
      providing an empty div and some Configuration. Everything else is handled for me by `Web Nexus`.

### Functionalities Available

1. **Live Chat**
    - Facilitates real-time communication on websites through an easy-to-use live chat functionality.
    - The Communication is done through WebSockets.

2. **Infinite Scroll**

    - Provides the user with an easy way to integrate an infinite scroll and visualize content dynamically.
    - It is customizable. The User must provide us with `div` and `styles` for it as strings.
    - The `div` has placeholders for the `data` that we will replace.
    - We display them so the User has Control over how the information is displayed.

### Implementation

1. **Live Chat**
    * V1:
        - Done through a BackEnd Call and using a Transform Stream we generate the Chat HTML.
        - The SDK adds Event Listeners to the Chat Button and the Chat Form.
    * V2:
        - The Chat is Generated using Custom HTML Elements that the SDK creates.
        - They do everything themselves (the Event Listeners are Logic in the Classes).

2. **Infinite Scroll**
    * V1:
        - The User Provides URL, Authentication and a `Search Replacement Map`.
          + If the User chooses, he could append the URL, Authentication and Replacement Map
            in a `before callback` instead of providing them in the setup.
          + He can delete them in an `after callback`.
        - The `Search Replacement Map` is a Map that holds fields from the response with `true` or `false`
          value depending on if we need to replace them in the `div` with the value from the response.
        - We run the REST call, and we search the Response for Elements that match the Replacement Map.
        - We replace the Elements in the provided `div` and append it to the HTML.
        - The Response must be a JSON.
        - This is done so the User can have more control over the REST call (a lot of APIs require Pagination using
          Request
          Params).
    * V2:
        - The User does not provide us with sensitive information like URL or Authentication.
        - Instead, he provides us with a Callbacks that return Promises that Resolve in `Replacement Map`.
        - Note: This is not the `Search Replacement Map` from V1. It holds the information we directly replace in
          the `div`.
        - The User has more control over the REST call and the information he wants to display.
        - For example, here the API call could not be a JSON. The User needs to just transform it to a JSON.

#### Backend Integration

*The general idea for the backend is that all the needed data will come from it, including the HTML elements for
different functionalities. The library will append them where needed and attach event listeners.*

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
- The library is packaged with Webpack.

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

### Version 1.8.3
- Use import instead of require when importing a module and not a library.

### Version 1.8.2
- Add Successful Request check in all fetch calls. Make Demo an ejs app.

### Version 1.8.1
- Attach CSS to head. Fix EventListeners setup in Login/Register Form.

### Version 1.8.0
- Add Live Chat V2

### Version 1.7.1
- Adapt Infinite Scroll V1/V2 to classes. V2 extends V1.

### Version 1.7.0
- Add Infinite Scroll V2

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
- Added Postgress DB Dockerfile and docker-compose.

### Version 1.2.0
- Restructured the Directory Hierarchy.
- Added a Router Logic for the API.
- Added Initial Version of the Infinite Scroll Functionality.

### Version 1.1.0
- Added Live Chat Functionality.

### Version 1.0.0
- Initial commit.
