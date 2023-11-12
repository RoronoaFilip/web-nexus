# js_advanced_project - Name TBD
Project made for passing the JS Advanced Course @ FMI

# Project Overview

## Goal
- Simplify the Process of enhancing Websites with sophisticated Functionalities effortlessly.  
- The Project offers a Library, packaged with Webpack, providing Users with straightforward Functions to seamlessly integrate complex Logic into their HTML Files.

## Functionalities Available

1. **Live Chat**
   - Facilitate real-time communication on websites through an easy-to-use live chat functionality.

2. **Charts**
   - Integrate visually appealing and interactive charts to present data effectively.
   - They could be dynamic, get updated live all the time.
   
- *(More functionalities to be determined)*

## Implementation

### Backend Integration

1. **Express Server API**
   - The API serves as the primary data source for dynamic HTML content generation by the library.
   - Responsible for processing all data and forwarding it to the library for seamless integration.

2. **Socket Communication**
   - Utilizes sockets not only for the Live Chat but also for other Functionalities requiring periodic live updates yet to be determined.

3. **Authorization Mechanism**
   - All calls to the backend must undergo authorization.
   - Authorization is planned to be implemented using Json Web Tokens (JWT).

4. **Redis Integration**
   - **Usage:** Planned for some yet-to-be-determined functionality.
   - **Purpose:** Enhance the backend with Redis for optimized data storage, caching, or other potential use cases.

### Library
   - A Number of Functions, that call the Backend.
   - Dynamically append the received Data or HTML Elements in the HTML they are Used in.
   - Attach event listeners to the Elements.
---
