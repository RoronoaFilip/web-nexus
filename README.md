# Web Nexus
Project made for passing the JS Advanced Course @ FMI

# Project Overview

## Goal
- `Web Nexus` simplifies the Process of enhancing Websites with complex Functionalities effortlessly.  
- The Project offers a Library, packaged with Webpack, providing Users with straightforward Functions to seamlessly integrate complex Logic into their HTML Files.
- Simple example:
     * I am building a Website and I want to integrade a Live Chat System. Through `Web Nexus` I can do it by just providing an empty div and some Configuration. Everything else is handled for me by `Web Nexus`.

## Functionalities Available

1. **Live Chat**
   - Facilitate real-time communication on websites through an easy-to-use live chat functionality.

2. **Infinite Scroll**
   - Provides the User with an easy way to integrade an Infinite Scroll and visualize whatever and however he wants to.
   
- *(More functionalities to be determined)*

## Implementation

### Backend Integration

* The General Idea for the Backend is that all the needed Data will come from it. Including the Html Elements for the different Functionalities.
* The Library will just append them where needed and will attach event Listeners.

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

# Versions

### Version 1.1.0
Add Live Chat Functionality

### Version 1.0.0
initial commit
