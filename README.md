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

## Versions

### Version 1.1.0
- Added Live Chat Functionality

### Version 1.0.0
- Initial commit
