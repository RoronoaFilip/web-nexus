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

#### Express Server API
- The API serves as the the main source of the data that the library inserts dynamically in the HTML.
- All data gets processed and sent to the library that just handles the dynamic HTML.

#### Socket Communication
- Socket utilization, not only for the Live Chat, but for other things (not yet determined) that will require periodical live updates.

#### Authorization Mechanism
- All Calls to the Backend will have to be authorized. Authorization will most likely be done with Json Web Tokens

#### We plan on using Redis for some yet unknown functionality
---
